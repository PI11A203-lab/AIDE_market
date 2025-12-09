import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      common: {
        backHome: '홈으로 가기',
        loading: '로딩 중...',
        logout: '로그아웃',
        login: '로그인',
      },
      teamBuilder: {
        introTitle: '이상적인 AI 팀을 구성해보세요',
        introSubtitle: '최대 {{max}}명까지 선택해 팀을 만들 수 있어요',
        availableTitle: '선택 가능한 AI 개발자',
        teamTitle: 'AI 팀',
        noDevelopers: '선택된 개발자가 없습니다',
        selectDevelopers: '개발자를 선택해주세요',
        teamTotal: '팀 합계',
        namePlaceholder: '팀 이름을 입력하세요',
        save: '팀 저장하기',
        saving: '저장 중...',
        tipTitle: '프로덕트 문서',
        tipDescription: '다양한 전문성을 가진 팀을 구성해 최고의 결과를 만들어보세요!',
        scrollLeft: '왼쪽으로 스크롤',
        scrollRight: '오른쪽으로 스크롤',
      },
      developerCard: {
        tech: '기술',
        creative: '창의',
        reliable: '신뢰',
        add: '추가',
        remove: '제거',
      },
      synergy: {
        label: '팀 시너지',
        exceptional: '최고 수준',
        excellent: '매우 우수',
        good: '좋음',
        keepBuilding: '조금 더 보강하세요',
      },
      chart: {
        title: '팀 스탯',
      },
      header: {
        title: 'AIDE Market',
      },
      home: {
        nav: {
          marketplace: '마켓플레이스',
          rankings: '랭킹',
          teams: '팀',
          resources: '리소스',
        },
        searchPlaceholder: '개발자 검색...',
        heroTitle: '최고의 AI 개발자를 발견하고 함께 만들어가세요',
        heroSubtitle: '{{count}}개 이상의 검증된 AI 개발자가 당신의 아이디어를 실현할 준비가 되어 있습니다. 지금 바로 팀을 구성해 보세요.',
        heroPrimary: '지금 탐색',
        heroSecondary: '더 알아보기',
        rankingTitle: '이달의 Top Ranking',
        rankingSubtitle: '이번 달 최고의 성과를 낸 AI 개발자',
        viewAll: '전체 보기',
        sort: {
          download: '다운로드 순',
          rating: '평점 높은 순',
          price: '가격 낮은 순',
          priceDesc: '최근 등록 순',
        },
        tabs: {
          all: '전체',
          fe: '프론트엔드',
          be: '백엔드',
          design: '디자인',
          mg: 'AI/ML',
        },
      },
    },
  },
  en: {
    translation: {
      common: {
        backHome: 'Back to Home',
        loading: 'Loading...',
        logout: 'Logout',
        login: 'Login',
      },
      teamBuilder: {
        introTitle: 'Build your ideal AI team',
        introSubtitle: 'Select up to {{max}} members to craft your dream team',
        availableTitle: 'Available AI developers',
        teamTitle: 'AI Team',
        noDevelopers: 'No developers selected',
        selectDevelopers: 'Please select developers',
        teamTotal: 'Team Total',
        namePlaceholder: 'Enter a team name',
        save: 'Save Team',
        saving: 'Saving...',
        tipTitle: 'Product Documentation',
        tipDescription: 'Build a diverse team to get the best results!',
        scrollLeft: 'Scroll left',
        scrollRight: 'Scroll right',
      },
      developerCard: {
        tech: 'Tech',
        creative: 'Creative',
        reliable: 'Reliable',
        add: 'Add',
        remove: 'Remove',
      },
      synergy: {
        label: 'Team Synergy',
        exceptional: 'Exceptional',
        excellent: 'Excellent',
        good: 'Good',
        keepBuilding: 'Keep building',
      },
      chart: {
        title: 'Team Stats',
      },
      header: {
        title: 'AIDE Market',
      },
      home: {
        nav: {
          marketplace: 'Marketplace',
          rankings: 'Rankings',
          teams: 'Teams',
          resources: 'Resources',
        },
        searchPlaceholder: 'Search developers...',
        heroTitle: 'Discover, Create and Hire Top AI Developers',
        heroSubtitle: 'Browse through {{count}}+ verified AI developers ready to bring your vision to life. Start building your dream team today.',
        heroPrimary: 'Explore Now',
        heroSecondary: 'Learn More',
        rankingTitle: "This Month's Top Ranking",
        rankingSubtitle: 'Best performing AI developers of the month',
        viewAll: 'View All',
        sort: {
          download: 'Most Downloaded',
          rating: 'Highest Rated',
          price: 'Price: Low to High',
          priceDesc: 'Recently Added',
        },
        tabs: {
          all: 'All Developers',
          fe: 'Frontend',
          be: 'Backend',
          design: 'Design',
          mg: 'AI/ML',
        },
      },
    },
  },
  ja: {
    translation: {
      common: {
        backHome: 'ホームに戻る',
        loading: '読み込み中...',
        logout: 'ログアウト',
        login: 'ログイン',
      },
      teamBuilder: {
        introTitle: '理想のAIチームを構成しましょう',
        introSubtitle: '最大 {{max}} 人まで選択してチームを作成できます',
        availableTitle: '利用可能なAI開発者',
        teamTitle: 'AIチーム',
        noDevelopers: '開発者が選択されていません',
        selectDevelopers: '開発者を選択してください',
        teamTotal: 'チーム合計',
        namePlaceholder: 'チーム名を入力してください',
        save: 'チームを保存',
        saving: '保存中...',
        tipTitle: 'プロダクトドキュメント',
        tipDescription: '多様な専門分野のチームを作り、最高の結果を得ましょう！',
        scrollLeft: '左にスクロール',
        scrollRight: '右にスクロール',
      },
      developerCard: {
        tech: 'テック',
        creative: 'クリエイティブ',
        reliable: '信頼性',
        add: '追加',
        remove: '削除',
      },
      synergy: {
        label: 'チームシナジー',
        exceptional: '最高',
        excellent: 'とても良い',
        good: '良い',
        keepBuilding: 'さらに強化しましょう',
      },
      chart: {
        title: 'チームスタッツ',
      },
      header: {
        title: 'AIDE Market',
      },
      home: {
        nav: {
          marketplace: 'マーケット',
          rankings: 'ランキング',
          teams: 'チーム',
          resources: 'リソース',
        },
        searchPlaceholder: '開発者を検索...',
        heroTitle: '最高のAI開発者を見つけ、共に創り上げましょう',
        heroSubtitle: '{{count}}以上の認証済みAI開発者が、あなたのアイデアを形にする準備ができています。今すぐ理想のチームを組んでみましょう。',
        heroPrimary: '今すぐ探索',
        heroSecondary: 'さらに詳しく',
        rankingTitle: '今月のトップランキング',
        rankingSubtitle: '今月最も優秀なAI開発者',
        viewAll: 'すべて見る',
        sort: {
          download: 'ダウンロード順',
          rating: '評価が高い順',
          price: '価格が低い順',
          priceDesc: '最近追加順',
        },
        tabs: {
          all: 'すべて',
          fe: 'フロントエンド',
          be: 'バックエンド',
          design: 'デザイン',
          mg: 'AI/ML',
        },
      },
    },
  },
};

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('appLanguage');
  if (stored) return stored;
  const browserLang = navigator.language?.split('-')[0];
  return ['ko', 'ja', 'en'].includes(browserLang) ? browserLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('appLanguage', lng);
  }
});

export default i18n;

