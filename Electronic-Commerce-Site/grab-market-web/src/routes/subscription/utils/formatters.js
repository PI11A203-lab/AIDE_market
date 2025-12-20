/**
 * 날짜 포맷 유틸리티
 */
export const formatDate = (dateString, locale = 'ko') => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const localeMap = {
    'ko': 'ko-KR',
    'en': 'en-US',
    'ja': 'ja-JP'
  };
  return date.toLocaleDateString(localeMap[locale] || 'ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 통화 포맷 유틸리티
 */
export const formatCurrency = (amount) => {
  return `¥${amount.toLocaleString()}`;
};

/**
 * 날짜까지 남은 일수 계산
 */
export const calculateDaysUntil = (dateString) => {
  if (!dateString) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  const diff = target - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

