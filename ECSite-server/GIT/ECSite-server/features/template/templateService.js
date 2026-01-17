const models = require("../../db/initializer");

// 템플릿 기본 데이터 (프론트엔드 templateData.js와 동기화)
const TEMPLATE_DETAILS_MAP = {
  1: {
    category: 'web',
    name: '쇼핑몰',
    description: '온라인 쇼핑몰 구축을 위한 AI 상품 세트. 상품 관리, 결제 시스템, 장바구니 등 전자상거래 기능을 완벽하게 지원합니다.',
    categoryIds: [1, 2],
    productLimit: 6,
    purchase_count: 342
  },
  2: {
    category: 'web',
    name: '회사 홈페이지',
    description: '기업 홈페이지 제작을 위한 AI 세트. 반응형 디자인, CMS, 연락처 폼 등 기업 웹사이트에 필요한 모든 기능을 포함합니다.',
    categoryIds: [1, 2],
    productLimit: 5,
    purchase_count: 289
  },
  3: {
    category: 'web',
    name: '음악 페이지',
    description: '음악 스트리밍 및 음악 관리 웹사이트를 위한 AI 세트. 플레이리스트, 음악 검색, 재생 기능 등을 구현합니다.',
    categoryIds: [1, 2],
    productLimit: 4,
    purchase_count: 156
  },
  4: {
    category: 'app',
    name: 'iOS 앱 (애플)',
    description: 'iOS 네이티브 앱 개발을 위한 AI 세트. Swift를 활용한 iPhone, iPad 앱 개발에 최적화된 도구들을 포함합니다.',
    categoryIds: [3],
    productLimit: 5,
    purchase_count: 298
  },
  5: {
    category: 'app',
    name: '안드로이드 앱',
    description: 'Android 네이티브 앱 개발을 위한 AI 세트. Kotlin/Java를 활용한 Android 앱 개발 도구들을 제공합니다.',
    categoryIds: [3],
    productLimit: 5,
    purchase_count: 287
  },
  6: {
    category: 'app',
    name: '건강앱',
    description: '건강 관리 및 운동 추적 앱 개발을 위한 AI 세트. 헬스 데이터 분석, 운동 추천, 건강 기록 관리 기능을 지원합니다.',
    categoryIds: [3],
    productLimit: 4,
    purchase_count: 234
  },
  7: {
    category: 'app',
    name: '다이어리앱',
    description: '일기 및 메모 관리 앱을 위한 AI 세트. 텍스트/이미지 기록, 검색, 백업 등 일기 앱의 핵심 기능을 구현합니다.',
    categoryIds: [3],
    productLimit: 4,
    purchase_count: 312
  },
  8: {
    category: 'data',
    name: '비즈니스 분석',
    name_ja: 'ビジネス分析',
    name_en: 'Business Analytics',
    description: '비즈니스 데이터 분석을 위한 AI 세트. 매출 분석, 고객 분석, 트렌드 예측 등 비즈니스 인사이트 도출을 지원합니다.',
    description_ja: 'ビジネスデータ分析のためのAIセット。売上分析、顧客分析、トレンド予測など、ビジネスインサイトの導出をサポートします。',
    description_en: 'AI set for business data analytics. Supports deriving business insights such as sales analysis, customer analysis, and trend prediction.',
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
    categoryIds: [1, 2, 5], // 프론트엔드(UI), 백엔드(API), 인프라(데이터)
    productLimit: 5,
    purchase_count: 278
  },
  11: {
    category: 'document',
    name: '리포트 생성',
    name_ja: 'レポート生成',
    name_en: 'Report Generation',
    description: '자동 리포트 생성 시스템을 위한 AI 세트. 데이터 수집부터 리포트 작성, 포맷팅까지 자동화합니다.',
    description_ja: '自動レポート生成システムのためのAIセット。データ収集からレポート作成、フォーマットまで自動化します。',
    description_en: 'AI set for automated report generation system. Automates everything from data collection to report writing and formatting.',
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
    categoryIds: [4, 7], // 관리(자동화), 문서
    productLimit: 5,
    purchase_count: 267
  },
  14: {
    category: 'image',
    name: '로고 디자인',
    description: '로고 및 브랜드 아이덴티티 디자인을 위한 AI 세트. 텍스트에서 로고 생성, 편집, 다양한 스타일 변환을 지원합니다.',
    categoryIds: [3],
    productLimit: 4,
    purchase_count: 345
  },
  15: {
    category: 'image',
    name: '마케팅 이미지',
    description: '마케팅용 이미지 제작을 위한 AI 세트. 배너, 포스터, SNS 이미지 등 마케팅 자료를 빠르게 생성합니다.',
    categoryIds: [3],
    productLimit: 5,
    purchase_count: 423
  },
  16: {
    category: 'image',
    name: '일러스트 생성',
    description: '일러스트 및 아트워크 생성을 위한 AI 세트. 다양한 스타일의 일러스트를 생성하고 편집할 수 있습니다.',
    categoryIds: [3],
    productLimit: 4,
    purchase_count: 298
  }
};

// 템플릿 목록 조회
exports.findAllTemplates = async () => {
  const templates = Object.keys(TEMPLATE_DETAILS_MAP).map(id => {
    const template = TEMPLATE_DETAILS_MAP[id];
    return {
      id: parseInt(id),
      name: template.name,
      name_ja: template.name_ja || null,
      name_en: template.name_en || null,
      description: template.description,
      description_ja: template.description_ja || null,
      description_en: template.description_en || null,
      category: template.category,
      purchase_count: template.purchase_count
    };
  });
  
  return templates;
};

// 템플릿 상세 조회 (상품 포함)
exports.findTemplateById = async (id) => {
  const templateId = parseInt(id);
  const templateData = TEMPLATE_DETAILS_MAP[templateId];
  
  if (!templateData) {
    return null;
  }

  // 템플릿에 포함될 상품 목록 조회 (카테고리 기반)
  const categoryIds = templateData.categoryIds || [];
  let products = [];

  if (categoryIds.length > 0) {
    // SQL injection 방지: categoryIds가 숫자 배열인지 확인
    const validCategoryIds = categoryIds.filter(id => Number.isInteger(parseInt(id)));
    if (validCategoryIds.length === 0) {
      return {
        id: templateId,
        name: templateData.name,
        name_ja: templateData.name_ja || null,
        name_en: templateData.name_en || null,
        description: templateData.description,
        description_ja: templateData.description_ja || null,
        description_en: templateData.description_en || null,
        category: templateData.category,
        purchase_count: templateData.purchase_count,
        products: []
      };
    }

    // replacements를 사용하여 안전하게 쿼리 실행
    const placeholders = validCategoryIds.map((_, index) => `:categoryId${index}`).join(',');
    const replacements = {};
    validCategoryIds.forEach((id, index) => {
      replacements[`categoryId${index}`] = parseInt(id);
    });
    replacements.limit = templateData.productLimit || 10;

    const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.seller,
        p.description,
        p.imageUrl,
        p.soldout,
        p.category_id,
        p.sub_category_id,
        p.download_count,
        p.view_count,
        p.rating_average,
        p.rating_count,
        c.name as category_name,
        sc.name as subcategory_name,
        p.createdAt
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      LEFT JOIN Categories sc ON p.sub_category_id = sc.id
      WHERE p.category_id IN (${placeholders})
        AND p.soldout = 0
      ORDER BY p.download_count DESC
      LIMIT :limit
    `;

    products = await models.sequelize.query(productsQuery, {
      replacements: replacements,
      type: models.sequelize.QueryTypes.SELECT
    });

    // 숫자 필드 형변환
    products = products.map(p => ({
      ...p,
      id: parseInt(p.id),
      price: parseInt(p.price) || 0,
      category_id: parseInt(p.category_id),
      sub_category_id: p.sub_category_id ? parseInt(p.sub_category_id) : null,
      download_count: parseInt(p.download_count) || 0,
      view_count: parseInt(p.view_count) || 0,
      rating_average: p.rating_average ? parseFloat(p.rating_average) : null,
      rating_count: parseInt(p.rating_count) || 0,
      soldout: parseInt(p.soldout) || 0
    }));
  }

  return {
    id: templateId,
    name: templateData.name,
    name_ja: templateData.name_ja || null,
    name_en: templateData.name_en || null,
    description: templateData.description,
    description_ja: templateData.description_ja || null,
    description_en: templateData.description_en || null,
    category: templateData.category,
    purchase_count: templateData.purchase_count,
    products: products
  };
};

// 상품이 포함된 템플릿 목록 조회
exports.findTemplatesByProductId = async (productId) => {
  // 먼저 상품의 카테고리 ID 조회
  const product = await models.Product.findByPk(productId);
  if (!product) {
    return [];
  }

  const productCategoryId = product.category_id;
  const templates = [];

  // 각 템플릿을 확인하여 해당 카테고리 ID가 포함되어 있는지 확인
  for (const [id, templateData] of Object.entries(TEMPLATE_DETAILS_MAP)) {
    if (templateData.categoryIds && templateData.categoryIds.includes(productCategoryId)) {
      templates.push({
        id: parseInt(id),
        name: templateData.name,
        name_ja: templateData.name_ja || null,
        name_en: templateData.name_en || null,
        description: templateData.description,
        description_ja: templateData.description_ja || null,
        description_en: templateData.description_en || null,
        category: templateData.category,
        purchase_count: templateData.purchase_count
      });
    }
  }

  return templates;
};
