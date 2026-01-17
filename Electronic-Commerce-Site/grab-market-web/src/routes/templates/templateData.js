// 템플릿 상세 데이터 매핑 (카테고리 기반 구조)
export const TEMPLATE_DETAILS_MAP = {
  // 웹개발 카테고리 (1-3)
  1: {
    category: 'web',
    name: '쇼핑몰',
    name_ja: 'ショッピングモール',
    name_en: 'Shopping Mall',
    description: '온라인 쇼핑몰 구축을 위한 AI 상품 세트. 상품 관리, 결제 시스템, 장바구니 등 전자상거래 기능을 완벽하게 지원합니다.',
    description_ja: 'オンラインショッピングモール構築のためのAI商品セット。商品管理、決済システム、ショッピングカートなどの電子商取引機能を完全にサポートします。',
    description_en: 'AI product set for building online shopping malls. Fully supports e-commerce features such as product management, payment systems, and shopping carts.',
    projectDescription: '전자상거래 플랫폼 구축을 위한 완전한 AI 팀을 구성했습니다. 상품 등록 및 관리부터 결제 처리, 주문 관리까지 온라인 쇼핑몰 운영에 필요한 모든 기능을 지원합니다.',
    projectDescription_ja: '電子商取引プラットフォーム構築のための完全なAIチームを構成しました。商品登録および管理から決済処理、注文管理まで、オンラインショッピングモールの運営に必要なすべての機能をサポートします。',
    projectDescription_en: 'We have assembled a complete AI team for building an e-commerce platform. We support all the functions necessary for operating an online shopping mall, from product registration and management to payment processing and order management.',
    whySelected: '쇼핑몰은 상품 관리, 장바구니, 결제, 주문 처리 등 다양한 기능이 필요합니다. 이 템플릿은 프론트엔드 UI, 백엔드 API, 결제 연동, 데이터베이스 관리 AI를 포함하여, 완전한 전자상거래 시스템을 구축할 수 있도록 구성했습니다.',
    whySelected_ja: 'ショッピングモールには、商品管理、ショッピングカート、決済、注文処理など、さまざまな機能が必要です。このテンプレートは、フロントエンドUI、バックエンドAPI、決済連携、データベース管理AIを含めて、完全な電子商取引システムを構築できるように構成しました。',
    whySelected_en: 'Shopping malls require various functions such as product management, shopping carts, payments, and order processing. This template includes frontend UI, backend API, payment integration, and database management AI to enable building a complete e-commerce system.',
    aiDescriptions: [
      '상품 관리: 상품 등록, 수정, 삭제 및 재고 관리',
      '장바구니: 쇼핑 카트 기능 및 세션 관리',
      '결제 시스템: 다양한 결제 수단 연동 및 처리',
      '주문 관리: 주문 조회, 배송 추적, 환불 처리',
      '회원 관리: 가입, 로그인, 프로필 관리',
      '리뷰 시스템: 상품 리뷰 및 평점 관리'
    ],
    aiDescriptions_ja: [
      '商品管理: 商品登録、修正、削除および在庫管理',
      'ショッピングカート: ショッピングカート機能およびセッション管理',
      '決済システム: 多様な決済手段連携および処理',
      '注文管理: 注文照会、配送追跡、返金処理',
      '会員管理: 登録、ログイン、プロフィール管理',
      'レビューシステム: 商品レビューおよび評価管理'
    ],
    aiDescriptions_en: [
      'Product Management: Product registration, modification, deletion, and inventory management',
      'Shopping Cart: Shopping cart functionality and session management',
      'Payment System: Integration and processing of various payment methods',
      'Order Management: Order inquiry, delivery tracking, and refund processing',
      'Member Management: Registration, login, and profile management',
      'Review System: Product reviews and rating management'
    ],
    categoryIds: [1, 2], // 프론트엔드, 백엔드
    productLimit: 6,
    purchase_count: 342
  },
  2: {
    category: 'web',
    name: '회사 홈페이지',
    name_ja: '会社ホームページ',
    name_en: 'Company Homepage',
    description: '기업 홈페이지 제작을 위한 AI 세트. 반응형 디자인, CMS, 연락처 폼 등 기업 웹사이트에 필요한 모든 기능을 포함합니다.',
    description_ja: '企業ホームページ制作のためのAIセット。レスポンシブデザイン、CMS、お問い合わせフォームなど、企業ウェブサイトに必要なすべての機能を含みます。',
    description_en: 'AI set for corporate homepage creation. Includes all necessary features for corporate websites such as responsive design, CMS, and contact forms.',
    projectDescription: '기업의 브랜드 이미지를 효과적으로 전달하는 홈페이지 구축을 위한 AI 팀입니다. 반응형 디자인, 콘텐츠 관리, 연락처 폼 등 기업 웹사이트의 핵심 기능을 제공합니다.',
    projectDescription_ja: '企業のブランドイメージを効果的に伝えるホームページ構築のためのAIチームです。レスポンシブデザイン、コンテンツ管理、お問い合わせフォームなど、企業ウェブサイトの中核機能を提供します。',
    projectDescription_en: 'An AI team for building homepages that effectively convey corporate brand images. Provides core features of corporate websites such as responsive design, content management, and contact forms.',
    whySelected: '회사 홈페이지는 브랜드 이미지와 정보 전달이 중요합니다. 이 템플릿은 반응형 UI 디자인, CMS 기능, 연락처 폼, SEO 최적화 AI를 포함하여, 전문적이고 현대적인 기업 웹사이트를 제작할 수 있도록 구성했습니다.',
    whySelected_ja: '会社ホームページは、ブランドイメージと情報伝達が重要です。このテンプレートは、レスポンシブUIデザイン、CMS機能、お問い合わせフォーム、SEO最適化AIを含めて、専門的で現代的な企業ウェブサイトを制作できるように構成しました。',
    whySelected_en: 'Corporate homepages are important for brand image and information delivery. This template includes responsive UI design, CMS functionality, contact forms, and SEO optimization AI to enable creating professional and modern corporate websites.',
    aiDescriptions: [
      '반응형 디자인: 모바일/태블릿/데스크톱 최적화',
      'CMS: 콘텐츠 관리 및 업데이트 시스템',
      '연락처 폼: 문의사항 접수 및 이메일 알림',
      '회사 소개: 조직도, 연혁, 비전 소개 페이지',
      'SEO 최적화: 검색 엔진 최적화 및 메타 태그 관리'
    ],
    aiDescriptions_ja: [
      'レスポンシブデザイン: モバイル/タブレット/デスクトップ最適化',
      'CMS: コンテンツ管理および更新システム',
      'お問い合わせフォーム: お問い合わせ受付およびメール通知',
      '会社紹介: 組織図、沿革、ビジョン紹介ページ',
      'SEO最適化: 検索エンジン最適化およびメタタグ管理'
    ],
    aiDescriptions_en: [
      'Responsive Design: Mobile/Tablet/Desktop optimization',
      'CMS: Content management and update system',
      'Contact Form: Inquiry reception and email notifications',
      'Company Introduction: Organization chart, history, and vision introduction pages',
      'SEO Optimization: Search engine optimization and meta tag management'
    ],
    categoryIds: [1, 2],
    productLimit: 5,
    purchase_count: 289
  },
  3: {
    category: 'web',
    name: '음악 페이지',
    name_ja: '音楽ページ',
    name_en: 'Music Page',
    description: '음악 스트리밍 및 음악 관리 웹사이트를 위한 AI 세트. 플레이리스트, 음악 검색, 재생 기능 등을 구현합니다.',
    description_ja: '音楽ストリーミングおよび音楽管理ウェブサイトのためのAIセット。プレイリスト、音楽検索、再生機能などを実装します。',
    description_en: 'AI set for music streaming and music management websites. Implements features such as playlists, music search, and playback functionality.',
    projectDescription: '음악 스트리밍 및 음악 관리 서비스를 위한 AI 팀입니다. 플레이리스트 생성, 음악 검색, 재생 기능 등 음악 플랫폼의 핵심 기능을 제공합니다.',
    projectDescription_ja: '音楽ストリーミングおよび音楽管理サービスのためのAIチームです。プレイリスト作成、音楽検索、再生機能など、音楽プラットフォームの中核機能を提供します。',
    projectDescription_en: 'An AI team for music streaming and music management services. Provides core features of music platforms such as playlist creation, music search, and playback functionality.',
    whySelected: '음악 페이지는 스트리밍, 재생, 플레이리스트 관리가 핵심입니다. 이 템플릿은 미디어 플레이어, 오디오 처리, 데이터베이스 관리, 검색 기능 AI를 포함하여, 사용자 친화적인 음악 플랫폼을 구축할 수 있도록 구성했습니다.',
    whySelected_ja: '音楽ページは、ストリーミング、再生、プレイリスト管理が核心です。このテンプレートは、メディアプレーヤー、オーディオ処理、データベース管理、検索機能AIを含めて、ユーザーフレンドリーな音楽プラットフォームを構築できるように構成しました。',
    whySelected_en: 'Music pages are centered on streaming, playback, and playlist management. This template includes media player, audio processing, database management, and search functionality AI to enable building user-friendly music platforms.',
    aiDescriptions: [
      '음악 재생: 오디오 스트리밍 및 플레이어 기능',
      '플레이리스트: 플레이리스트 생성 및 관리',
      '음악 검색: 제목, 아티스트, 장르별 검색',
      '사용자 프로필: 즐겨찾기, 재생 이력 관리',
      '추천 시스템: 개인 맞춤 음악 추천'
    ],
    aiDescriptions_ja: [
      '音楽再生: オーディオストリーミングおよびプレーヤー機能',
      'プレイリスト: プレイリスト作成および管理',
      '音楽検索: タイトル、アーティスト、ジャンル別検索',
      'ユーザープロフィール: お気に入り、再生履歴管理',
      '推薦システム: パーソナライズ音楽推薦'
    ],
    aiDescriptions_en: [
      'Music Playback: Audio streaming and player functionality',
      'Playlists: Playlist creation and management',
      'Music Search: Search by title, artist, and genre',
      'User Profile: Favorites and playback history management',
      'Recommendation System: Personalized music recommendations'
    ],
    categoryIds: [1, 2],
    productLimit: 4,
    purchase_count: 156
  },
  17: {
    category: 'web',
    name: '블로그/컨텐츠',
    name_ja: 'ブログ/コンテンツ',
    name_en: 'Blog/Content',
    description: '블로그 및 콘텐츠 관리 웹사이트를 위한 AI 세트. 글 작성, 이미지 관리, 댓글 시스템, 검색 기능 등을 포함합니다.',
    description_ja: 'ブログおよびコンテンツ管理ウェブサイトのためのAIセット。記事作成、画像管理、コメントシステム、検索機能などを含みます。',
    description_en: 'AI set for blog and content management websites. Includes article writing, image management, comment systems, and search functionality.',
    projectDescription: '블로그 및 콘텐츠 플랫폼 구축을 위한 AI 팀입니다. 글 작성, 카테고리 관리, 태그 시스템, 댓글 기능 등 콘텐츠 관리에 필요한 모든 기능을 제공합니다.',
    projectDescription_ja: 'ブログおよびコンテンツプラットフォーム構築のためのAIチームです。記事作成、カテゴリー管理、タグシステム、コメント機能など、コンテンツ管理に必要なすべての機能を提供します。',
    projectDescription_en: 'An AI team for building blog and content platforms. Provides all features necessary for content management such as article writing, category management, tag systems, and comment functionality.',
    whySelected: '블로그/컨텐츠 사이트는 글 작성, 편집, 카테고리 관리, 검색 기능이 핵심입니다. 이 템플릿은 텍스트 에디터, 이미지 업로드, 태그 시스템, 검색 엔진 AI를 포함하여, 효율적인 콘텐츠 관리 시스템을 구축할 수 있도록 구성했습니다.',
    whySelected_ja: 'ブログ/コンテンツサイトは、記事作成、編集、カテゴリー管理、検索機能が核心です。このテンプレートは、テキストエディタ、画像アップロード、タグシステム、検索エンジンAIを含めて、効率的なコンテンツ管理システムを構築できるように構成しました。',
    whySelected_en: 'Blog/content sites are centered on article writing, editing, category management, and search functionality. This template includes text editor, image upload, tag system, and search engine AI to enable building an efficient content management system.',
    aiDescriptions: [
      '텍스트 에디터: 마크다운/리치 텍스트 에디터 지원',
      '이미지 관리: 이미지 업로드, 최적화, 갤러리 기능',
      '카테고리/태그: 콘텐츠 분류 및 태그 시스템',
      '댓글 시스템: 댓글 작성, 답글, 알림 기능',
      '검색 기능: 전문 검색 및 태그별 검색',
      'SEO 최적화: 검색 엔진 최적화 및 메타 태그 관리'
    ],
    aiDescriptions_ja: [
      'テキストエディタ: マークダウン/リッチテキストエディタサポート',
      '画像管理: 画像アップロード、最適化、ギャラリー機能',
      'カテゴリー/タグ: コンテンツ分類およびタグシステム',
      'コメントシステム: コメント作成、返信、通知機能',
      '検索機能: 全文検索およびタグ別検索',
      'SEO最適化: 検索エンジン最適化およびメタタグ管理'
    ],
    aiDescriptions_en: [
      'Text Editor: Markdown/rich text editor support',
      'Image Management: Image upload, optimization, and gallery functionality',
      'Category/Tag: Content classification and tag system',
      'Comment System: Comment writing, replies, and notification functionality',
      'Search Function: Full-text search and tag-based search',
      'SEO Optimization: Search engine optimization and meta tag management'
    ],
    categoryIds: [1, 2, 7], // 프론트엔드, 백엔드, 문서
    productLimit: 6,
    purchase_count: 423
  },
  18: {
    category: 'web',
    name: '포트폴리오 사이트',
    name_ja: 'ポートフォリオサイト',
    name_en: 'Portfolio Website',
    description: '개인 또는 기업 포트폴리오 웹사이트를 위한 AI 세트. 프로젝트 소개, 이미지 갤러리, 연락처 폼 등 포트폴리오에 필요한 모든 기능을 포함합니다.',
    description_ja: '個人または企業のポートフォリオウェブサイトのためのAIセット。プロジェクト紹介、画像ギャラリー、お問い合わせフォームなど、ポートフォリオに必要なすべての機能を含みます。',
    description_en: 'AI set for personal or corporate portfolio websites. Includes all features necessary for portfolios such as project introductions, image galleries, and contact forms.',
    projectDescription: '포트폴리오 웹사이트 구축을 위한 AI 팀입니다. 프로젝트 소개, 작품 갤러리, 이력서, 연락처 폼 등 포트폴리오에 필요한 모든 기능을 제공합니다.',
    projectDescription_ja: 'ポートフォリオウェブサイト構築のためのAIチームです。プロジェクト紹介、作品ギャラリー、履歴書、お問い合わせフォームなど、ポートフォリオに必要なすべての機能を提供します。',
    projectDescription_en: 'An AI team for building portfolio websites. Provides all features necessary for portfolios such as project introductions, work galleries, resumes, and contact forms.',
    whySelected: '포트폴리오 사이트는 작품 전시와 자기소개가 중요합니다. 이 템플릿은 이미지 갤러리, 프로젝트 소개, 애니메이션 효과, 연락처 폼 AI를 포함하여, 전문적이고 시각적으로 매력적인 포트폴리오를 제작할 수 있도록 구성했습니다.',
    whySelected_ja: 'ポートフォリオサイトは、作品展示と自己紹介が重要です。このテンプレートは、画像ギャラリー、プロジェクト紹介、アニメーション効果、お問い合わせフォームAIを含めて、専門的で視覚的に魅力的なポートフォリオを制作できるように構成しました。',
    whySelected_en: 'Portfolio sites are important for showcasing work and self-introduction. This template includes image gallery, project introduction, animation effects, and contact form AI to enable creating professional and visually appealing portfolios.',
    aiDescriptions: [
      '이미지 갤러리: 작품 이미지 전시 및 라이트박스 기능',
      '프로젝트 소개: 프로젝트 상세 정보 및 기술 스택 표시',
      '애니메이션 효과: 스크롤 애니메이션 및 트랜지션 효과',
      '반응형 디자인: 모바일/태블릿/데스크톱 최적화',
      '연락처 폼: 문의사항 접수 및 이메일 알림',
      '소셜 링크: SNS 및 외부 프로필 링크 연결'
    ],
    aiDescriptions_ja: [
      '画像ギャラリー: 作品画像展示およびライトボックス機能',
      'プロジェクト紹介: プロジェクト詳細情報および技術スタック表示',
      'アニメーション効果: スクロールアニメーションおよびトランジション効果',
      'レスポンシブデザイン: モバイル/タブレット/デスクトップ最適化',
      'お問い合わせフォーム: お問い合わせ受付およびメール通知',
      'ソーシャルリンク: SNSおよび外部プロフィールリンク接続'
    ],
    aiDescriptions_en: [
      'Image Gallery: Work image display and lightbox functionality',
      'Project Introduction: Detailed project information and tech stack display',
      'Animation Effects: Scroll animations and transition effects',
      'Responsive Design: Mobile/Tablet/Desktop optimization',
      'Contact Form: Inquiry reception and email notifications',
      'Social Links: SNS and external profile link connections'
    ],
    categoryIds: [1, 3], // 프론트엔드, 이미지
    productLimit: 5,
    purchase_count: 512
  },

  // 어플개발 카테고리 (4-7)
  4: {
    category: 'app',
    name: 'iOS 앱 (애플)',
    name_ja: 'iOSアプリ（アップル）',
    name_en: 'iOS App (Apple)',
    description: 'iOS 네이티브 앱 개발을 위한 AI 세트. Swift를 활용한 iPhone, iPad 앱 개발에 최적화된 도구들을 포함합니다.',
    description_ja: 'iOSネイティブアプリ開発のためのAIセット。Swiftを活用したiPhone、iPadアプリ開発に最適化されたツールを含みます。',
    description_en: 'AI set for iOS native app development. Includes tools optimized for iPhone and iPad app development using Swift.',
    projectDescription: 'iOS 네이티브 앱 개발을 위한 전문 AI 팀입니다. Swift 언어를 활용하여 iPhone, iPad용 고성능 앱을 개발할 수 있습니다.',
    projectDescription_ja: 'iOSネイティブアプリ開発のための専門AIチームです。Swift言語を活用して、iPhone、iPad用の高性能アプリを開発できます。',
    projectDescription_en: 'A professional AI team for iOS native app development. Can develop high-performance apps for iPhone and iPad using the Swift language.',
    whySelected: 'iOS 앱은 Swift와 네이티브 iOS 프레임워크를 활용해야 합니다. 이 템플릿은 Swift 개발, UIKit/SwiftUI, Core Data, 네트워킹 AI를 포함하여, 애플 플랫폼에 최적화된 앱을 개발할 수 있도록 구성했습니다.',
    whySelected_ja: 'iOSアプリは、SwiftとネイティブiOSフレームワークを活用する必要があります。このテンプレートは、Swift開発、UIKit/SwiftUI、Core Data、ネットワーキングAIを含めて、アップルプラットフォームに最適化されたアプリを開発できるように構成しました。',
    whySelected_en: 'iOS apps need to utilize Swift and native iOS frameworks. This template includes Swift development, UIKit/SwiftUI, Core Data, and networking AI to enable developing apps optimized for the Apple platform.',
    aiDescriptions: [
      'Swift 개발: iOS 네이티브 언어 개발',
      'UIKit/SwiftUI: iOS UI 프레임워크 활용',
      'Core Data: 데이터 저장 및 관리',
      '네트워킹: API 연동 및 데이터 통신',
      '푸시 알림: APNs를 통한 알림 기능'
    ],
    aiDescriptions_ja: [
      'Swift開発: iOSネイティブ言語開発',
      'UIKit/SwiftUI: iOS UIフレームワーク活用',
      'Core Data: データ保存および管理',
      'ネットワーキング: API連携およびデータ通信',
      'プッシュ通知: APNsを通じた通知機能'
    ],
    aiDescriptions_en: [
      'Swift Development: iOS native language development',
      'UIKit/SwiftUI: iOS UI framework utilization',
      'Core Data: Data storage and management',
      'Networking: API integration and data communication',
      'Push Notifications: Notification functionality through APNs'
    ],
    categoryIds: [3],
    productLimit: 5,
    purchase_count: 298
  },
  5: {
    category: 'app',
    name: '안드로이드 앱',
    name_ja: 'Androidアプリ',
    name_en: 'Android App',
    description: 'Android 네이티브 앱 개발을 위한 AI 세트. Kotlin/Java를 활용한 Android 앱 개발 도구들을 제공합니다.',
    description_ja: 'Androidネイティブアプリ開発のためのAIセット。Kotlin/Javaを活用したAndroidアプリ開発ツールを提供します。',
    description_en: 'AI set for Android native app development. Provides Android app development tools using Kotlin/Java.',
    projectDescription: 'Android 네이티브 앱 개발을 위한 전문 AI 팀입니다. Kotlin/Java를 활용하여 안드로이드 기기에 최적화된 앱을 개발할 수 있습니다.',
    projectDescription_ja: 'Androidネイティブアプリ開発のための専門AIチームです。Kotlin/Javaを活用して、Androidデバイスに最適化されたアプリを開発できます。',
    projectDescription_en: 'A professional AI team for Android native app development. Can develop apps optimized for Android devices using Kotlin/Java.',
    whySelected: '안드로이드 앱은 Kotlin/Java와 안드로이드 SDK를 활용해야 합니다. 이 템플릿은 Kotlin 개발, Jetpack 라이브러리, Room 데이터베이스, Retrofit 네트워킹 AI를 포함하여, 안드로이드 플랫폼에 최적화된 앱을 개발할 수 있도록 구성했습니다.',
    whySelected_ja: 'Androidアプリは、Kotlin/JavaとAndroid SDKを活用する必要があります。このテンプレートは、Kotlin開発、Jetpackライブラリ、Roomデータベース、RetrofitネットワーキングAIを含めて、Androidプラットフォームに最適化されたアプリを開発できるように構成しました。',
    whySelected_en: 'Android apps need to utilize Kotlin/Java and Android SDK. This template includes Kotlin development, Jetpack libraries, Room database, and Retrofit networking AI to enable developing apps optimized for the Android platform.',
    aiDescriptions: [
      'Kotlin/Java 개발: 안드로이드 네이티브 언어 개발',
      'Jetpack: 현대적인 안드로이드 개발 라이브러리',
      'Room: 로컬 데이터베이스 관리',
      'Retrofit: REST API 통신',
      'Firebase: 클라우드 서비스 연동'
    ],
    aiDescriptions_ja: [
      'Kotlin/Java開発: Androidネイティブ言語開発',
      'Jetpack: 現代的Android開発ライブラリ',
      'Room: ローカルデータベース管理',
      'Retrofit: REST API通信',
      'Firebase: クラウドサービス連携'
    ],
    aiDescriptions_en: [
      'Kotlin/Java Development: Android native language development',
      'Jetpack: Modern Android development libraries',
      'Room: Local database management',
      'Retrofit: REST API communication',
      'Firebase: Cloud service integration'
    ],
    categoryIds: [3],
    productLimit: 5,
    purchase_count: 287
  },
  6: {
    category: 'app',
    name: '건강앱',
    name_ja: '健康アプリ',
    name_en: 'Health App',
    description: '건강 관리 및 운동 추적 앱 개발을 위한 AI 세트. 헬스 데이터 분석, 운동 추천, 건강 기록 관리 기능을 지원합니다.',
    description_ja: '健康管理および運動追跡アプリ開発のためのAIセット。ヘルスデータ分析、運動推薦、健康記録管理機能をサポートします。',
    description_en: 'AI set for health management and exercise tracking app development. Supports health data analysis, exercise recommendations, and health record management features.',
    projectDescription: '건강 관리와 운동 추적을 위한 모바일 앱 개발 AI 팀입니다. 건강 데이터 수집, 분석, 운동 추천 등 건강 관리 앱의 핵심 기능을 제공합니다.',
    projectDescription_ja: '健康管理と運動追跡のためのモバイルアプリ開発AIチームです。健康データ収集、分析、運動推薦など、健康管理アプリの中核機能を提供します。',
    projectDescription_en: 'A mobile app development AI team for health management and exercise tracking. Provides core features of health management apps such as health data collection, analysis, and exercise recommendations.',
    whySelected: '건강앱은 데이터 수집, 분석, 시각화가 중요합니다. 이 템플릿은 건강 데이터 수집, 통계 분석, 차트 시각화, 운동 추천 시스템 AI를 포함하여, 사용자의 건강을 체계적으로 관리할 수 있는 앱을 개발할 수 있도록 구성했습니다.',
    whySelected_ja: '健康アプリは、データ収集、分析、可視化が重要です。このテンプレートは、健康データ収集、統計分析、チャート可視化、運動推薦システムAIを含めて、ユーザーの健康を体系的に管理できるアプリを開発できるように構成しました。',
    whySelected_en: 'Health apps are important for data collection, analysis, and visualization. This template includes health data collection, statistical analysis, chart visualization, and exercise recommendation system AI to enable developing apps that can systematically manage user health.',
    aiDescriptions: [
      '건강 데이터 수집: 걸음수, 심박수, 칼로리 추적',
      '데이터 분석: 건강 통계 및 트렌드 분석',
      '운동 추천: 개인 맞춤 운동 프로그램 제안',
      '목표 설정: 건강 목표 설정 및 달성 추적',
      '알림 기능: 운동 리마인더 및 건강 알림'
    ],
    aiDescriptions_ja: [
      '健康データ収集: 歩数、心拍数、カロリー追跡',
      'データ分析: 健康統計およびトレンド分析',
      '運動推薦: パーソナライズ運動プログラム提案',
      '目標設定: 健康目標設定および達成追跡',
      '通知機能: 運動リマインダーおよび健康通知'
    ],
    aiDescriptions_en: [
      'Health Data Collection: Step count, heart rate, and calorie tracking',
      'Data Analysis: Health statistics and trend analysis',
      'Exercise Recommendations: Personalized exercise program suggestions',
      'Goal Setting: Health goal setting and achievement tracking',
      'Notification Function: Exercise reminders and health notifications'
    ],
    categoryIds: [3],
    productLimit: 4,
    purchase_count: 234
  },
  7: {
    category: 'app',
    name: '다이어리앱',
    name_ja: '日記アプリ',
    name_en: 'Diary App',
    description: '일기 및 메모 관리 앱을 위한 AI 세트. 텍스트/이미지 기록, 검색, 백업 등 일기 앱의 핵심 기능을 구현합니다.',
    description_ja: '日記およびメモ管理アプリのためのAIセット。テキスト/画像記録、検索、バックアップなど、日記アプリの中核機能を実装します。',
    description_en: 'AI set for diary and memo management apps. Implements core features of diary apps such as text/image records, search, and backup.',
    projectDescription: '일기 및 메모 작성을 위한 모바일 앱 개발 AI 팀입니다. 텍스트, 이미지, 태그 기능을 통해 개인 기록을 효율적으로 관리할 수 있습니다.',
    projectDescription_ja: '日記およびメモ作成のためのモバイルアプリ開発AIチームです。テキスト、画像、タグ機能を通じて、個人記録を効率的に管理できます。',
    projectDescription_en: 'A mobile app development AI team for diary and memo writing. Can efficiently manage personal records through text, image, and tag functionality.',
    whySelected: '다이어리앱은 사용자 경험과 데이터 저장이 중요합니다. 이 템플릿은 텍스트 편집기, 이미지 처리, 검색 기능, 클라우드 백업 AI를 포함하여, 직관적이고 안정적인 일기 앱을 개발할 수 있도록 구성했습니다.',
    whySelected_ja: '日記アプリは、ユーザー体験とデータ保存が重要です。このテンプレートは、テキストエディタ、画像処理、検索機能、クラウドバックアップAIを含めて、直感的で安定した日記アプリを開発できるように構成しました。',
    whySelected_en: 'Diary apps are important for user experience and data storage. This template includes text editor, image processing, search functionality, and cloud backup AI to enable developing intuitive and stable diary apps.',
    aiDescriptions: [
      '텍스트 편집: 다양한 폰트, 스타일 지원',
      '이미지 추가: 사진 첨부 및 편집',
      '태그 시스템: 태그를 통한 일기 분류',
      '검색 기능: 날짜, 키워드, 태그로 검색',
      '백업/동기화: 클라우드 백업 및 다기기 동기화'
    ],
    aiDescriptions_ja: [
      'テキスト編集: 多様なフォント、スタイルサポート',
      '画像追加: 写真添付および編集',
      'タグシステム: タグによる日記分類',
      '検索機能: 日付、キーワード、タグで検索',
      'バックアップ/同期: クラウドバックアップおよび複数デバイス同期'
    ],
    aiDescriptions_en: [
      'Text Editing: Support for various fonts and styles',
      'Image Addition: Photo attachment and editing',
      'Tag System: Diary classification through tags',
      'Search Function: Search by date, keyword, and tag',
      'Backup/Sync: Cloud backup and multi-device synchronization'
    ],
    categoryIds: [3],
    productLimit: 4,
    purchase_count: 312
  },

  // 데이터 분석 카테고리 (8-10)
  8: {
    category: 'data',
    name: '비즈니스 분석',
    name_ja: 'ビジネス分析',
    name_en: 'Business Analytics',
    description: '비즈니스 데이터 분석을 위한 AI 세트. 매출 분석, 고객 분석, 트렌드 예측 등 비즈니스 인사이트 도출을 지원합니다.',
    description_ja: 'ビジネスデータ分析のためのAIセット。売上分析、顧客分析、トレンド予測など、ビジネスインサイトの導出をサポートします。',
    description_en: 'AI set for business data analytics. Supports deriving business insights such as sales analysis, customer analysis, and trend prediction.',
    projectDescription: '비즈니스 데이터 분석을 위한 전문 AI 팀입니다. 매출, 고객, 트렌드 데이터를 분석하여 비즈니스 의사결정을 지원합니다.',
    projectDescription_ja: 'ビジネスデータ分析のための専門AIチームです。売上、顧客、トレンドデータを分析して、ビジネス意思決定をサポートします。',
    projectDescription_en: 'A professional AI team for business data analytics. Analyzes sales, customer, and trend data to support business decision-making.',
    whySelected: '비즈니스 분석은 데이터 수집, 정제, 분석, 시각화의 전 과정이 필요합니다. 이 템플릿은 데이터 수집, 정제, 통계 분석, 시각화 AI를 포함하여, 비즈니스 인사이트를 도출할 수 있도록 구성했습니다.',
    whySelected_ja: 'ビジネス分析は、データ収集、精製、分析、可視化の全過程が必要です。このテンプレートは、データ収集、精製、統計分析、可視化AIを含めて、ビジネスインサイトを導出できるように構成しました。',
    whySelected_en: 'Business analytics requires the entire process of data collection, cleaning, analysis, and visualization. This template includes data collection, cleaning, statistical analysis, and visualization AI to enable deriving business insights.',
    aiDescriptions: [
      '데이터 수집: 다양한 소스에서 데이터 통합',
      '데이터 정제: 데이터 품질 개선 및 전처리',
      '통계 분석: 매출, 고객, 트렌드 분석',
      '시각화: 대시보드 및 차트 생성',
      '예측 모델: 트렌드 및 매출 예측'
    ],
    aiDescriptions_ja: [
      'データ収集: 多様なソースからのデータ統合',
      'データ精製: データ品質改善および前処理',
      '統計分析: 売上、顧客、トレンド分析',
      '可視化: ダッシュボードおよびチャート生成',
      '予測モデル: トレンドおよび売上予測'
    ],
    aiDescriptions_en: [
      'Data Collection: Data integration from various sources',
      'Data Cleaning: Data quality improvement and preprocessing',
      'Statistical Analysis: Sales, customer, and trend analysis',
      'Visualization: Dashboard and chart generation',
      'Prediction Models: Trend and sales prediction'
    ],
    categoryIds: [1, 4, 5], // 프론트엔드(시각화), 관리(분석), 인프라(데이터)
    productLimit: 6,
    purchase_count: 456
  },
  9: {
    category: 'data',
    name: '머신러닝 프로젝트',
    name_ja: '機械学習プロジェクト',
    name_en: 'Machine Learning Project',
    description: '머신러닝 모델 개발을 위한 AI 세트. 데이터 전처리, 모델 학습, 평가까지 전체 파이프라인을 자동화합니다.',
    description_ja: '機械学習モデル開発のためのAIセット。データ前処理、モデル学習、評価まで、パイプライン全体を自動化します。',
    description_en: 'AI set for machine learning model development. Automates the entire pipeline from data preprocessing to model training and evaluation.',
    projectDescription: '머신러닝 모델 개발을 위한 전문 AI 팀입니다. 데이터 전처리부터 모델 학습, 평가, 배포까지 머신러닝 파이프라인 전체를 지원합니다.',
    projectDescription_ja: '機械学習モデル開発のための専門AIチームです。データ前処理からモデル学習、評価、デプロイまで、機械学習パイプライン全体をサポートします。',
    projectDescription_en: 'A professional AI team for machine learning model development. Supports the entire machine learning pipeline from data preprocessing to model training, evaluation, and deployment.',
    whySelected: '머신러닝 프로젝트는 데이터 처리, 모델 학습, 평가의 복잡한 과정을 포함합니다. 이 템플릿은 데이터 전처리, 특징 추출, 모델 학습, 하이퍼파라미터 튜닝, 모델 평가 AI를 포함하여, 완전한 머신러닝 파이프라인을 구축할 수 있도록 구성했습니다.',
    whySelected_ja: '機械学習プロジェクトは、データ処理、モデル学習、評価の複雑な過程を含みます。このテンプレートは、データ前処理、特徴抽出、モデル学習、ハイパーパラメータチューニング、モデル評価AIを含めて、完全な機械学習パイプラインを構築できるように構成しました。',
    whySelected_en: 'Machine learning projects include complex processes of data processing, model training, and evaluation. This template includes data preprocessing, feature extraction, model training, hyperparameter tuning, and model evaluation AI to enable building a complete machine learning pipeline.',
    aiDescriptions: [
      '데이터 전처리: 데이터 정제 및 변환',
      '특징 추출: 머신러닝을 위한 특징 엔지니어링',
      '모델 학습: 다양한 알고리즘 활용 및 학습',
      '하이퍼파라미터 튜닝: 최적 모델 파라미터 찾기',
      '모델 평가: 성능 평가 및 검증',
      '모델 배포: 프로덕션 환경 배포'
    ],
    aiDescriptions_ja: [
      'データ前処理: データ精製および変換',
      '特徴抽出: 機械学習のための特徴エンジニアリング',
      'モデル学習: 多様なアルゴリズム活用および学習',
      'ハイパーパラメータチューニング: 最適モデルパラメータ探索',
      'モデル評価: 性能評価および検証',
      'モデルデプロイ: 本番環境デプロイ'
    ],
    aiDescriptions_en: [
      'Data Preprocessing: Data cleaning and transformation',
      'Feature Extraction: Feature engineering for machine learning',
      'Model Training: Utilization and training of various algorithms',
      'Hyperparameter Tuning: Finding optimal model parameters',
      'Model Evaluation: Performance evaluation and validation',
      'Model Deployment: Production environment deployment'
    ],
    categoryIds: [2, 5, 6], // 백엔드(API), 인프라(데이터), 보안
    productLimit: 7,
    purchase_count: 389
  },
  10: {
    category: 'data',
    name: '시각화 대시보드',
    name_ja: '可視化ダッシュボード',
    name_en: 'Visualization Dashboard',
    description: '데이터 시각화 및 대시보드 구축을 위한 AI 세트. 차트, 그래프, 실시간 모니터링 등 데이터를 시각적으로 표현합니다.',
    description_ja: 'データ可視化およびダッシュボード構築のためのAIセット。チャート、グラフ、リアルタイムモニタリングなど、データを視覚的に表現します。',
    description_en: 'AI set for data visualization and dashboard building. Visually represents data through charts, graphs, real-time monitoring, and more.',
    projectDescription: '데이터 시각화 및 대시보드 구축을 위한 전문 AI 팀입니다. 다양한 차트와 그래프를 통해 데이터를 직관적으로 표현합니다.',
    projectDescription_ja: 'データ可視化およびダッシュボード構築のための専門AIチームです。多様なチャートとグラフを通じて、データを直感的に表現します。',
    projectDescription_en: 'A professional AI team for data visualization and dashboard building. Intuitively represents data through various charts and graphs.',
    whySelected: '시각화 대시보드는 데이터 이해도를 높이는 핵심 도구입니다. 이 템플릿은 다양한 차트 생성, 대화형 그래프, 실시간 데이터 업데이트, 필터링 기능 AI를 포함하여, 효과적인 데이터 시각화 대시보드를 구축할 수 있도록 구성했습니다.',
    whySelected_ja: '可視化ダッシュボードは、データ理解度を高める核心ツールです。このテンプレートは、多様なチャート生成、対話型グラフ、リアルタイムデータ更新、フィルタリング機能AIを含めて、効果的なデータ可視化ダッシュボードを構築できるように構成しました。',
    whySelected_en: 'Visualization dashboards are key tools for improving data understanding. This template includes various chart generation, interactive graphs, real-time data updates, and filtering functionality AI to enable building effective data visualization dashboards.',
    aiDescriptions: [
      '차트 생성: 막대, 선, 원형 등 다양한 차트',
      '대화형 그래프: 사용자 인터랙션이 가능한 그래프',
      '실시간 업데이트: 실시간 데이터 모니터링',
      '필터링: 다차원 데이터 필터링 및 분석',
      '내보내기: PDF, 이미지 등으로 내보내기'
    ],
    aiDescriptions_ja: [
      'チャート生成: 棒、線、円形など多様なチャート',
      '対話型グラフ: ユーザーインタラクションが可能なグラフ',
      'リアルタイム更新: リアルタイムデータモニタリング',
      'フィルタリング: 多次元データフィルタリングおよび分析',
      'エクスポート: PDF、画像などへのエクスポート'
    ],
    aiDescriptions_en: [
      'Chart Generation: Various charts such as bar, line, and pie charts',
      'Interactive Graphs: User-interactive graphs',
      'Real-time Updates: Real-time data monitoring',
      'Filtering: Multi-dimensional data filtering and analysis',
      'Export: Export to PDF, images, etc.'
    ],
    categoryIds: [1, 2, 5], // 프론트엔드(UI), 백엔드(API), 인프라(데이터)
    productLimit: 5,
    purchase_count: 278
  },

  // 문서 카테고리 (11-13)
  11: {
    category: 'document',
    name: '리포트 생성',
    name_ja: 'レポート生成',
    name_en: 'Report Generation',
    description: '자동 리포트 생성 시스템을 위한 AI 세트. 데이터 수집부터 리포트 작성, 포맷팅까지 자동화합니다.',
    description_ja: '自動レポート生成システムのためのAIセット。データ収集からレポート作成、フォーマットまで自動化します。',
    description_en: 'AI set for automated report generation system. Automates everything from data collection to report writing and formatting.',
    projectDescription: '자동 리포트 생성 시스템을 위한 AI 팀입니다. 데이터를 수집하여 구조화된 리포트를 자동으로 생성합니다.',
    projectDescription_ja: '自動レポート生成システムのためのAIチームです。データを収集して、構造化されたレポートを自動生成します。',
    projectDescription_en: 'An AI team for automated report generation systems. Collects data and automatically generates structured reports.',
    whySelected: '리포트 생성은 반복적인 작업이 많아 자동화가 효과적입니다. 이 템플릿은 데이터 수집, 텍스트 생성, 템플릿 기반 포맷팅, 그래프 삽입 AI를 포함하여, 완전 자동화된 리포트 생성 시스템을 구축할 수 있도록 구성했습니다.',
    whySelected_ja: 'レポート生成は、反復的な作業が多いため、自動化が効果的です。このテンプレートは、データ収集、テキスト生成、テンプレートベースフォーマット、グラフ挿入AIを含めて、完全自動化されたレポート生成システムを構築できるように構成しました。',
    whySelected_en: 'Report generation involves many repetitive tasks, making automation effective. This template includes data collection, text generation, template-based formatting, and graph insertion AI to enable building a fully automated report generation system.',
    aiDescriptions: [
      '데이터 수집: 다양한 소스에서 데이터 수집',
      '텍스트 생성: 리포트 내용 자동 생성',
      '템플릿 기반 포맷팅: 일관된 리포트 포맷 적용',
      '그래프 삽입: 데이터 시각화 및 차트 삽입',
      'PDF 생성: 최종 리포트 PDF 파일 생성'
    ],
    aiDescriptions_ja: [
      'データ収集: 多様なソースからのデータ収集',
      'テキスト生成: レポート内容自動生成',
      'テンプレートベースフォーマット: 一貫したレポートフォーマット適用',
      'グラフ挿入: データ可視化およびチャート挿入',
      'PDF生成: 最終レポートPDFファイル生成'
    ],
    aiDescriptions_en: [
      'Data Collection: Data collection from various sources',
      'Text Generation: Automatic report content generation',
      'Template-based Formatting: Applying consistent report formats',
      'Graph Insertion: Data visualization and chart insertion',
      'PDF Generation: Final report PDF file generation'
    ],
    categoryIds: [5, 7], // 인프라(데이터 수집), 문서
    productLimit: 4,
    purchase_count: 234
  },
  12: {
    category: 'document',
    name: '번역 시스템',
    name_ja: '翻訳システム',
    name_en: 'Translation System',
    description: '다국어 번역 시스템을 위한 AI 세트. 실시간 번역, 문서 번역, 번역 품질 향상을 지원합니다.',
    description_ja: '多言語翻訳システムのためのAIセット。リアルタイム翻訳、文書翻訳、翻訳品質向上をサポートします。',
    description_en: 'AI set for multilingual translation system. Supports real-time translation, document translation, and translation quality improvement.',
    projectDescription: '다국어 번역 시스템을 위한 AI 팀입니다. 실시간 텍스트 번역부터 문서 번역까지 다양한 번역 요구를 지원합니다.',
    projectDescription_ja: '多言語翻訳システムのためのAIチームです。リアルタイムテキスト翻訳から文書翻訳まで、多様な翻訳ニーズをサポートします。',
    projectDescription_en: 'An AI team for multilingual translation systems. Supports various translation needs from real-time text translation to document translation.',
    whySelected: '번역 시스템은 정확도와 속도가 중요합니다. 이 템플릿은 실시간 번역, 문서 번역, 번역 품질 검증, 용어 사전 관리 AI를 포함하여, 고품질 번역 시스템을 구축할 수 있도록 구성했습니다.',
    whySelected_ja: '翻訳システムは、精度と速度が重要です。このテンプレートは、リアルタイム翻訳、文書翻訳、翻訳品質検証、用語辞書管理AIを含めて、高品質翻訳システムを構築できるように構成しました。',
    whySelected_en: 'Translation systems are important for accuracy and speed. This template includes real-time translation, document translation, translation quality verification, and terminology dictionary management AI to enable building high-quality translation systems.',
    aiDescriptions: [
      '실시간 번역: 텍스트 실시간 번역',
      '문서 번역: 전체 문서 자동 번역',
      '번역 품질 검증: 번역 정확도 평가',
      '용어 사전: 전문 용어 사전 관리',
      '다국어 지원: 여러 언어 동시 지원'
    ],
    aiDescriptions_ja: [
      'リアルタイム翻訳: テキストリアルタイム翻訳',
      '文書翻訳: 全文書自動翻訳',
      '翻訳品質検証: 翻訳精度評価',
      '用語辞書: 専門用語辞書管理',
      '多言語サポート: 複数言語同時サポート'
    ],
    aiDescriptions_en: [
      'Real-time Translation: Real-time text translation',
      'Document Translation: Automatic translation of entire documents',
      'Translation Quality Verification: Translation accuracy evaluation',
      'Terminology Dictionary: Specialized terminology dictionary management',
      'Multilingual Support: Simultaneous support for multiple languages'
    ],
    categoryIds: [2, 7], // 백엔드(API), 문서
    productLimit: 3,
    purchase_count: 189
  },
  13: {
    category: 'document',
    name: '문서 자동화',
    name_ja: '文書自動化',
    name_en: 'Document Automation',
    description: '문서 작업 자동화를 위한 AI 세트. 템플릿 생성, 자동 입력, 검토 및 수정 등 문서 처리 업무를 효율화합니다.',
    description_ja: '文書作業自動化のためのAIセット。テンプレート生成、自動入力、レビューおよび修正など、文書処理業務を効率化します。',
    description_en: 'AI set for document work automation. Streamlines document processing tasks such as template generation, automatic input, review, and editing.',
    projectDescription: '문서 작업 자동화를 위한 AI 팀입니다. 반복적인 문서 작성 및 처리를 자동화하여 업무 효율성을 극대화합니다.',
    projectDescription_ja: '文書作業自動化のためのAIチームです。反復的な文書作成および処理を自動化して、業務効率を最大化します。',
    projectDescription_en: 'An AI team for document work automation. Automates repetitive document creation and processing to maximize work efficiency.',
    whySelected: '문서 자동화는 시간 절약과 일관성 향상에 효과적입니다. 이 템플릿은 템플릿 생성, 자동 입력, 문법 검사, 스타일 검토 AI를 포함하여, 문서 작업의 모든 단계를 자동화할 수 있도록 구성했습니다.',
    whySelected_ja: '文書自動化は、時間節約と一貫性向上に効果的です。このテンプレートは、テンプレート生成、自動入力、文法検査、スタイルレビューAIを含めて、文書作業のすべての段階を自動化できるように構成しました。',
    whySelected_en: 'Document automation is effective for saving time and improving consistency. This template includes template generation, automatic input, grammar checking, and style review AI to enable automating all stages of document work.',
    aiDescriptions: [
      '템플릿 생성: 재사용 가능한 문서 템플릿',
      '자동 입력: 데이터 기반 자동 필드 채우기',
      '문법 검사: 문법 및 맞춤법 검사',
      '스타일 검토: 문서 스타일 일관성 검토',
      '문서 비교: 문서 버전 비교 및 병합'
    ],
    aiDescriptions_ja: [
      'テンプレート生成: 再利用可能な文書テンプレート',
      '自動入力: データベース自動フィールド入力',
      '文法検査: 文法およびスペルチェック',
      'スタイルレビュー: 文書スタイル一貫性レビュー',
      '文書比較: 文書バージョン比較およびマージ'
    ],
    aiDescriptions_en: [
      'Template Generation: Reusable document templates',
      'Automatic Input: Data-based automatic field filling',
      'Grammar Checking: Grammar and spell checking',
      'Style Review: Document style consistency review',
      'Document Comparison: Document version comparison and merging'
    ],
    categoryIds: [4, 7], // 관리(자동화), 문서
    productLimit: 5,
    purchase_count: 267
  },

  // 이미지생성 카테고리 (14-16)
  14: {
    category: 'image',
    name: '로고 디자인',
    name_ja: 'ロゴデザイン',
    name_en: 'Logo Design',
    description: '로고 및 브랜드 아이덴티티 디자인을 위한 AI 세트. 텍스트에서 로고 생성, 편집, 다양한 스타일 변환을 지원합니다.',
    description_ja: 'ロゴおよびブランドアイデンティティデザインのためのAIセット。テキストからロゴ生成、編集、多様なスタイル変換をサポートします。',
    description_en: 'AI set for logo and brand identity design. Supports logo generation from text, editing, and various style transformations.',
    projectDescription: '로고 및 브랜드 아이덴티티 디자인을 위한 AI 팀입니다. 브랜드 아이덴티티에 맞는 로고를 생성하고 편집할 수 있습니다.',
    projectDescription_ja: 'ロゴおよびブランドアイデンティティデザインのためのAIチームです。ブランドアイデンティティに合ったロゴを生成および編集できます。',
    projectDescription_en: 'An AI team for logo and brand identity design. Can generate and edit logos that match brand identity.',
    whySelected: '로고 디자인은 브랜드 아이덴티티를 표현하는 핵심입니다. 이 템플릿은 텍스트에서 로고 생성, 스타일 변환, 색상 조정, 벡터 변환 AI를 포함하여, 전문적인 로고를 제작할 수 있도록 구성했습니다.',
    whySelected_ja: 'ロゴデザインは、ブランドアイデンティティを表現する核心です。このテンプレートは、テキストからロゴ生成、スタイル変換、色調整、ベクター変換AIを含めて、専門的なロゴを制作できるように構成しました。',
    whySelected_en: 'Logo design is key to expressing brand identity. This template includes logo generation from text, style transformation, color adjustment, and vector conversion AI to enable creating professional logos.',
    aiDescriptions: [
      '로고 생성: 텍스트 프롬프트로부터 로고 생성',
      '스타일 변환: 다양한 디자인 스타일 적용',
      '색상 조정: 브랜드 색상 맞춤 설정',
      '벡터 변환: 확장 가능한 벡터 포맷 변환',
      '다양한 포맷: PNG, SVG, PDF 등 지원'
    ],
    aiDescriptions_ja: [
      'ロゴ生成: テキストプロンプトからロゴ生成',
      'スタイル変換: 多様なデザインスタイル適用',
      '色調整: ブランド色カスタム設定',
      'ベクター変換: 拡張可能なベクターフォーマット変換',
      '多様なフォーマット: PNG、SVG、PDFなどサポート'
    ],
    aiDescriptions_en: [
      'Logo Generation: Logo generation from text prompts',
      'Style Transformation: Application of various design styles',
      'Color Adjustment: Brand color customization',
      'Vector Conversion: Scalable vector format conversion',
      'Various Formats: Support for PNG, SVG, PDF, etc.'
    ],
    categoryIds: [3],
    productLimit: 4,
    purchase_count: 345
  },
  15: {
    category: 'image',
    name: '마케팅 이미지',
    name_ja: 'マーケティング画像',
    name_en: 'Marketing Image',
    description: '마케팅용 이미지 제작을 위한 AI 세트. 배너, 포스터, SNS 이미지 등 마케팅 자료를 빠르게 생성합니다.',
    description_ja: 'マーケティング用画像制作のためのAIセット。バナー、ポスター、SNS画像など、マーケティング資料を迅速に生成します。',
    description_en: 'AI set for marketing image creation. Quickly generates marketing materials such as banners, posters, and SNS images.',
    projectDescription: '마케팅용 이미지 제작을 위한 AI 팀입니다. 배너, 포스터, SNS 이미지 등 다양한 마케팅 자료를 효율적으로 생성합니다.',
    projectDescription_ja: 'マーケティング用画像制作のためのAIチームです。バナー、ポスター、SNS画像など、多様なマーケティング資料を効率的に生成します。',
    projectDescription_en: 'An AI team for marketing image creation. Efficiently generates various marketing materials such as banners, posters, and SNS images.',
    whySelected: '마케팅 이미지는 빠른 제작과 일관성이 중요합니다. 이 템플릿은 이미지 생성, 템플릿 기반 배너, 텍스트 오버레이, 이미지 편집 AI를 포함하여, 빠르고 전문적인 마케팅 이미지를 제작할 수 있도록 구성했습니다.',
    whySelected_ja: 'マーケティング画像は、迅速な制作と一貫性が重要です。このテンプレートは、画像生成、テンプレートベースバナー、テキストオーバーレイ、画像編集AIを含めて、迅速で専門的なマーケティング画像を制作できるように構成しました。',
    whySelected_en: 'Marketing images are important for quick production and consistency. This template includes image generation, template-based banners, text overlay, and image editing AI to enable creating fast and professional marketing images.',
    aiDescriptions: [
      '이미지 생성: 마케팅 컨셉에 맞는 이미지 생성',
      '배너 템플릿: 다양한 크기의 배너 템플릿',
      '텍스트 오버레이: 이미지에 텍스트 삽입',
      '이미지 편집: 크기 조정, 필터 적용',
      'SNS 최적화: 각 플랫폼에 맞는 크기 최적화'
    ],
    aiDescriptions_ja: [
      '画像生成: マーケティングコンセプトに合った画像生成',
      'バナーテンプレート: 多様なサイズのバナーテンプレート',
      'テキストオーバーレイ: 画像にテキスト挿入',
      '画像編集: サイズ調整、フィルター適用',
      'SNS最適化: 各プラットフォームに合ったサイズ最適化'
    ],
    aiDescriptions_en: [
      'Image Generation: Image generation matching marketing concepts',
      'Banner Templates: Various sized banner templates',
      'Text Overlay: Text insertion into images',
      'Image Editing: Size adjustment and filter application',
      'SNS Optimization: Size optimization for each platform'
    ],
    categoryIds: [3],
    productLimit: 5,
    purchase_count: 423
  },
  16: {
    category: 'image',
    name: '일러스트 생성',
    name_ja: 'イラスト生成',
    name_en: 'Illustration Generation',
    description: '일러스트 및 아트워크 생성을 위한 AI 세트. 다양한 스타일의 일러스트를 생성하고 편집할 수 있습니다.',
    description_ja: 'イラストおよびアートワーク生成のためのAIセット。多様なスタイルのイラストを生成および編集できます。',
    description_en: 'AI set for illustration and artwork generation. Can generate and edit illustrations in various styles.',
    projectDescription: '일러스트 및 아트워크 생성을 위한 AI 팀입니다. 다양한 스타일과 기법의 일러스트를 생성하고 편집할 수 있습니다.',
    projectDescription_ja: 'イラストおよびアートワーク生成のためのAIチームです。多様なスタイルと技法のイラストを生成および編集できます。',
    projectDescription_en: 'An AI team for illustration and artwork generation. Can generate and edit illustrations in various styles and techniques.',
    whySelected: '일러스트 생성은 창의성과 스타일 다양성이 중요합니다. 이 템플릿은 다양한 스타일 일러스트 생성, 스타일 전송, 색상 조정, 디테일 편집 AI를 포함하여, 전문적인 일러스트를 제작할 수 있도록 구성했습니다.',
    whySelected_ja: 'イラスト生成は、創造性とスタイル多様性が重要です。このテンプレートは、多様なスタイルイラスト生成、スタイル転送、色調整、ディテール編集AIを含めて、専門的なイラストを制作できるように構成しました。',
    whySelected_en: 'Illustration generation is important for creativity and style diversity. This template includes various style illustration generation, style transfer, color adjustment, and detail editing AI to enable creating professional illustrations.',
    aiDescriptions: [
      '일러스트 생성: 다양한 스타일의 일러스트 생성',
      '스타일 전송: 기존 스타일을 다른 이미지에 적용',
      '색상 조정: 색상 팔레트 맞춤 설정',
      '디테일 편집: 세부 사항 수정 및 보완',
      '해상도 향상: 이미지 품질 및 해상도 개선'
    ],
    aiDescriptions_ja: [
      'イラスト生成: 多様なスタイルのイラスト生成',
      'スタイル転送: 既存スタイルを他の画像に適用',
      '色調整: 色パレットカスタム設定',
      'ディテール編集: 詳細修正および補完',
      '解像度向上: 画像品質および解像度改善'
    ],
    aiDescriptions_en: [
      'Illustration Generation: Generation of illustrations in various styles',
      'Style Transfer: Application of existing styles to other images',
      'Color Adjustment: Color palette customization',
      'Detail Editing: Detail modification and enhancement',
      'Resolution Enhancement: Image quality and resolution improvement'
    ],
    categoryIds: [3],
    productLimit: 4,
    purchase_count: 298
  }
};
