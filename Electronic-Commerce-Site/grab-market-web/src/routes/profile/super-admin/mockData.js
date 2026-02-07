/**
 * Super Admin 대시보드 및 각 페이지용 Mock 데이터
 * API 실패 시 또는 개발/데모용으로 사용됩니다.
 *
 * 학생증 이미지 경로: public/images/student-verifications/ 폴더에
 * sample-student-id.jpg 또는 sample-student-id.png 파일을 넣어주세요.
 */

// ==================== 대시보드 ====================
export const mockDashboardStats = {
  pendingProducts: 5,
  pendingStudents: 3,
  pendingSellerApplications: 2,
  todayAccess: 1247,
  securityEvents: 12,
  pendingProductsChange: 2,
  pendingStudentsChange: 1,
  pendingSellerApplicationsChange: 0,
  todayAccessChange: 156,
  securityEventsChange: -3
};

// mockProducts와 동일 구조 (3개국어용 nameKey, categoryKey)
export const mockRecentProducts = [
  { id: 101, nameKey: 'profile.superAdmin.products.mock.product1.name', categoryKey: 'profile.superAdmin.products.mock.categoryDev', price: 2990, creator: { username: 'dev_master' }, approval_requested_at: '2025-02-05T10:30:00Z', createdAt: '2025-02-04T14:20:00Z' },
  { id: 102, nameKey: 'profile.superAdmin.products.mock.product2.name', categoryKey: 'profile.superAdmin.products.mock.categoryStudy', price: 1990, creator: { username: 'study_bot' }, approval_requested_at: '2025-02-05T09:15:00Z', createdAt: '2025-02-03T16:45:00Z' },
  { id: 103, nameKey: 'profile.superAdmin.products.mock.product3.name', categoryKey: 'profile.superAdmin.products.mock.categoryDesign', price: 4990, creator: { username: 'design_ai' }, approval_requested_at: '2025-02-04T18:00:00Z', createdAt: '2025-02-04T12:00:00Z' }
];

export const mockRecentActivities = [
  { time: '10:30', type: '상품 승인 요청', detail: 'AI 코드 리뷰어 - 자동 품질 검사', status: '대기중' },
  { time: '09:15', type: '상품 승인 요청', detail: '자동 레포트 작성 AI', status: '대기중' },
  { time: '09:02', type: '학생 인증 요청', detail: 'student_user_01 (student@example.com)', status: '대기중' }
];

// ==================== 상품 승인 ====================
// 이미지: ECSite-server/GIT/ECSite-server/uploads/ai/ 폴더 (백엔드 /uploads/ai/ 로 제공)
// nameKey, categoryKey, descriptionKey: i18n 키 (3개국어 적용)
export const mockProducts = [
  {
    id: 101,
    nameKey: 'profile.superAdmin.products.mock.product1.name',
    categoryKey: 'profile.superAdmin.products.mock.categoryDev',
    descriptionKey: 'profile.superAdmin.products.mock.product1.description',
    price: 2990,
    creator: { username: 'dev_master' },
    approval_requested_at: '2025-02-05T10:30:00Z',
    createdAt: '2025-02-04T14:20:00Z',
    imageUrl: 'uploads/ai/codepix.png'
  },
  {
    id: 102,
    nameKey: 'profile.superAdmin.products.mock.product2.name',
    categoryKey: 'profile.superAdmin.products.mock.categoryStudy',
    descriptionKey: 'profile.superAdmin.products.mock.product2.description',
    price: 1990,
    creator: { username: 'study_bot' },
    approval_requested_at: '2025-02-05T09:15:00Z',
    createdAt: '2025-02-03T16:45:00Z',
    imageUrl: 'uploads/ai/docwriter.png'
  },
  {
    id: 103,
    nameKey: 'profile.superAdmin.products.mock.product3.name',
    categoryKey: 'profile.superAdmin.products.mock.categoryDesign',
    descriptionKey: 'profile.superAdmin.products.mock.product3.description',
    price: 4990,
    creator: { username: 'design_ai' },
    approval_requested_at: '2025-02-04T18:00:00Z',
    createdAt: '2025-02-04T12:00:00Z',
    imageUrl: 'uploads/ai/iconmaker.png'
  }
];

// 전체 필터용 임시 데이터 (pending / approved / rejected 혼합)
export const mockProductsAll = [
  { ...mockProducts[0], status: 'pending' },
  { ...mockProducts[1], status: 'approved' },
  { ...mockProducts[2], status: 'rejected' }
];

// ==================== 학생 인증 ====================
// 학생증 이미지: public/images/student-verifications/ 폴더에
// sample-student-1.png, sample-student-2.png, sample-student-3.png 등을 넣어주세요
export const MOCK_STUDENT_DOCUMENT_PATH = '/images/student-verifications/sample-student-1.png';

export const mockStudentVerifications = [
  {
    id: 1,
    username: 'student_tanaka',
    email: 'tanaka.student@university.ac.jp',
    createdAt: '2025-02-05T09:02:00Z',
    documentPath: '/images/student-verifications/sample-student-1.png'
  },
  {
    id: 2,
    username: 'student_suzuki',
    email: 'suzuki@college.jp',
    createdAt: '2025-02-04T15:30:00Z',
    documentPath: '/images/student-verifications/sample-student-2.png'
  },
  {
    id: 3,
    username: 'student_yamada',
    email: 'yamada.student@school.ac.jp',
    createdAt: '2025-02-04T11:20:00Z',
    documentPath: '/images/student-verifications/sample-student-3.png'
  }
];

// ==================== 판매자 신청 ====================
export const mockSellerApplications = [
  {
    user_id: 201,
    username: 'kim_dev',
    seller_requested_at: '2025-02-06T09:15:00Z',
    role: 'user',
    seller_rejected_at: null,
    seller_application_data: JSON.stringify({
      seller_name: 'キム・テック',
      contact_email: 'kim.dev@example.com',
      specialization: 'Web開発 / React・Node.js',
      phone: '090-1234-5678'
    })
  },
  {
    user_id: 202,
    username: 'sato_design',
    seller_requested_at: '2025-02-05T14:20:00Z',
    role: 'user',
    seller_rejected_at: null,
    seller_application_data: JSON.stringify({
      seller_name: '佐藤デザイン工房',
      contact_email: 'sato.design@creative.jp',
      specialization: 'UI/UXデザイン・ブランディング',
      phone: '080-9876-5432'
    })
  },
  {
    user_id: 203,
    username: 'yamada_trial',
    seller_requested_at: '2025-02-04T11:00:00Z',
    role: 'user',
    seller_rejected_at: '2025-02-05T16:30:00Z',
    seller_application_data: JSON.stringify({
      seller_name: '山田商店',
      contact_email: 'yamada.trial@example.jp',
      specialization: '雑貨・小物販売',
      phone: '070-1111-2222'
    })
  }
];

// ==================== 판매자 신청 상세 ====================
const mockDetailByUser = {
  201: {
    user: {
      id: 201,
      username: 'kim_dev',
      email: 'kim.dev@example.com',
      createdAt: '2024-06-10T08:00:00Z',
      role: 'user',
      seller_requested_at: '2025-02-06T09:15:00Z',
      seller_rejected_at: null
    },
    application: {
      seller_name: 'キム・テック',
      contact_email: 'kim.dev@example.com',
      phone: '090-1234-5678',
      specialization: 'Web開発 / React・Node.js',
      tech_stack: 'React, Next.js, Node.js, TypeScript, PostgreSQL',
      portfolio_url: 'https://kim-dev-portfolio.vercel.app',
      github_url: 'https://github.com/kim-dev',
      business_number: '',
      product_description: 'ECサイト・管理画面・API開発を得意としています。レスポンシブ対応とアクセシビリティを重視した保守しやすいコードを提供します。',
      motivation: 'フリーランスとして実績を積んできました。このプラットフォームでより多くのクライアントに届けたいと考え、販売者登録を申請しました。'
    },
    validation: {
      totalScore: 88,
      recommendation: 'approve',
      message: '승인 권장',
      checks: [
        { category: '필수 정보', message: '8/8 항목 완료', score: 20 },
        { category: '이메일', message: '유효한 형식', score: 10 },
        { category: '전화번호', message: '유효한 형식', score: 10 },
        { category: '기술 스택', message: '유효한 카테고리', score: 15 },
        { category: '포트폴리오', message: '접근 가능', score: 15 },
        { category: 'GitHub', message: '접근 가능', score: 8 },
        { category: '텍스트 품질', message: '상품 설명: 180자, 신청 동기: 140자', score: 10 }
      ]
    }
  },
  202: {
    user: {
      id: 202,
      username: 'sato_design',
      email: 'sato.design@creative.jp',
      createdAt: '2024-03-22T11:30:00Z',
      role: 'user',
      seller_requested_at: '2025-02-05T14:20:00Z',
      seller_rejected_at: null
    },
    application: {
      seller_name: '佐藤デザイン工房',
      contact_email: 'sato.design@creative.jp',
      phone: '080-9876-5432',
      specialization: 'UI/UXデザイン・ブランディング',
      tech_stack: 'Figma, Adobe XD, Illustrator, Photoshop, HTML/CSS',
      portfolio_url: 'https://sato-design.studio',
      github_url: 'https://github.com/sato-design',
      business_number: '',
      product_description: 'ロゴ・名刺・Webデザイン・UI/UXリサーチからプロトタイプまで一貫して対応します。ブランドの世界観を大切にしたデザインを提供します。',
      motivation: 'デザインで多くのプロジェクトに関わってきました。マーケットを通じて個人・法人問わず気軽に相談できる窓口になりたいです。'
    },
    validation: {
      totalScore: 82,
      recommendation: 'approve',
      message: '승인 권장',
      checks: [
        { category: '필수 정보', message: '8/8 항목 완료', score: 20 },
        { category: '이메일', message: '유효한 형식', score: 10 },
        { category: '전화번호', message: '유효한 형식', score: 10 },
        { category: '기술 스택', message: '유효한 카테고리', score: 14 },
        { category: '포트폴리오', message: '접근 가능', score: 14 },
        { category: 'GitHub', message: '접근 가능', score: 4 },
        { category: '텍스트 품질', message: '상품 설명: 160자, 신청 동기: 100자', score: 10 }
      ]
    }
  },
  203: {
    user: {
      id: 203,
      username: 'yamada_trial',
      email: 'yamada.trial@example.jp',
      createdAt: '2024-11-01T09:00:00Z',
      role: 'user',
      seller_requested_at: '2025-02-04T11:00:00Z',
      seller_rejected_at: '2025-02-05T16:30:00Z'
    },
    application: {
      seller_name: '山田商店',
      contact_email: 'yamada.trial@example.jp',
      phone: '070-1111-2222',
      specialization: '雑貨・小物販売',
      tech_stack: '-',
      portfolio_url: '',
      github_url: '',
      business_number: '',
      product_description: '手作り小物を販売したいです。',
      motivation: '趣味で作ったものを売りたい。'
    },
    validation: {
      totalScore: 42,
      recommendation: 'reject',
      message: '반려 권장',
      checks: [
        { category: '필수 정보', message: '5/8 항목 완료', score: 12 },
        { category: '이메일', message: '유효한 형식', score: 10 },
        { category: '전화번호', message: '유효한 형식', score: 10 },
        { category: '기술 스택', message: '미기재', score: 0 },
        { category: '포트폴리오', message: '미제출', score: 0 },
        { category: 'GitHub', message: '미제출', score: 0 },
        { category: '텍스트 품질', message: '상품 설명: 20자, 신청 동기: 15자 (부족)', score: 10 }
      ]
    }
  }
};

export const mockSellerApplicationDetail = (userId) => {
  const id = Number(userId);
  return mockDetailByUser[id] || mockDetailByUser[201];
};

// ==================== IP 관리 ====================
export const mockIPLogs = [
  { id: 1, ip_address: '192.168.1.100', user: { username: 'tanaka_usr' }, request_path: '/api/products', country: 'JP', created_at: '2025-02-06T10:30:00Z', is_blocked: false },
  { id: 2, ip_address: '203.0.113.45', user: null, request_path: '/login', country: 'KR', created_at: '2025-02-06T10:28:00Z', is_blocked: false },
  { id: 3, ip_address: '198.51.100.23', user: { username: 'seller_kim' }, request_path: '/profile/seller', country: 'JP', created_at: '2025-02-06T10:25:00Z', is_blocked: false },
  { id: 4, ip_address: '172.16.88.12', user: { username: 'admin_sys' }, request_path: '/profile/super-admin', country: 'JP', created_at: '2025-02-06T10:22:00Z', is_blocked: false },
  { id: 5, ip_address: '10.0.0.55', user: null, request_path: '/product/123', country: 'US', created_at: '2025-02-06T10:18:00Z', is_blocked: false },
  { id: 6, ip_address: '45.33.112.88', user: null, request_path: '/api/search?q=test', country: 'CN', created_at: '2025-02-06T10:15:00Z', is_blocked: true },
  { id: 7, ip_address: '185.220.101.42', user: null, request_path: '/auth/login', country: 'DE', created_at: '2025-02-06T10:12:00Z', is_blocked: true },
  { id: 8, ip_address: '211.234.56.78', user: { username: 'suzuki_dev' }, request_path: '/cart', country: 'JP', created_at: '2025-02-06T10:08:00Z', is_blocked: false },
  { id: 9, ip_address: '121.165.200.33', user: null, request_path: '/api/categories', country: 'KR', created_at: '2025-02-06T10:05:00Z', is_blocked: false },
  { id: 10, ip_address: '192.0.2.100', user: null, request_path: '/api/users', country: 'RU', created_at: '2025-02-06T10:00:00Z', is_blocked: true },
  { id: 11, ip_address: '103.45.67.89', user: { username: 'yamada_buyer' }, request_path: '/checkout', country: 'JP', created_at: '2025-02-06T09:55:00Z', is_blocked: false },
  { id: 12, ip_address: '8.8.8.8', user: null, request_path: '/', country: 'US', created_at: '2025-02-06T09:50:00Z', is_blocked: false },
  { id: 13, ip_address: '203.0.113.200', user: null, request_path: '/api/products', country: 'KR', created_at: '2025-02-06T09:45:00Z', is_blocked: false },
  { id: 14, ip_address: '198.51.100.99', user: null, request_path: '/api/products', country: 'BR', created_at: '2025-02-06T09:40:00Z', is_blocked: true },
  { id: 15, ip_address: '172.217.24.46', user: { username: 'guest_01' }, request_path: '/product/456', country: 'US', created_at: '2025-02-06T09:35:00Z', is_blocked: false }
];

export const mockIPStats = {
  todayAccess: 2847,
  uniqueIPs: 512,
  blocked: 6,
  countries: 18,
  todayAccessChange: 234,
  uniqueIPsChange: 45,
  blockedChange: 2,
  countriesChange: 2
};

// block_reason: i18n 키 사용 (profile.superAdmin.ipManagement.blockReasons.*)
export const mockIPManagement = [
  { id: 1, ip_address: '192.0.2.100', is_blocked: true, is_whitelisted: false, block_reason: 'profile.superAdmin.ipManagement.blockReasons.suspiciousPattern', blocked_at: '2025-02-05T14:00:00Z' },
  { id: 2, ip_address: '45.33.112.88', is_blocked: true, is_whitelisted: false, block_reason: 'profile.superAdmin.ipManagement.blockReasons.scrapingBot', blocked_at: '2025-02-06T09:15:00Z' },
  { id: 3, ip_address: '185.220.101.42', is_blocked: true, is_whitelisted: false, block_reason: 'profile.superAdmin.ipManagement.blockReasons.loginBruteforce', blocked_at: '2025-02-06T08:45:00Z' },
  { id: 4, ip_address: '198.51.100.99', is_blocked: true, is_whitelisted: false, block_reason: 'profile.superAdmin.ipManagement.blockReasons.apiAbuse', blocked_at: '2025-02-06T09:40:00Z' },
  { id: 5, ip_address: '203.0.113.250', is_blocked: true, is_whitelisted: false, block_reason: 'profile.superAdmin.ipManagement.blockReasons.maliciousBot', blocked_at: '2025-02-04T16:20:00Z' },
  { id: 6, ip_address: '10.20.30.40', is_blocked: false, is_whitelisted: true, block_reason: null, blocked_at: null },
  { id: 7, ip_address: '172.16.0.1', is_blocked: false, is_whitelisted: true, block_reason: null, blocked_at: null },
  { id: 8, ip_address: '192.168.1.1', is_blocked: false, is_whitelisted: true, block_reason: null, blocked_at: null },
  { id: 9, ip_address: '8.8.8.8', is_blocked: false, is_whitelisted: false, block_reason: null, blocked_at: null },
  { id: 10, ip_address: '1.1.1.1', is_blocked: false, is_whitelisted: false, block_reason: null, blocked_at: null }
];

// 차트용 Mock 데이터
const getLastNDays = (n) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export const mockAccessTrendData = (days = 7) =>
  getLastNDays(days).map((date, i) => ({
    date: date.slice(5),
    total: 800 + Math.floor(Math.random() * 400) + i * 50,
    unique: 150 + Math.floor(Math.random() * 80) + i * 10
  }));

export const mockCountryDistribution = [
  { name: '日本', value: 850 },
  { name: '韓国', value: 220 },
  { name: 'アメリカ', value: 95 },
  { name: '中国', value: 52 },
  { name: 'その他', value: 30 }
];

export const mockHourlyAccessData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  count: i >= 8 && i <= 22 ? 60 + Math.floor(Math.random() * 80) : 5 + Math.floor(Math.random() * 25)
}));

export const mockTopAccessIPs = [
  { ip: '192.168.1.100', country: 'JP', accessCount: 312 },
  { ip: '203.0.113.45', country: 'KR', accessCount: 198 },
  { ip: '198.51.100.23', country: 'JP', accessCount: 156 },
  { ip: '211.234.56.78', country: 'JP', accessCount: 124 },
  { ip: '121.165.200.33', country: 'KR', accessCount: 98 },
  { ip: '172.16.88.12', country: 'JP', accessCount: 87 },
  { ip: '10.0.0.55', country: 'US', accessCount: 76 },
  { ip: '103.45.67.89', country: 'JP', accessCount: 65 },
  { ip: '8.8.8.8', country: 'US', accessCount: 54 },
  { ip: '203.0.113.200', country: 'KR', accessCount: 42 }
];

// ==================== 보안 ====================
export const mockSecurityStats = {
  todayEvents: 47,
  botDetected: 12,
  autoBlocked: 5,
  loginFailed: 28,
  todayEventsChange: 8,
  botDetectedChange: 3,
  autoBlockedChange: 2,
  loginFailedChange: 5
};

export const mockSecurityEvents = [
  { id: 1, event_type: 'login_failed', ip_address: '203.0.113.50', request_path: '/auth/login', severity: 'medium', created_at: '2025-02-06T10:45:00Z', is_blocked: false },
  { id: 2, event_type: 'bot_detected', ip_address: '198.51.100.99', request_path: '/api/products', severity: 'high', created_at: '2025-02-06T10:30:00Z', is_blocked: true },
  { id: 3, event_type: 'api_abuse', ip_address: '192.0.2.88', request_path: '/api/search', severity: 'critical', created_at: '2025-02-06T10:22:00Z', is_blocked: true },
  { id: 4, event_type: 'scraping', ip_address: '203.0.113.201', request_path: '/product/123', severity: 'high', created_at: '2025-02-06T10:15:00Z', is_blocked: true },
  { id: 5, event_type: 'login_failed', ip_address: '198.51.100.10', request_path: '/auth/login', severity: 'low', created_at: '2025-02-06T10:08:00Z', is_blocked: false },
  { id: 6, event_type: 'suspicious_activity', ip_address: '192.0.2.100', request_path: '/api/cart', severity: 'medium', created_at: '2025-02-06T09:55:00Z', is_blocked: false },
  { id: 7, event_type: 'ip_blocked', ip_address: '198.51.100.99', request_path: '/', severity: 'critical', created_at: '2025-02-06T09:40:00Z', is_blocked: true },
  { id: 8, event_type: 'login_failed', ip_address: '203.0.113.77', request_path: '/auth/login', severity: 'medium', created_at: '2025-02-06T09:30:00Z', is_blocked: false },
  { id: 9, event_type: 'bot_detected', ip_address: '192.0.2.55', request_path: '/api/categories', severity: 'high', created_at: '2025-02-06T09:18:00Z', is_blocked: true },
  { id: 10, event_type: 'api_abuse', ip_address: '203.0.113.50', request_path: '/api/users', severity: 'high', created_at: '2025-02-06T09:05:00Z', is_blocked: false },
  { id: 11, event_type: 'scraping', ip_address: '198.51.100.33', request_path: '/product/456', severity: 'medium', created_at: '2025-02-06T08:50:00Z', is_blocked: true },
  { id: 12, event_type: 'login_failed', ip_address: '192.0.2.200', request_path: '/auth/login', severity: 'low', created_at: '2025-02-06T08:35:00Z', is_blocked: false },
  { id: 13, event_type: 'bot_detected', ip_address: '203.0.113.120', request_path: '/api/products', severity: 'critical', created_at: '2025-02-06T08:20:00Z', is_blocked: true },
  { id: 14, event_type: 'suspicious_activity', ip_address: '198.51.100.77', request_path: '/profile', severity: 'low', created_at: '2025-02-06T08:10:00Z', is_blocked: false },
  { id: 15, event_type: 'ip_blocked', ip_address: '192.0.2.55', request_path: '/api/orders', severity: 'high', created_at: '2025-02-06T07:55:00Z', is_blocked: true }
];

export const mockBots = [
  { id: 1, ip_address: '198.51.100.99', user_agent: 'Mozilla/5.0 (compatible; BadBot/1.0; +http://example.com/bot)', detection_reason: '비정상적인 요청 패턴 (초당 100건 이상)', confidence_score: 98, created_at: '2025-02-06T10:30:00Z', is_blocked: true },
  { id: 2, ip_address: '192.0.2.55', user_agent: 'Googlebot/2.1 (normal crawl)', detection_reason: '정상 크롤러 (허용)', confidence_score: 15, created_at: '2025-02-06T09:18:00Z', is_blocked: false },
  { id: 3, ip_address: '203.0.113.201', user_agent: 'Mozilla/5.0 (Windows; scraping script)', detection_reason: '스크래핑 봇 (상품 페이지 연속 요청)', confidence_score: 91, created_at: '2025-02-06T10:15:00Z', is_blocked: true },
  { id: 4, ip_address: '198.51.100.33', user_agent: 'curl/7.68.0', detection_reason: 'API 무차별 대입 시도', confidence_score: 88, created_at: '2025-02-06T08:50:00Z', is_blocked: true },
  { id: 5, ip_address: '203.0.113.120', user_agent: 'Mozilla/5.0 (compatible; MaliciousBot/3.0)', detection_reason: '악성 봇 시그니처', confidence_score: 95, created_at: '2025-02-06T08:20:00Z', is_blocked: true },
  { id: 6, ip_address: '203.0.113.88', user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15', detection_reason: '정상 사용자 (오탐 해제)', confidence_score: 8, created_at: '2025-02-06T07:45:00Z', is_blocked: false },
  { id: 7, ip_address: '192.0.2.100', user_agent: 'Python-requests/2.28.0', detection_reason: '스크립트 기반 API 호출 (과다)', confidence_score: 76, created_at: '2025-02-06T09:55:00Z', is_blocked: false },
  { id: 8, ip_address: '198.51.100.10', user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0', detection_reason: '로그인 실패 반복 (브루트포스 의심)', confidence_score: 82, created_at: '2025-02-06T10:08:00Z', is_blocked: false }
];

export const mockSecuritySettings = {
  auto_block_enabled: true,
  bot_detection_threshold: 70,
  max_login_attempts: 5,
  block_duration_hours: 24
};

export const mockEventTrendData = (days = 7) =>
  getLastNDays(days).map((date, i) => ({
    date: date.slice(5),
    login_failed: 12 + Math.floor(Math.random() * 12) + i * 2,
    bot_detected: 3 + Math.floor(Math.random() * 6) + i,
    api_abuse: 2 + Math.floor(Math.random() * 4),
    scraping: 1 + Math.floor(Math.random() * 3),
    ip_blocked: 1 + Math.floor(Math.random() * 4)
  }));

export const mockEventDistribution = [
  { name: 'ログイン失敗', value: 38 },
  { name: 'ボット検出', value: 22 },
  { name: 'API乱用', value: 14 },
  { name: 'スクレイピング', value: 12 },
  { name: '不審なアクティビティ', value: 8 },
  { name: 'IPブロック', value: 6 }
];

export const mockHourlySecurityData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  count: i >= 8 && i <= 23 ? 3 + Math.floor(Math.random() * 8) : Math.floor(Math.random() * 4)
}));

export const mockTopAttackIPs = [
  { ip: '203.0.113.50', eventCount: 24, maxSeverity: 'high' },
  { ip: '198.51.100.99', eventCount: 18, maxSeverity: 'critical' },
  { ip: '192.0.2.88', eventCount: 14, maxSeverity: 'critical' },
  { ip: '203.0.113.201', eventCount: 11, maxSeverity: 'high' },
  { ip: '192.0.2.55', eventCount: 9, maxSeverity: 'high' },
  { ip: '198.51.100.10', eventCount: 7, maxSeverity: 'medium' },
  { ip: '192.0.2.100', eventCount: 6, maxSeverity: 'medium' },
  { ip: '203.0.113.120', eventCount: 5, maxSeverity: 'critical' },
  { ip: '198.51.100.33', eventCount: 4, maxSeverity: 'high' },
  { ip: '203.0.113.77', eventCount: 3, maxSeverity: 'low' }
];

// ==================== 템플릿 ====================
// 슈퍼관리자 템플릿 상세용 임시 데이터 (한/일/영 3개국어)
export const mockTemplates = [
  {
    id: 1,
    name: '스타터 패키지',
    name_ja: 'スターターパッケージ',
    name_en: 'Starter Package',
    description: '웹 개발 입문자를 위한 AI 조합. 상품 관리, 결제 시스템, 장바구니 등 전자상거래 기능을 완벽하게 지원합니다.',
    description_ja: 'Web開発入門者のためのAIセット。商品管理、決済システム、ショッピングカートなどEC機能をサポートします。',
    description_en: 'AI set for web development beginners. Supports e-commerce features such as product management, payment systems, and shopping carts.',
    icon_url: '/images/icons/all.png',
    product_ids: [1, 2, 3],
    product_count: 3,
    created_at: '2025-01-15T10:00:00Z',
    projectDescription: '웹 개발 입문을 위한 완전한 AI 팀을 구성했습니다. 프론트엔드 기초부터 백엔드 API, 데이터베이스 연동까지 온라인 서비스 구축에 필요한 핵심 기능을 지원합니다.',
    projectDescription_ja: 'Web開発入門のためのAIチームを構成しました。フロントエンドの基礎からバックエンドAPI、DB連携まで、オンラインサービス構築に必要な機能をサポートします。',
    projectDescription_en: 'We have assembled a complete AI team for web development beginners. From frontend basics to backend API and database integration, we support the core features needed to build online services.',
    whySelected: '스타터 패키지는 초보 개발자도 쉽게 따라 할 수 있도록 UI 구성, API 설계, DB 관리 AI를 포함했습니다. 이 템플릿으로 완전한 풀스택 웹 앱을 단계별로 구축할 수 있습니다.',
    whySelected_ja: 'スターターパッケージは、初心者でも簡単に始められるようUI構成、API設計、DB管理AIを含めました。このテンプレートでフルスタックWebアプリを段階的に構築できます。',
    whySelected_en: 'The Starter Package includes UI setup, API design, and DB management AI so that beginners can follow along easily. With this template you can build a full-stack web app step by step.',
    aiDescriptions: [
      '프론트엔드: 반응형 UI 및 사용자 인터페이스 구성',
      '백엔드 API: REST API 설계 및 인증 처리',
      '데이터베이스: 스키마 설계 및 CRUD 연동',
      '배포: 배포 환경 설정 및 CI/CD 기본',
      '문서화: 코드 주석 및 API 문서 생성'
    ],
    aiDescriptions_ja: [
      'フロントエンド: レスポンシブUIとユーザーインターフェース構成',
      'バックエンドAPI: REST API設計と認証処理',
      'データベース: スキーマ設計とCRUD連携',
      'デプロイ: デプロイ環境設定とCI/CD基本',
      'ドキュメント: コードコメントとAPI文書生成'
    ],
    aiDescriptions_en: [
      'Frontend: Responsive UI and user interface structure',
      'Backend API: REST API design and authentication',
      'Database: Schema design and CRUD integration',
      'Deployment: Deployment environment and CI/CD basics',
      'Documentation: Code comments and API documentation'
    ]
  },
  {
    id: 2,
    name: '프론트엔드 세트',
    name_ja: 'フロントエンドセット',
    name_en: 'Frontend Set',
    description: '프론트엔드 개발에 최적화된 AI 팀. 반응형 디자인, 컴포넌트 설계, 상태 관리 등 현대적 웹 프론트엔드에 필요한 기능을 포함합니다.',
    description_ja: 'フロントエンド開発に最適化されたAIチーム。レスポンシブデザイン、コンポーネント設計、状態管理など、モダンなWebフロントに必要な機能を含みます。',
    description_en: 'AI team optimized for frontend development. Includes responsive design, component architecture, state management, and other modern web frontend features.',
    icon_url: '/images/icons/fe.png',
    product_ids: [4, 5, 6, 7],
    product_count: 4,
    created_at: '2025-01-20T14:30:00Z',
    projectDescription: '프론트엔드 전문 개발을 위한 AI 팀입니다. React/Vue 컴포넌트 설계, 상태 관리, 접근성, 성능 최적화까지 프론트엔드 개발의 핵심 영역을 커버합니다.',
    projectDescription_ja: 'フロントエンド専門開発のためのAIチームです。React/Vueコンポーネント設計、状態管理、アクセシビリティ、パフォーマンス最適化までカバーします。',
    projectDescription_en: 'An AI team for professional frontend development. Covers component design (React/Vue), state management, accessibility, and performance optimization.',
    whySelected: '프론트엔드 세트는 UI 컴포넌트 설계, 상태 관리, 테스트, 번들 최적화 AI를 포함했습니다. 단일 페이지 애플리케이션(SPA)과 반응형 웹을 체계적으로 구현할 수 있습니다.',
    whySelected_ja: 'フロントエンドセットは、UIコンポーネント設計、状態管理、テスト、バンドル最適化AIを含みました。SPAとレスポンシブWebを体系的に実装できます。',
    whySelected_en: 'The Frontend Set includes UI component design, state management, testing, and bundle optimization AI. You can implement SPAs and responsive web in a structured way.',
    aiDescriptions: [
      '컴포넌트 설계: 재사용 가능한 UI 컴포넌트 구조',
      '상태 관리: 전역/지역 상태 및 데이터 흐름',
      '스타일링: CSS-in-JS, 디자인 시스템 적용',
      '테스트: 단위 테스트 및 E2E 테스트 작성',
      '성능: 번들 최적화 및 렌더링 성능 개선'
    ],
    aiDescriptions_ja: [
      'コンポーネント設計: 再利用可能なUIコンポーネント構造',
      '状態管理: グローバル/ローカル状態とデータフロー',
      'スタイリング: CSS-in-JS、デザインシステム適用',
      'テスト: 単体テストとE2Eテスト作成',
      'パフォーマンス: バンドル最適化とレンダリング改善'
    ],
    aiDescriptions_en: [
      'Component design: Reusable UI component structure',
      'State management: Global/local state and data flow',
      'Styling: CSS-in-JS, design system application',
      'Testing: Unit tests and E2E test authoring',
      'Performance: Bundle optimization and rendering improvement'
    ]
  }
];
