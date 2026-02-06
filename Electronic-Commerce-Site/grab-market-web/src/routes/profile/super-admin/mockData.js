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
    username: 'seller_wannabe',
    seller_requested_at: '2025-02-05T08:00:00Z',
    role: 'user',
    seller_rejected_at: null,
    seller_application_data: JSON.stringify({
      seller_name: '田中太郎',
      contact_email: 'tanaka@seller.com',
      specialization: '웹 개발 / React',
      phone: '090-1234-5678'
    })
  },
  {
    user_id: 202,
    username: 'creative_dev',
    seller_requested_at: '2025-02-04T14:30:00Z',
    role: 'user',
    seller_rejected_at: null,
    seller_application_data: JSON.stringify({
      seller_name: '鈴木デザイン',
      contact_email: 'suzuki@creative.jp',
      specialization: 'UI/UX 디자인',
      phone: '080-9876-5432'
    })
  }
];

// ==================== 판매자 신청 상세 ====================
export const mockSellerApplicationDetail = (userId) => ({
  user: {
    id: userId,
    username: 'seller_wannabe',
    email: 'tanaka@seller.com',
    createdAt: '2024-01-15T10:00:00Z',
    role: 'user',
    seller_requested_at: '2025-02-05T08:00:00Z',
    seller_rejected_at: null
  },
  application: {
    seller_name: '田中太郎',
    contact_email: 'tanaka@seller.com',
    phone: '090-1234-5678',
    specialization: '웹 개발 / React',
    tech_stack: 'React, Node.js, PostgreSQL',
    portfolio_url: 'https://portfolio.example.com',
    github_url: 'https://github.com/tanaka-dev',
    business_number: '',
    product_description: '고품질 웹 애플리케이션 개발 서비스를 제공합니다. React 기반의 모던한 UI와 안정적인 백엔드를 구축합니다.',
    motivation: '학생 시절부터 웹 개발에 관심이 있었고, 이 플랫폼을 통해 더 많은 분들께 서비스를 제공하고 싶습니다.'
  },
  validation: {
    totalScore: 85,
    recommendation: 'approve',
    message: '승인 권장',
    checks: [
      { category: '필수 정보', message: '8/8 항목 완료', score: 20 },
      { category: '이메일', message: '유효한 형식', score: 10 },
      { category: '전화번호', message: '유효한 형식', score: 10 },
      { category: '기술 스택', message: '유효한 카테고리', score: 15 },
      { category: '포트폴리오', message: '접근 가능', score: 15 },
      { category: 'GitHub', message: '접근 가능', score: 5 },
      { category: '텍스트 품질', message: '상품 설명: 150자, 신청 동기: 120자', score: 10 }
    ]
  }
});

// ==================== IP 관리 ====================
export const mockIPLogs = [
  {
    id: 1,
    ip_address: '192.168.1.100',
    user: { username: 'user1' },
    request_path: '/api/products',
    country: 'JP',
    created_at: '2025-02-06T10:30:00Z',
    is_blocked: false
  },
  {
    id: 2,
    ip_address: '203.0.113.45',
    user: null,
    request_path: '/login',
    country: 'KR',
    created_at: '2025-02-06T10:28:00Z',
    is_blocked: false
  },
  {
    id: 3,
    ip_address: '198.51.100.23',
    user: { username: 'seller_wannabe' },
    request_path: '/profile',
    country: 'JP',
    created_at: '2025-02-06T10:25:00Z',
    is_blocked: false
  }
];

export const mockIPStats = {
  todayAccess: 1247,
  uniqueIPs: 342,
  blocked: 2,
  countries: 15,
  todayAccessChange: 156,
  uniqueIPsChange: 28,
  countriesChange: 1
};

export const mockIPManagement = [
  {
    id: 1,
    ip_address: '192.0.2.100',
    is_blocked: true,
    is_whitelisted: false,
    block_reason: '의심스러운 접근 패턴',
    blocked_at: '2025-02-05T14:00:00Z'
  }
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
  hour: `${i}:00`,
  count: i >= 9 && i <= 18 ? 80 + Math.floor(Math.random() * 60) : 10 + Math.floor(Math.random() * 20)
}));

export const mockTopAccessIPs = [
  { ip: '192.168.1.100', country: 'JP', accessCount: 156 },
  { ip: '203.0.113.45', country: 'KR', accessCount: 98 },
  { ip: '198.51.100.23', country: 'JP', accessCount: 72 }
];

// ==================== 보안 ====================
export const mockSecurityStats = {
  todayEvents: 12,
  botDetected: 3,
  autoBlocked: 1,
  loginFailed: 8,
  todayEventsChange: -3,
  botDetectedChange: -1,
  autoBlockedChange: 0,
  loginFailedChange: -2
};

export const mockSecurityEvents = [
  {
    id: 1,
    event_type: 'login_failed',
    ip_address: '203.0.113.50',
    request_path: '/auth/login',
    severity: 'medium',
    created_at: '2025-02-06T10:45:00Z',
    is_blocked: false
  },
  {
    id: 2,
    event_type: 'bot_detected',
    ip_address: '198.51.100.99',
    request_path: '/api/products',
    severity: 'high',
    created_at: '2025-02-06T10:30:00Z',
    is_blocked: true
  }
];

export const mockBots = [
  {
    id: 1,
    ip_address: '198.51.100.99',
    user_agent: 'Mozilla/5.0 (compatible; BadBot/1.0)',
    detection_reason: '비정상적인 요청 패턴',
    confidence_score: 92,
    created_at: '2025-02-06T10:30:00Z',
    is_blocked: true
  }
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
    login_failed: 5 + Math.floor(Math.random() * 5),
    bot_detected: Math.floor(Math.random() * 3),
    api_abuse: Math.floor(Math.random() * 2),
    scraping: Math.floor(Math.random() * 2),
    ip_blocked: Math.floor(Math.random() * 2)
  }));

export const mockEventDistribution = [
  { name: 'ログイン失敗', value: 45 },
  { name: 'ボット検出', value: 25 },
  { name: 'API乱用', value: 15 },
  { name: 'スクレイピング', value: 10 },
  { name: 'IPブロック', value: 5 }
];

export const mockHourlySecurityData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  count: i >= 9 && i <= 22 ? 2 + Math.floor(Math.random() * 5) : Math.floor(Math.random() * 2)
}));

export const mockTopAttackIPs = [
  { ip: '203.0.113.50', eventCount: 15, maxSeverity: 'high' },
  { ip: '198.51.100.99', eventCount: 8, maxSeverity: 'critical' }
];

// ==================== 템플릿 ====================
export const mockTemplates = [
  {
    id: 1,
    name: '스타터 패키지',
    description: '웹 개발 입문자를 위한 AI 조합',
    icon_url: '/images/icons/all.png',
    product_count: 3,
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: '프론트엔드 세트',
    description: '프론트엔드 개발에 최적화된 AI 팀',
    icon_url: '/images/icons/fe.png',
    product_count: 4,
    created_at: '2025-01-20T14:30:00Z'
  }
];
