// 템플릿별 카테고리 적합성 매핑
// 카테고리 ID: 1=frontend, 2=backend, 3=image, 4=management, 5=infrastructure, 6=security, 7=documents

export const TEMPLATE_COMPATIBILITY_MAP = {
  // 1: 쇼핑몰
  1: {
    1: '⭕', // frontend - 매우 적합
    2: '⭕', // backend - 매우 적합
    3: '○', // image - 적합
    4: '○', // management - 적합
    5: '△', // infrastructure - 보통
    6: '△', // security - 보통
    7: '○'  // documents - 적합
  },
  // 2: 회사 홈페이지
  2: {
    1: '⭕', // frontend - 매우 적합
    2: '○', // backend - 적합
    3: '○', // image - 적합
    4: '△', // management - 보통
    5: '△', // infrastructure - 보통
    6: '✖', // security - 부적합
    7: '○'  // documents - 적합
  },
  // 3: 음악 페이지
  3: {
    1: '⭕', // frontend - 매우 적합
    2: '○', // backend - 적합
    3: '○', // image - 적합
    4: '△', // management - 보통
    5: '△', // infrastructure - 보통
    6: '✖', // security - 부적합
    7: '✖'  // documents - 부적합
  },
  // 4: iOS 앱
  4: {
    1: '○', // frontend - 적합
    2: '△', // backend - 보통
    3: '⭕', // image - 매우 적합
    4: '○', // management - 적합
    5: '✖', // infrastructure - 부적합
    6: '△', // security - 보통
    7: '✖'  // documents - 부적합
  },
  // 5: 안드로이드 앱
  5: {
    1: '○', // frontend - 적합
    2: '△', // backend - 보통
    3: '⭕', // image - 매우 적합
    4: '○', // management - 적합
    5: '✖', // infrastructure - 부적합
    6: '△', // security - 보통
    7: '✖'  // documents - 부적합
  },
  // 6: 건강앱
  6: {
    1: '○', // frontend - 적합
    2: '△', // backend - 보통
    3: '○', // image - 적합
    4: '○', // management - 적합
    5: '✖', // infrastructure - 부적합
    6: '△', // security - 보통
    7: '✖'  // documents - 부적합
  },
  // 7: 다이어리앱
  7: {
    1: '○', // frontend - 적합
    2: '△', // backend - 보통
    3: '○', // image - 적합
    4: '○', // management - 적합
    5: '✖', // infrastructure - 부적합
    6: '△', // security - 보통
    7: '△'  // documents - 보통
  },
  // 8: 비즈니스 분석
  8: {
    1: '△', // frontend - 보통
    2: '△', // backend - 보통
    3: '○', // image - 적합
    4: '⭕', // management - 매우 적합
    5: '⭕', // infrastructure - 매우 적합
    6: '△', // security - 보통
    7: '○'  // documents - 적합
  },
  // 9: 머신러닝 프로젝트
  9: {
    1: '△', // frontend - 보통
    2: '○', // backend - 적합
    3: '△', // image - 보통
    4: '○', // management - 적합
    5: '⭕', // infrastructure - 매우 적합
    6: '○', // security - 적합
    7: '○'  // documents - 적합
  },
  // 10: 시각화 대시보드
  10: {
    1: '⭕', // frontend - 매우 적합
    2: '○', // backend - 적합
    3: '○', // image - 적합
    4: '○', // management - 적합
    5: '⭕', // infrastructure - 매우 적합
    6: '△', // security - 보통
    7: '○'  // documents - 적합
  },
  // 11: 리포트 생성
  11: {
    1: '△', // frontend - 보통
    2: '△', // backend - 보통
    3: '○', // image - 적합
    4: '○', // management - 적합
    5: '△', // infrastructure - 보통
    6: '✖', // security - 부적합
    7: '⭕'  // documents - 매우 적합
  },
  // 12: 번역 시스템
  12: {
    1: '△', // frontend - 보통
    2: '○', // backend - 적합
    3: '✖', // image - 부적합
    4: '△', // management - 보통
    5: '△', // infrastructure - 보통
    6: '✖', // security - 부적합
    7: '⭕'  // documents - 매우 적합
  },
  // 13: 문서 자동화
  13: {
    1: '△', // frontend - 보통
    2: '△', // backend - 보통
    3: '✖', // image - 부적합
    4: '○', // management - 적합
    5: '△', // infrastructure - 보통
    6: '✖', // security - 부적합
    7: '⭕'  // documents - 매우 적합
  },
  // 14: 로고 디자인
  14: {
    1: '○', // frontend - 적합
    2: '✖', // backend - 부적합
    3: '⭕', // image - 매우 적합
    4: '△', // management - 보통
    5: '✖', // infrastructure - 부적합
    6: '✖', // security - 부적합
    7: '✖'  // documents - 부적합
  },
  // 15: 마케팅 이미지
  15: {
    1: '○', // frontend - 적합
    2: '✖', // backend - 부적합
    3: '⭕', // image - 매우 적합
    4: '○', // management - 적합
    5: '✖', // infrastructure - 부적합
    6: '✖', // security - 부적합
    7: '✖'  // documents - 부적합
  },
  // 16: 일러스트 생성
  16: {
    1: '○', // frontend - 적합
    2: '✖', // backend - 부적합
    3: '⭕', // image - 매우 적합
    4: '△', // management - 보통
    5: '✖', // infrastructure - 부적합
    6: '✖', // security - 부적합
    7: '✖'  // documents - 부적합
  }
};
