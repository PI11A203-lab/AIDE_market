/**
 * 리뷰 내용을 현재 언어 설정에 맞게 반환합니다.
 * 3개국어(ko, en, ja) 지원: API가 다국어 필드를 반환하면 해당 언어로 표시,
 * 단일 텍스트면 그대로 표시합니다.
 *
 * @param {Object} review - 리뷰 객체 (comment, review_text, text 또는 comment_ko/en/ja, review_text_ko/en/ja 등)
 * @param {string} lang - i18n 언어 코드 (ko, en, ja 또는 ko-KR, en-US 등)
 * @returns {string}
 */
export function getReviewContent(review, lang) {
  if (!review) return '';
  const baseLang = (lang || 'ko').split('-')[0];
  const langOrder = [baseLang, 'ko', 'en', 'ja'];

  const getFromMultilang = (prefix) => {
    for (const l of langOrder) {
      const val = review[`${prefix}_${l}`];
      if (val && typeof val === 'string') return val;
    }
    return null;
  };

  const fromComment = getFromMultilang('comment') ?? getFromMultilang('review_text') ?? getFromMultilang('text');
  if (fromComment) return fromComment;

  const plain =
    review.comment ?? review.review_text ?? review.text ?? '';
  if (typeof plain !== 'string') return '';

  try {
    const parsed = JSON.parse(plain);
    if (parsed && typeof parsed === 'object') {
      const val = parsed[baseLang] ?? parsed.ko ?? parsed.en ?? parsed.ja;
      if (val && typeof val === 'string') return val;
    }
  } catch {
    // plain text
  }
  return plain;
}
