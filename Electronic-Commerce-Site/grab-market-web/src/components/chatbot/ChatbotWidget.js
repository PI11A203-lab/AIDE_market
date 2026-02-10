import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { askOllama, buildPromptForAIDE } from "./chatbotApi";
import "./ChatbotWidget.css";

/**
 * 봇 답변이 "사이트 기능 설명"(전체 소개)인지 여부.
 * 이 경우 템플릿이 언급돼도 바로가기 버튼을 보이지 않음.
 */
function isSiteOverviewMessage(content) {
  const t = String(content || "");
  const lead = t.slice(0, 180);
  return (
    /(마켓플레이스|marketplace|マーケットプレイス|販売・購入|AIプロンプトを販売|AI\s*프로ンプ트.*판매)/.test(lead) &&
    (/입니다\.|입니다\s|\.\s*$|is\s+(a\s+)?marketplace|です\.|です\s|このサイト|사이트는|what\s+is\s+this|site\s+is/i.test(t) ||
      /(코딩\s*실력이\s*없어도|even\s+without\s+coding|コーディング.*なくても)/i.test(lead))
  );
}

/**
 * 봇 답변이 "템플릿 설명/유도"인지만 판별 (버튼 표시).
 * - 템플릿 페이지로 가라, 카테고리별 템플릿 확인해 보라 등 명시적 유도일 때만 true.
 * - 사이트 전체 소개에서 템플릿이 나열만 된 경우는 false.
 */
function isTemplateRelatedMessage(content) {
  const t = String(content || "");
  if (isSiteOverviewMessage(content)) return false;
  return (
    /템플릿\s*페이지\s*에서|카테고리별\s*템플릿\s*을\s*확인|템플릿을\s*확인해\s*보시고|상세\s*페이지로\s*이동/.test(t) ||
    (t.includes("템플릿 페이지") || (t.includes("템플릿") && /확인해\s*보시고|이동해\s*구매/.test(t))) ||
    /テンプレート\s*ページ\s*で|テンプレート\s*を\s*確認し|カテゴリ別\s*テンプレート|詳細\s*ページ\s*に\s*移動|クリックすると\s*詳細/.test(t) ||
    (t.includes("テンプレートページ") || (t.includes("テンプレート") && /確認してください|確認して|移動して|購入できます/.test(t))) ||
    /template\s+page|templates\s+by\s+categor|view\s+templates|go\s+to\s+(the\s+)?templates|click\s+to\s+view|detail\s+page/.test(t.toLowerCase()) ||
    (t.toLowerCase().includes("template") && /view|go\s+to|check\s+out|see\s+our\s+templates/.test(t.toLowerCase()))
  );
}

/** 채팅에 표시할 텍스트에서 (/templates) 등 경로 제거 */
function cleanMessageForDisplay(content) {
  return String(content || "")
    .replace(/\s*\(\/templates\)/g, "")
    .replace(/\s*\/templates\b/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "");
}

/* 도움말 항목: 리소스 페이지와 동일한 i18n 키 사용 (챗봇 창 안에서만 표시) */
const HELP_ITEM_KEYS = ["guide1", "guide2", "guide3", "faq1", "faq2"];

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconMessage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconHelp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/** 리소스 content 문자열을 간단 마크다운 스타일로 렌더링 */
function HelpContent({ content }) {
  if (!content) return null;
  const lines = content.split("\n");
  return (
    <div className="chatbot-help-content">
      {lines.map((line, index) => {
        const processBold = (text) => {
          const parts = text.split(/(\*\*.*?\*\*)/g);
          return parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i}>{part.slice(2, -2)}</strong>
            ) : (
              part
            )
          );
        };
        if (line.startsWith("## ")) return <h3 key={index} className="chatbot-help-h3">{processBold(line.replace("## ", ""))}</h3>;
        if (line.startsWith("### ")) return <h4 key={index} className="chatbot-help-h4">{processBold(line.replace("### ", ""))}</h4>;
        if (line.startsWith("#### ")) return <h5 key={index} className="chatbot-help-h5">{processBold(line.replace("#### ", ""))}</h5>;
        if (line.startsWith("- ")) return <li key={index} className="chatbot-help-li">{processBold(line.replace("- ", ""))}</li>;
        const numMatch = line.match(/^(\d+)\. (.+)$/);
        if (numMatch) return <li key={index} className="chatbot-help-li chatbot-help-li-ordered"><span className="chatbot-help-num">{numMatch[1]}.</span> {processBold(numMatch[2])}</li>;
        if (line.trim() === "") return <br key={index} />;
        if (line.includes("`") && !line.startsWith("```")) {
          const parts = line.split(/(`[^`]+`)/g);
          return (
            <p key={index} className="chatbot-help-p">
              {parts.map((part, i) =>
                part.startsWith("`") && part.endsWith("`") ? (
                  <code key={i} className="chatbot-help-code">{part.slice(1, -1)}</code>
                ) : (
                  <span key={i}>{processBold(part)}</span>
                )
              )}
            </p>
          );
        }
        return <p key={index} className="chatbot-help-p">{processBold(line)}</p>;
      })}
    </div>
  );
}

/** 로그인된 유저 이름 가져오기 (localStorage/sessionStorage) */
function getChatbotUserName() {
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.nickname || user?.name || user?.username || null;
  } catch {
    return null;
  }
}

/** 메인 페이지 언어 설정 → ko | ja | en */
function getChatbotLang(i18n) {
  const raw = (i18n?.language || "").toLowerCase();
  if (raw.startsWith("ja") || raw === "jp") return "ja";
  if (raw.startsWith("en")) return "en";
  return "ko";
}

/** 첫 인사말 (메인 페이지 언어에 맞춤) */
function getGreetingText(lang, userName) {
  if (lang === "ja") return userName ? `こんにちは 👋 ${userName}さん` : "こんにちは 👋";
  if (lang === "en") return userName ? `Hello 👋 ${userName}` : "Hello 👋";
  return userName ? `안녕하세요 👋 ${userName}님` : "안녕하세요 👋";
}

/** 단순 인사인지 판별 (한/일/영 짧은 인사) → true면 Ollama 호출 없이 짧은 답만 */
function isSimpleGreeting(text) {
  const s = (text || "").trim();
  if (!s || s.length > 35) return false;
  const lower = s.toLowerCase();
  const ko = /^(안녕|안녕하세요|하이|반가워)$/;
  const ja = /^(おはよう|おはいよう|おはようございます|こんにちは|こんばんは|やあ|おっす|はい|ねえ)$/;
  const en = /^(hello|hi|hey|hey there|good morning|good afternoon|good evening|gm|gmorning|howdy|yo)$/;
  return ko.test(s) || ja.test(s) || en.test(lower);
}

/** 단순 인사일 때 쓸 짧은 답 (메인 페이지 언어) */
function getShortHelpReply(lang) {
  if (lang === "ja") return "何かお手伝いしましょうか？";
  if (lang === "en") return "What can I help you with?";
  return "무엇을 도와드릴까요?";
}

export default function ChatbotWidget() {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("home");
  const [helpDetailId, setHelpDetailId] = useState(null);
  const [helpSearch, setHelpSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastReadCount, setLastReadCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const unreadCount = messages.length - lastReadCount;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (tab === "chat") setLastReadCount(messages.length);
  }, [tab, messages.length]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setTab("home");
      setHelpDetailId(null);
    }
    if (!isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => setIsOpen(false);

  const handleQuickQuestion = (text) => {
    if (!text?.trim() || isLoading) return;
    setInputValue("");
    setTab("chat");
    runSendMessage(text.trim());
  };

  const runSendMessage = async (text) => {
    const userMessage = { role: "user", content: text };
    const isFirstMessage = messages.length === 0;
    const lang = getChatbotLang(i18n);

    setMessages((prev) => [...prev, userMessage]);

    if (isFirstMessage) {
      const userName = getChatbotUserName();
      const greeting = getGreetingText(lang, userName);
      setMessages((prev) => [...prev, { role: "bot", content: greeting }]);
    }

    if (isSimpleGreeting(text)) {
      setMessages((prev) => [...prev, { role: "bot", content: getShortHelpReply(lang) }]);
      return;
    }

    setIsLoading(true);

    try {
      const prevMessages = messages.filter((m) => m.role === "user" || m.role === "bot").map((m) => ({ role: m.role, content: m.content }));
      const prompt = buildPromptForAIDE(text, prevMessages, i18n.language, isFirstMessage);
      const reply = await askOllama(prompt);
      setMessages((prev) => [...prev, { role: "bot", content: reply || "답변을 생성하지 못했어요. 다시 한 번 물어봐 주세요." }]);
    } catch (err) {
      const isCors =
        err.name === "TypeError" &&
        (err.message.includes("fetch") || err.message.includes("Failed to fetch") || err.message.includes("NetworkError"));
      const is404 = err.message.includes("404");
      let fallback;
      if (isCors) {
        fallback =
          "Ollama CORS 설정이 필요해요.\n\n" +
          "Windows에서:\n" +
          "[설정] → [시스템] → [정보] → [고급 시스템 설정] → [환경 변수]\n" +
          "변수 이름 OLLAMA_ORIGINS, 값 * 입력 후\n" +
          "Ollama 앱을 완전히 종료했다가 다시 실행해 주세요.";
      } else if (is404) {
        fallback =
          "Ollama가 404를 반환했어요.\n\n" +
          "1) Ollama 앱에서 지금 쓰는 모델 이름(예: gemma3:4b, llama2)을 확인하세요.\n" +
          "2) 브라우저에서 http://localhost:11434/api/tags 를 열어 설치된 모델 목록이 보이는지 확인해 보세요.\n" +
          "3) 모델이 없다면 Ollama 앱에서 해당 모델을 한 번 실행해 보세요.";
      } else {
        fallback =
          "지금은 AI 서버에 연결할 수 없어요.\n\n" +
          "1) Ollama 앱이 실행 중인지 확인해 주세요.\n" +
          "2) http://localhost:11434 접속 시 'Ollama is running'이 보이는지 확인해 주세요.\n" +
          "CORS 오류라면 환경 변수 OLLAMA_ORIGINS=* 설정 후 Ollama 재시작이 필요합니다.";
      }
      setMessages((prev) => [...prev, { role: "bot", content: fallback, error: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    runSendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-root">
      <button
        type="button"
        className="chatbot-trigger"
        onClick={handleToggle}
        aria-label={isOpen ? t("chatbot.close") : t("chatbot.open")}
      >
        <IconChat />
      </button>

      {isOpen && (
        <div className="chatbot-panel">
          <header className={`chatbot-header chatbot-header--dark ${tab === "chat" ? "chatbot-header--message" : ""} ${tab === "home" ? "chatbot-header--home" : ""}`}>
            <div className="chatbot-header-inner">
              <span className="chatbot-header-logo">
                {tab === "chat" && (
                  <img src={`${process.env.PUBLIC_URL || ""}/images/icons/favicon.png`} alt="" className="chatbot-header-favicon" />
                )}
                AIDE Market
              </span>
              <button type="button" className="chatbot-close chatbot-close--dark" onClick={handleClose} aria-label={t("chatbot.closeAria")}>
                <IconClose />
              </button>
            </div>
            {tab === "home" && (
              <>
                <p className="chatbot-header-greeting">{t("chatbot.greeting")}</p>
                <p className="chatbot-header-sub">{t("chatbot.greetingSub")}</p>
              </>
            )}
            {tab === "help" && (
              <p className="chatbot-header-title-only">{t("chatbot.help")}</p>
            )}
          </header>

          <div className="chatbot-body">
            {tab === "home" && (
              <div className="chatbot-home-screen">
                <section className="chatbot-section chatbot-section--first">
                  <button
                    type="button"
                    className="chatbot-card chatbot-card--message"
                    onClick={() => setTab("chat")}
                  >
                    <span className="chatbot-card-label">{t("chatbot.recentMessages")}</span>
                    <div className="chatbot-card-message-row">
                      <img src={`${process.env.PUBLIC_URL || ""}/images/chatbot/icon-agent.png`} alt="" className="chatbot-card-icon chatbot-card-icon--img" />
                      <div className="chatbot-card-text">
                        <span className="chatbot-card-main">
                          {messages.length > 0
                            ? (messages[messages.length - 1].content || "").slice(0, 30) + (messages[messages.length - 1].content?.length > 30 ? "…" : "")
                            : t("chatbot.startConversation")}
                        </span>
                        <span className="chatbot-card-meta">{t("chatbot.agentMeta")}</span>
                      </div>
                      <span className="chatbot-card-dot" />
                    </div>
                  </button>
                </section>
                <div className="chatbot-home-screen-scroll">
                  <section className="chatbot-section">
                    <div className="chatbot-card chatbot-card--status">
                      <img src={`${process.env.PUBLIC_URL || ""}/images/chatbot/icon-status-ok.png`} alt="" className="chatbot-card-icon chatbot-card-icon--img" />
                      <div className="chatbot-card-text">
                        <span className="chatbot-card-main">{t("chatbot.statusOk")}</span>
                        <span className="chatbot-card-meta">{t("chatbot.statusMeta")}</span>
                      </div>
                    </div>
                  </section>
                  <section className="chatbot-section">
                    <h3 className="chatbot-section-title">{t("chatbot.helpSearchTitle")}</h3>
                  <div className="chatbot-search-wrap">
                    <input
                      type="text"
                      className="chatbot-search"
                      placeholder={t("chatbot.searchPlaceholder")}
                      value={helpSearch}
                      onChange={(e) => setHelpSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (setTab("chat"), runSendMessage(helpSearch || t("chatbot.searchDefaultQuery")))}
                    />
                  </div>
                </section>
                <section className="chatbot-section">
                  <div className="chatbot-help-links">
                    <button type="button" className="chatbot-help-link" onClick={() => handleQuickQuestion(t("chatbot.queryGetSupport"))}>
                      {t("chatbot.getSupport")}
                      <IconArrow />
                    </button>
                    <button type="button" className="chatbot-help-link" onClick={() => handleQuickQuestion(t("chatbot.queryAideIntro"))}>
                      {t("chatbot.aideIntro")}
                      <IconArrow />
                    </button>
                    <button type="button" className="chatbot-help-link" onClick={() => handleQuickQuestion(t("chatbot.queryStudentDiscount"))}>
                      {t("chatbot.studentDiscount")}
                      <IconArrow />
                    </button>
                    <button type="button" className="chatbot-help-link" onClick={() => handleQuickQuestion(t("chatbot.queryFaq"))}>
                      {t("chatbot.faq")}
                      <IconArrow />
                    </button>
                  </div>
                </section>
                </div>
              </div>
            )}
            {tab === "help" && (
              <div className="chatbot-home-screen chatbot-help-screen">
                {helpDetailId == null ? (
                  <section className="chatbot-section">
                    <p className="chatbot-help-intro">{t("chatbot.helpIntro")}</p>
                    <div className="chatbot-help-links">
                      {HELP_ITEM_KEYS.map((key) => (
                        <button
                          key={key}
                          type="button"
                          className="chatbot-help-link"
                          onClick={() => setHelpDetailId(key)}
                        >
                          {t(`resources.items.${key}.title`)}
                          <IconArrow />
                        </button>
                      ))}
                    </div>
                  </section>
                ) : (
                  <div className="chatbot-help-detail">
                    <button
                      type="button"
                      className="chatbot-help-back"
                      onClick={() => setHelpDetailId(null)}
                      aria-label={t("chatbot.backToList")}
                    >
                      <IconBack />
                      <span>{t("chatbot.backToList")}</span>
                    </button>
                    <h2 className="chatbot-help-detail-title">{t(`resources.items.${helpDetailId}.title`)}</h2>
                    <p className="chatbot-help-detail-desc">{t(`resources.items.${helpDetailId}.description`)}</p>
                    <HelpContent content={t(`resources.items.${helpDetailId}.content`)} />
                  </div>
                )}
              </div>
            )}
            {tab === "chat" && (
              <>
                <div className="chatbot-messages">
                  {messages.length === 0 && (
                    <div className="chatbot-welcome">
                      <strong>{t("chatbot.welcomeTitle")}</strong>
                      <br />
                      {t("chatbot.welcomeSub")}
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`chatbot-message-row ${msg.role === "user" ? "chatbot-message-row--user" : ""}`}>
                      <div className={`chatbot-message ${msg.role} ${msg.error ? "error" : ""}`}>
                        {msg.role === "bot" ? cleanMessageForDisplay(msg.content) : msg.content}
                      </div>
                      {msg.role === "bot" && isTemplateRelatedMessage(msg.content) && (
                        <button
                          type="button"
                          className="chatbot-msg-action chatbot-msg-action--templates"
                          onClick={() => history.push("/templates")}
                        >
                          {t("chatbot.goToTemplates")}
                        </button>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="chatbot-message bot">
                      <span style={{ opacity: 0.7 }}>{t("chatbot.thinking")}</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chatbot-input-wrap">
            <textarea
              ref={inputRef}
              className="chatbot-input"
              placeholder={t("chatbot.inputPlaceholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={isLoading}
            />
            <button
              type="button"
              className="chatbot-send"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              aria-label={t("chatbot.send")}
            >
              <IconSend />
            </button>
          </div>
              </>
            )}
          </div>

          <nav className="chatbot-tabs chatbot-tabs--dark">
            <button
              type="button"
              className={`chatbot-tab chatbot-tab--dark ${tab === "home" ? "chatbot-tab--active" : ""}`}
              onClick={() => setTab("home")}
              aria-label={t("chatbot.home")}
            >
              <IconHome />
              <span>{t("chatbot.home")}</span>
            </button>
            <button
              type="button"
              className={`chatbot-tab chatbot-tab--dark ${tab === "chat" ? "chatbot-tab--active" : ""}`}
              onClick={() => setTab("chat")}
              aria-label={t("chatbot.messages")}
            >
              <span className="chatbot-tab-icon-wrap">
                <IconMessage />
                {unreadCount > 0 && <span className="chatbot-tab-badge chatbot-tab-badge--red">{unreadCount}</span>}
              </span>
              <span>{t("chatbot.messages")}</span>
            </button>
            <button
              type="button"
              className={`chatbot-tab chatbot-tab--dark ${tab === "help" ? "chatbot-tab--active" : ""}`}
              onClick={() => { setTab("help"); setHelpDetailId(null); }}
              aria-label={t("chatbot.help")}
            >
              <IconHelp />
              <span>{t("chatbot.help")}</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
