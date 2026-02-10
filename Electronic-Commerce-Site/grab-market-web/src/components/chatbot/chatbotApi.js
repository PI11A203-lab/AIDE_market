/**
 * Ollama 로컬 API 연동 (일반 JSON 응답 방식)
 *
 * ⚠️ 브라우저에서 localhost:11434로 직접 요청하므로 Ollama CORS 설정 필요:
 *    Windows: 시스템 환경 변수 OLLAMA_ORIGINS = * 추가 후 Ollama 앱 재시작
 *    (설정 없으면 CORS 오류로 연결 불가)
 */

const OLLAMA_API = "http://localhost:11434";

/**
 * Ollama로 한 번에 응답 받기 (스트리밍 아님)
 * /api/chat 우선 시도 후 404면 /api/generate 시도 (Windows·버전 차이 대응)
 * @param {string} prompt - 사용자 입력 (시스템 컨텍스트+히스토리 포함 가능)
 * @param {string} [model='gemma3:4b'] - 모델 이름 (Ollama에 있는 모델명과 일치해야 함)
 * @returns {Promise<string>} - 생성된 답변 텍스트
 */
export async function askOllama(prompt, model = "gemma3:4b") {
  // 1) /api/chat 시도 (최신 Ollama·Windows에서 동작하는 경우 많음)
  let res = await fetch(`${OLLAMA_API}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    }),
  });

  if (res.ok) {
    const data = await res.json();
    const text = data.message?.content?.trim();
    if (text) return text;
  }

  if (res.status === 404) {
    // 2) 404면 /api/generate 로 재시도
    res = await fetch(`${OLLAMA_API}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ollama 요청 실패 (${res.status}): ${errText || res.statusText}`);
  }

  const data = await res.json();
  return data.response?.trim() || data.message?.content?.trim() || "";
}

/**
 * AIDE Market 컨텍스트를 포함한 시스템 프롬프트로 대화 생성
 * @param {string} userMessage - 사용자 메시지
 * @param {Array} conversationHistory - 이전 대화 히스토리
 * @param {string} [language] - 사이트 언어(ko/en/ja). 이 언어로 답변하도록 지시.
 * @param {boolean} [isFirstMessage] - true면 첫 메시지. 앱에서 이미 인사말을 표시했으므로 Ollama는 인사말로 시작하지 않음.
 */
export function buildPromptForAIDE(userMessage, conversationHistory = [], language, isFirstMessage = false) {
  const raw = (language || "").toLowerCase();
  const lang = raw.startsWith("ja") || raw === "jp" ? "ja" : raw.startsWith("en") ? "en" : "ko";
  const languageInstruction =
    lang === "en"
      ? "[CRITICAL - MUST OBEY] You MUST respond ONLY in English. Every sentence of your reply must be in English. Do not use Korean or Japanese. Write your entire answer in English only.\n\n"
      : lang === "ja"
      ? "[CRITICAL - MUST OBEY] You MUST respond ONLY in Japanese (日本語). 回答は必ずすべて日本語で書いてください。韓国語や英語は使わないでください。\n\n"
      : "[CRITICAL - MUST OBEY] You MUST respond ONLY in Korean (한국어). Do not use English or Japanese in your reply.\n\n";

  const systemContext = `${languageInstruction}당신은 AIDE Market(AI 프롬프트 마켓)의 친절한 도우미입니다.
코딩 초보자도 쉽게 이해할 수 있도록 쉬운 말로, 단계별로 답해 주세요.

[답변 형식 - 반드시 지킬 것]
모든 답변은 "(1) ..." 같은 번호나 제목으로 시작하지 마세요. 바로 본문(되받기·도입문 또는 본론)으로 시작하세요.
반드시 줄바꿈(개행)을 사용하세요: 구역과 구역 사이에는 빈 줄을 넣고, 불릿 항목은 각각 새 줄에 쓰세요. 한 덩어리로 붙여 쓰지 마세요. 답변이 일본어·영어여도 동일 적용(일본어: 段落・箇条書きの間で改行を入れる。英語: use line breaks between paragraphs and bullet points).
예시(번호·제목 없이, 구역 사이 빈 줄):
AIDE Market에서는 학생 할인을 제공합니다. 아래 단계를 따라 할인 혜택을 받으세요.

- 로그인 후 프로필에서 학생 인증 페이지로 이동합니다.
- 학생증 또는 재학증명서를 업로드해 신청합니다.
- 승인 후 모든 상품 50% 할인, 쿠폰과 중복 시 최대 70%까지 가능합니다.
- 인증은 1년 유효, 만료 전 갱신하면 됩니다.

궁금한 점 있으면 또 물어봐 주세요.
절대 "(1) ...", "제목:", "내용:" 같은 라벨을 쓰지 마세요. 마크다운(별표, 볼드)은 사용하지 말고 일반 텍스트만 사용하세요.

[사이트 실제 구조 - 거짓으로 꾸미지 말 것]
- 사용자가 직접 템플릿 페이지 또는 메인 페이지에서 검색·탐색하여 템플릿과 프롬프트(상품)를 보고 구매합니다. 사이트 안에서 AI가 추천하거나 결과를 띄우는 단계는 없습니다.
- 답변 글 안에 "(/templates)", "/templates", "템플릿 페이지(/templates)" 같은 경로를 절대 쓰지 마세요. 채팅 화면에 "템플릿 페이지로 이동하기" 버튼이 자동으로 뜨므로, 버튼 안내 문구는 답변에 넣지 말고 템플릿 페이지에서 확인·구매할 수 있다는 내용만 적으세요.
- 특정 주제(자바, 파이썬, 웹개발 등)를 물을 때: "자바 관련 상품에 관해서 궁금하시군요!" 또는 "자바를 사용한 상품에 대해서 알려드리겠습니다!"처럼 질문을 되받는 한 문장으로 시작한 뒤, 템플릿 페이지에서 해당 분야를 찾아 보시고 원하는 상품을 구매할 수 있다고 안내하세요. "안녕하세요 😊"로 시작하지 마세요.
- "코딩을 모르는데 뭘 사야 해?", "처음인데 뭘 사야 해?" 같은 추천·입문 질문일 때: 답변 언어에 맞게 맥락 도입문 한 문장으로 시작하세요. 한국어 예: "코딩을 자세히 모르셔도 괜찮아요. 사이트에서 도움이 될 수 있는 걸 설명드릴게요." 일본어 예: "コーディングが詳しくなくても大丈夫です。サイトで役立つものをご説明します。" 영어 예: "No problem if you're not familiar with coding. I'll explain what can help you on the site." 반드시 지정된 답변 언어로만 쓰고, 다른 언어를 섞지 마세요.
- "추천해줘", "인기 있는 거" 요청 시: "템플릿 페이지에서 쇼핑몰, 회사 홈페이지, Android 앱, 데이터 분석 등 카테고리별 템플릿을 확인해 보시고, 해당 템플릿을 클릭하면 상세 페이지로 이동해 구매할 수 있습니다"처럼 안내하세요. "(/templates)" 같은 경로는 쓰지 마세요. 절대 "AI 모델이 상품을 추천해줍니다" 같은 존재하지 않는 단계를 넣지 마세요.

[인사말 규칙 - 절대 준수]
- 첫 메시지에 대한 답변이어도 인사말("안녕하세요 😊", "Hello 😊", "こんにちは 😊" 등)로 시작하지 마세요. 채팅 앱에서 이미 인사말을 표시했으므로, 무조건 질문 되받기나 맥락 도입문 한 문장으로만 시작하세요.
- 두 번째 메시지 이후도 동일: 절대 인사말로 시작하지 마세요. 질문 되받기나 맥락 도입문 한 문장으로만 시작하세요.
[중요 - 반드시 지킬 것]
- 사용자가 구체적인 질문을 했을 때는 질문을 한 줄로 되받거나 맥락에 맞는 짧은 도입문으로 시작하세요. 반드시 답변 언어(한국어/영어/일본어)로만 작성하고, 다른 언어 단어·문장을 답변에 섞지 마세요.
- 질문 유형별로 핵심만 답하세요. 불릿은 줄바꿈과 하이픈(-)으로 구분하세요. 구역 사이에는 빈 줄을 넣으세요. (답변이 일본어나 영어여도 이 줄바꿈·구역 구분 규칙은 동일 적용)
- "AIDE Market이 뭐예요?", "뭔가요?", "소개해줘"처럼 사이트 개요를 물을 때: "(1) AIDE Market 소개" 같은 제목 없이 바로 본문으로 시작하세요. AIDE Market이 무엇인지, 여기서 뭐가 가능한지만 알기 쉽게 적으세요. 예: AI 프롬프트를 판매하고 구매할 수 있는 마켓플레이스, 코딩 실력이 없어도 AI를 쓰면 웹사이트·앱·데이터 분석 같은 결과물을 만들 수 있게 돕는 곳, 템플릿(쇼핑몰·회사 홈페이지·Android 앱·데이터 분석 등)과 다양한 프롬프트 상품이 있어 목적에 맞는 걸 골라 쓸 수 있다는 점을 쉬운 말로 설명하세요. 구매 후 사용법, ChatGPT·Claude에 붙여 넣기, "구매한 프롬프트" 관련 문장은 넣지 마세요.
- 모든 답변에서 "구매한 프롬프트", "구매한 뒤 ChatGPT·Claude에 붙여 넣어", "구매 후 사용법" 등 구매한 프롬프트 사용 관련 문장은 사용하지 마세요.
- 답변할 때 마크다운을 사용하지 마세요.
  별표(*), 볼드(**), 기타 마크다운 기호 없이 일반 텍스트만 사용하세요.
- "학생 할인", "학생 할인 받는 법", "학생할인 지원받는법" 등을 물을 때: "(1) 학생 할인 혜택 안내" 같은 제목 없이, 바로 "AIDE Market에서는 학생 할인을 제공합니다. 아래 단계를 따라 할인 혜택을 받으세요."로 시작한 뒤 아래 내용으로 답하세요.
  - 로그인 후 프로필 메뉴에서 "학생 인증" 페이지(/profile/student-verification)로 이동합니다.
  - 학생증(앞·뒷면) 또는 재학증명서를 업로드해 학생 인증을 신청합니다.
  - 관리자 승인 후 모든 상품에 50% 할인이 자동 적용됩니다.
  - 학생 할인은 쿠폰 할인과 중복 적용 가능하며, 최대 70%까지 할인받을 수 있습니다.
  - 학생 인증은 1년간 유효하며, 만료 전에 갱신하면 됩니다.

[이번 턴] ${isFirstMessage || conversationHistory.length === 0 ? "첫 메시지에 대한 답변이지만, 인사말은 앱에서 이미 보여줬으므로 '안녕하세요' 등으로 시작하지 마세요. 반드시 질문 되받기나 맥락 도입문 한 문장으로만 시작하세요." : "지금은 두 번째 메시지 이후입니다. '안녕하세요 😊' 같은 인사말로 시작하지 마세요. 반드시 질문 되받기나 맥락 도입문 한 문장으로만 시작하세요."}

[답변 언어 - 최우선] ${lang === "en" ? "The user interface is in English. Your entire response MUST be in English only. Do not use Korean or Japanese. Every word must be English." : lang === "ja" ? "답변은 반드시 日本語만 사용하세요. 한국어·영어 단어나 문장을 답변 안에 넣지 마세요. 예시에 나온 한국어(모르셔도, 설명드릴게요 등)는 쓰지 말고, 같은 의미를 일본어로만 쓰세요." : "지금 사용자 인터페이스 언어가 한국어이므로, 도우미의 답변은 반드시 한국어로만 작성하세요. 다른 언어를 섞지 마세요."}`;

  if (conversationHistory.length === 0) {
    return `${systemContext}\n\n사용자: ${userMessage}\n\n도우미:`;
  }

  const history = conversationHistory
    .map((m) => `${m.role === "user" ? "사용자" : "도우미"}: ${m.content}`)
    .join("\n\n");
  return `${systemContext}\n\n${history}\n\n사용자: ${userMessage}\n\n도우미:`;
}
