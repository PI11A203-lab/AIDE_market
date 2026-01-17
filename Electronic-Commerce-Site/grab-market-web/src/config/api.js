import axios from 'axios';
import { API_URL } from './constants';

// axios 인스턴스 생성 (기본 설정)
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 현재 경로가 로그인 페이지가 아닌 경우에만 리다이렉트
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && !currentPath.startsWith('/login')) {
        // 인증 실패 시 로그아웃 처리
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * API 클라이언트
 * 모든 API 호출은 이 객체를 통해 수행됩니다.
 */
export const api = {
  // ==================== 상품 관련 ====================
  products: {
    /**
     * 전체 상품 목록 조회 (페이지네이션 + 필터)
     * @param {Object} params - { page, limit, category, sort, search }
     */
    getList: (params = {}) => apiClient.get('/api/products', { params }),

    /**
     * 상품 상세 정보 조회 (AI 통계 + 태그 + 시너지 포함)
     * @param {number} id - 상품 ID
     */
    getDetail: (id) => apiClient.get(`/api/products/${id}`),

    /**
     * AI 통계 조회
     * @param {number} id - 상품 ID
     */
    getStats: (id) => apiClient.get(`/api/products/${id}/stats`),

    /**
     * 추천 AI 조회 (시너지)
     * @param {number} id - 상품 ID
     * @param {number} limit - 최대 개수 (기본값: 5)
     */
    getSynergies: (id, limit = 5) => 
      apiClient.get(`/api/products/${id}/synergies`, { params: { limit } }),

    /**
     * 카테고리별 대표 상품 조회
     * @param {number} categoryId - 카테고리 ID
     * @param {number} limit - 반환할 상품 개수 (기본값: 4)
     */
    getFeaturedByCategory: (categoryId, limit = 4) =>
      apiClient.get(`/api/products/featured/category/${categoryId}`, { params: { limit } }),

    /**
     * 카테고리별 상품 목록
     * @param {number} categoryId - 카테고리 ID
     * @param {Object} params - { subcategory, page, limit, sort }
     */
    getByCategory: (categoryId, params = {}) =>
      apiClient.get(`/api/products/category/${categoryId}`, { params }),

    /**
     * 태그별 상품 목록
     * @param {number} tagId - 태그 ID
     * @param {Object} params - { page, limit }
     */
    getByTag: (tagId, params = {}) =>
      apiClient.get(`/api/products/by-tag/${tagId}`, { params }),

    /**
     * 상품 생성
     * @param {Object} data - 상품 정보
     */
    create: (data) => apiClient.post('/api/products', data),

    /**
     * 상품 구매
     * @param {number} id - 상품 ID
     */
    purchase: (id) => apiClient.post(`/api/products/purchase/${id}`),
  },

  // ==================== 카테고리 관련 ====================
  categories: {
    /**
     * 전체 카테고리 목록
     */
    getList: () => apiClient.get('/api/categories'),

    /**
     * 메인 페이지용: 카테고리 목록과 각 카테고리의 대표 상품
     * @param {number} productsLimit - 각 카테고리별 대표 상품 개수 (기본값: 4)
     */
    getWithProducts: (productsLimit = 4) =>
      apiClient.get('/api/categories/with-products', { params: { productsLimit } }),

    /**
     * 서브카테고리 목록
     * @param {number} id - 카테고리 ID
     */
    getSubcategories: (id) => apiClient.get(`/api/categories/${id}/subcategories`),

    /**
     * 카테고리 생성
     * @param {Object} data - 카테고리 정보
     */
    create: (data) => apiClient.post('/api/categories', data),
  },

  // ==================== 서브카테고리 관련 ====================
  subcategories: {
    /**
     * 전체 서브카테고리 목록
     * @param {Object} params - { page, limit, category_id }
     */
    getList: (params = {}) => apiClient.get('/api/subcategories', { params }),

    /**
     * 카테고리별 서브카테고리 목록
     * @param {number} categoryId - 카테고리 ID
     */
    getByCategory: (categoryId) => apiClient.get(`/api/subcategories/category/${categoryId}`),

    /**
     * ID로 서브카테고리 조회
     * @param {number} id - 서브카테고리 ID
     */
    getById: (id) => apiClient.get(`/api/subcategories/${id}`),

    /**
     * 서브카테고리 생성
     * @param {Object} data - 서브카테고리 정보
     */
    create: (data) => apiClient.post('/api/subcategories', data),

    /**
     * 서브카테고리 업데이트
     * @param {number} id - 서브카테고리 ID
     * @param {Object} data - 업데이트할 정보
     */
    update: (id, data) => apiClient.put(`/api/subcategories/${id}`, data),

    /**
     * 서브카테고리 삭제
     * @param {number} id - 서브카테고리 ID
     */
    delete: (id) => apiClient.delete(`/api/subcategories/${id}`),
  },

  // ==================== 태그 관련 ====================
  tags: {
    /**
     * 전체 태그 목록
     */
    getList: () => apiClient.get('/api/tags'),

    /**
     * 태그 생성
     * @param {Object} data - { name }
     */
    create: (data) => apiClient.post('/api/tags', data),
  },

  // ==================== 사용자 관련 ====================
  users: {
    /**
     * 전체 사용자 목록 조회
     * @param {Object} params - { page, limit }
     */
    getList: (params = {}) => apiClient.get('/api/users', { params }),

    /**
     * ID로 사용자 조회
     * @param {number} id - 사용자 ID
     */
    getById: (id) => apiClient.get(`/api/users/${id}`),

    /**
     * 사용자명으로 사용자 조회
     * @param {string} username - 사용자명
     */
    getByUsername: (username) => apiClient.get(`/api/users/username/${username}`),

    /**
     * 사용자 생성 (회원가입)
     * @param {Object} data - { username, email, password, role, profile_image }
     */
    create: (data) => apiClient.post('/api/users', data),

    /**
     * 사용자 업데이트
     * @param {number} id - 사용자 ID
     * @param {Object} data - 업데이트할 정보
     */
    update: (id, data) => apiClient.put(`/api/users/${id}`, data),

    /**
     * 사용자 삭제
     * @param {number} id - 사용자 ID
     */
    delete: (id) => apiClient.delete(`/api/users/${id}`),

    /**
     * 비밀번호 검증
     * @param {number} id - 사용자 ID
     * @param {string} password - 비밀번호
     */
    validatePassword: (id, password) =>
      apiClient.post(`/api/users/${id}/validate-password`, { password }),

    /**
     * 비밀번호 재설정 요청 (이메일로 6자리 코드 전송)
     * @param {string} email - 사용자 이메일
     */
    requestPasswordReset: (email) =>
      apiClient.post('/api/users/forgot-password', { email }),

    /**
     * 인증 코드 검증
     * @param {string} email - 사용자 이메일
     * @param {string} code - 6자리 인증 코드
     */
    verifyResetCode: (email, code) =>
      apiClient.post('/api/users/verify-reset-code', { email, code }),

    /**
     * 비밀번호 재설정 (토큰으로)
     * @param {string} resetToken - 재설정 토큰
     * @param {string} newPassword - 새 비밀번호
     */
    resetPassword: (resetToken, newPassword) =>
      apiClient.post('/api/users/reset-password', { resetToken, newPassword }),

    /**
     * 팔로우하기
     * @param {number} userId - 팔로우할 사용자 ID (following_id)
     * @param {number} followerId - 팔로우하는 사용자 ID (follower_id)
     */
    follow: (userId, followerId) =>
      apiClient.post(`/api/users/${userId}/follow`, { follower_id: followerId }),

    /**
     * 언팔로우하기
     * @param {number} userId - 언팔로우할 사용자 ID (following_id)
     * @param {number} followerId - 언팔로우하는 사용자 ID (follower_id)
     */
    unfollow: (userId, followerId) =>
      apiClient.post(`/api/users/${userId}/unfollow`, { follower_id: followerId }),

    /**
     * 팔로우 상태 확인
     * @param {number} userId - 확인할 사용자 ID (following_id)
     * @param {number} followerId - 팔로우하는 사용자 ID (follower_id, 선택사항)
     */
    checkFollowStatus: (userId, followerId) =>
      apiClient.get(`/api/users/${userId}/follow-status`, {
        params: followerId ? { follower_id: followerId } : {}
      }),

    /**
     * 팔로워 목록 조회
     * @param {number} userId - 사용자 ID
     * @param {Object} params - { page, limit }
     */
    getFollowers: (userId, params = {}) =>
      apiClient.get(`/api/users/${userId}/followers`, { params }),

    /**
     * 팔로잉 목록 조회
     * @param {number} userId - 사용자 ID
     * @param {Object} params - { page, limit }
     */
    getFollowing: (userId, params = {}) =>
      apiClient.get(`/api/users/${userId}/following`, { params }),
  },

  // ==================== 찜목록 관련 (Favorites) ====================
  favorites: {
    /**
     * 사용자별 찜목록 조회
     * @param {number} userId - 사용자 ID
     * @param {Object} params - { page, limit }
     */
    getByUser: (userId, params = {}) =>
      apiClient.get(`/api/favorites/users/${userId}`, { params }),

    /**
     * 특정 상품이 찜목록에 있는지 확인
     * @param {number} userId - 사용자 ID
     * @param {number} productId - 상품 ID
     */
    check: (userId, productId) =>
      apiClient.get(`/api/favorites/users/${userId}/products/${productId}`),

    /**
     * ID로 찜목록 조회
     * @param {number} id - 찜목록 ID
     */
    getById: (id) => apiClient.get(`/api/favorites/${id}`),

    /**
     * 찜목록 추가
     * @param {Object} data - { user_id, product_id }
     */
    create: (data) => apiClient.post('/api/favorites', data),

    /**
     * 찜목록 삭제 (user_id와 product_id로)
     * @param {number} userId - 사용자 ID
     * @param {number} productId - 상품 ID
     */
    delete: (userId, productId) =>
      apiClient.delete(`/api/favorites/users/${userId}/products/${productId}`),
  },

  // ==================== 리뷰 관련 (Reviews) ====================
  reviews: {
    /**
     * 상품별 리뷰 목록 조회
     * @param {number} productId - 상품 ID
     * @param {Object} params - { page, limit, user_id }
     */
    getByProduct: (productId, params = {}) =>
      apiClient.get(`/api/reviews/products/${productId}`, { params }),

    /**
     * 사용자별 리뷰 목록 조회
     * @param {number} userId - 사용자 ID
     * @param {Object} params - { page, limit, current_user_id }
     */
    getByUser: (userId, params = {}) =>
      apiClient.get(`/api/reviews/users/${userId}`, { params }),

    /**
     * ID로 리뷰 조회
     * @param {number} id - 리뷰 ID
     * @param {Object} params - { user_id }
     */
    getById: (id, params = {}) => apiClient.get(`/api/reviews/${id}`, { params }),

    /**
     * 리뷰 생성
     * @param {Object} data - { order_item_id, rating, comment, images }
     */
    create: (data) => apiClient.post('/api/reviews', data),

    /**
     * 리뷰 업데이트
     * @param {number} id - 리뷰 ID
     * @param {Object} data - 업데이트할 정보
     */
    update: (id, data) => apiClient.put(`/api/reviews/${id}`, data),

    /**
     * 리뷰 삭제
     * @param {number} id - 리뷰 ID
     * @param {Object} config - axios config (params, data 등)
     */
    delete: (id, config = {}) => apiClient.delete(`/api/reviews/${id}`, config),

    /**
     * 리뷰 helpful 추가/삭제
     * @param {number} reviewId - 리뷰 ID
     * @param {number} userId - 사용자 ID
     */
    toggleHelpful: (reviewId, userId) =>
      apiClient.post(`/api/reviews/${reviewId}/helpful`, { user_id: userId }),
  },

  // ==================== 주문 관련 ====================
  orders: {
    /**
     * 전체 주문 목록 조회
     * @param {Object} params - { page, limit, user_id, status }
     */
    getList: (params = {}) => apiClient.get('/api/orders', { params }),

    /**
     * 사용자별 주문 목록 조회
     * @param {number} userId - 사용자 ID
     * @param {Object} params - { page, limit }
     */
    getByUser: (userId, params = {}) =>
      apiClient.get(`/api/orders/users/${userId}`, { params }),

    /**
     * ID로 주문 조회
     * @param {number} id - 주문 ID
     */
    getById: (id) => apiClient.get(`/api/orders/${id}`),

    /**
     * 주문 번호로 주문 조회
     * @param {string} orderNumber - 주문 번호
     */
    getByOrderNumber: (orderNumber) =>
      apiClient.get(`/api/orders/order-number/${orderNumber}`),

    /**
     * 주문 생성
     * @param {Object} data - 주문 정보
     */
    create: (data) => apiClient.post('/api/orders', data),

    /**
     * 주문 업데이트
     * @param {number} id - 주문 ID
     * @param {Object} data - 업데이트할 정보
     */
    update: (id, data) => apiClient.put(`/api/orders/${id}`, data),

    /**
     * 주문 삭제
     * @param {number} id - 주문 ID
     */
    delete: (id) => apiClient.delete(`/api/orders/${id}`),
  },

  // ==================== 주문 아이템 관련 ====================
  orderItems: {
    /**
     * 전체 주문 아이템 목록 조회
     * @param {Object} params - { page, limit, order_id, product_id }
     */
    getList: (params = {}) => apiClient.get('/api/order-items', { params }),

    /**
     * 주문별 주문 아이템 목록 조회
     * @param {number} orderId - 주문 ID
     */
    getByOrder: (orderId) => apiClient.get(`/api/order-items/orders/${orderId}`),

    /**
     * 주문별 주문 아이템 총합 계산
     * @param {number} orderId - 주문 ID
     */
    getTotalByOrder: (orderId) => apiClient.get(`/api/order-items/orders/${orderId}/total`),

    /**
     * 상품별 주문 아이템 목록 조회
     * @param {number} productId - 상품 ID
     * @param {Object} params - { page, limit }
     */
    getByProduct: (productId, params = {}) =>
      apiClient.get(`/api/order-items/products/${productId}`, { params }),

    /**
     * ID로 주문 아이템 조회
     * @param {number} id - 주문 아이템 ID
     */
    getById: (id) => apiClient.get(`/api/order-items/${id}`),

    /**
     * 주문 아이템 생성
     * @param {Object} data - 주문 아이템 정보
     */
    create: (data) => apiClient.post('/api/order-items', data),

    /**
     * 주문 아이템 업데이트
     * @param {number} id - 주문 아이템 ID
     * @param {Object} data - 업데이트할 정보
     */
    update: (id, data) => apiClient.put(`/api/order-items/${id}`, data),

    /**
     * 주문 아이템 삭제
     * @param {number} id - 주문 아이템 ID
     */
    delete: (id) => apiClient.delete(`/api/order-items/${id}`),
  },

  // ==================== 쿠폰 관련 ====================
  coupons: {
    /**
     * 전체 쿠폰 목록 조회
     * @param {Object} params - { page, limit, activeOnly }
     */
    getList: (params = {}) => apiClient.get('/api/coupons', { params }),

    /**
     * ID로 쿠폰 조회
     * @param {number} id - 쿠폰 ID
     */
    getById: (id) => apiClient.get(`/api/coupons/${id}`),

    /**
     * 쿠폰 코드로 조회
     * @param {string} code - 쿠폰 코드
     */
    getByCode: (code) => apiClient.get(`/api/coupons/code/${code}`),

    /**
     * 쿠폰 유효성 검사 및 할인 계산
     * @param {string} code - 쿠폰 코드
     * @param {number} orderAmount - 주문 금액
     */
    validate: (code, orderAmount) =>
      apiClient.post('/api/coupons/validate', { code, orderAmount }),

    /**
     * 쿠폰 생성
     * @param {Object} data - 쿠폰 정보
     */
    create: (data) => apiClient.post('/api/coupons', data),

    /**
     * 쿠폰 업데이트
     * @param {number} id - 쿠폰 ID
     * @param {Object} data - 업데이트할 정보
     */
    update: (id, data) => apiClient.put(`/api/coupons/${id}`, data),

    /**
     * 쿠폰 삭제
     * @param {number} id - 쿠폰 ID
     */
    delete: (id) => apiClient.delete(`/api/coupons/${id}`),
  },

  // ==================== 주문 쿠폰 관련 ====================
  orderCoupons: {
    /**
     * 전체 주문 쿠폰 목록 조회
     * @param {Object} params - { page, limit, order_id, user_id, coupon_id }
     */
    getList: (params = {}) => apiClient.get('/api/order-coupons', { params }),

    /**
     * 주문별 주문 쿠폰 목록 조회
     * @param {number} orderId - 주문 ID
     */
    getByOrder: (orderId) => apiClient.get(`/api/order-coupons/orders/${orderId}`),

    /**
     * 사용자별 주문 쿠폰 목록 조회
     * @param {number} userId - 사용자 ID
     * @param {Object} params - { page, limit }
     */
    getByUser: (userId, params = {}) =>
      apiClient.get(`/api/order-coupons/users/${userId}`, { params }),

    /**
     * 쿠폰별 주문 쿠폰 목록 조회
     * @param {number} couponId - 쿠폰 ID
     * @param {Object} params - { page, limit }
     */
    getByCoupon: (couponId, params = {}) =>
      apiClient.get(`/api/order-coupons/coupons/${couponId}`, { params }),

    /**
     * ID로 주문 쿠폰 조회
     * @param {number} id - 주문 쿠폰 ID
     */
    getById: (id) => apiClient.get(`/api/order-coupons/${id}`),

    /**
     * 주문 쿠폰 생성
     * @param {Object} data - 주문 쿠폰 정보
     */
    create: (data) => apiClient.post('/api/order-coupons', data),

    /**
     * 주문 쿠폰 업데이트
     * @param {number} id - 주문 쿠폰 ID
     * @param {Object} data - 업데이트할 정보
     */
    update: (id, data) => apiClient.put(`/api/order-coupons/${id}`, data),

    /**
     * 주문 쿠폰 삭제
     * @param {number} id - 주문 쿠폰 ID
     */
    delete: (id) => apiClient.delete(`/api/order-coupons/${id}`),
  },

  // ==================== 랭킹 관련 ====================
  rankings: {
    /**
     * 월간 TOP 5 랭킹
     * @param {number} year - 연도 (기본값: 2025)
     * @param {number} month - 월 (기본값: 11)
     */
    getMonthly: (year = 2025, month = 11) =>
      apiClient.get('/api/rankings/monthly', { params: { year, month } }),
  },

  // ==================== 통계 관련 ====================
  stats: {
    /**
     * 마켓플레이스 전체 통계
     */
    getOverview: () => apiClient.get('/api/stats/overview'),

    /**
     * AI Stats 전체 목록 조회
     * @param {Object} params - { page, limit }
     */
    getList: (params = {}) => apiClient.get('/api/stats', { params }),

    /**
     * AI Stats 조회 (ID로)
     * @param {number} id - Stats ID
     */
    getById: (id) => apiClient.get(`/api/stats/${id}`),

    /**
     * AI Stats 생성
     * @param {Object} data - Stats 정보
     */
    create: (data) => apiClient.post('/api/stats', data),

    /**
     * AI Stats 업데이트
     * @param {number} id - Stats ID
     * @param {Object} data - 업데이트할 정보
     */
    update: (id, data) => apiClient.put(`/api/stats/${id}`, data),

    /**
     * AI Stats 삭제
     * @param {number} id - Stats ID
     */
    delete: (id) => apiClient.delete(`/api/stats/${id}`),

    /**
     * 상품별 AI Stats 생성/업데이트 (Upsert)
     * @param {number} productId - 상품 ID
     * @param {Object} data - Stats 정보
     */
    upsertByProduct: (productId, data) =>
      apiClient.post(`/api/products/${productId}/stats`, data),
  },

  // ==================== 배너 관련 ====================
  banners: {
    /**
     * 배너 목록
     */
    getList: () => apiClient.get('/banners'),

    /**
     * 배너 생성
     * @param {Object} data - 배너 정보
     */
    create: (data) => apiClient.post('/banners', data),
  },

  // ==================== 이미지 업로드 ====================
  upload: {
    /**
     * 이미지 업로드
     * @param {FormData} formData - multipart/form-data 형식의 이미지 파일
     */
    image: (formData) =>
      apiClient.post('/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
  },

  // ==================== 장바구니 관련 ====================
  carts: {
    /**
     * 사용자별 장바구니 조회
     * @param {number} userId - 사용자 ID
     */
    getByUser: (userId) => apiClient.get(`/api/carts/users/${userId}`),

    /**
     * 장바구니에 상품 추가
     * @param {Object} data - { user_id, product_id, quantity }
     */
    addItem: (data) => apiClient.post('/api/carts', data),

    /**
     * 장바구니에서 상품 제거
     * @param {number} userId - 사용자 ID
     * @param {number} productId - 상품 ID
     */
    removeItem: (userId, productId) => apiClient.delete(`/api/carts/users/${userId}/products/${productId}`),

    /**
     * 장바구니 아이템 수량 변경
     * @param {Object} data - { user_id, product_id, quantity }
     */
    updateQuantity: (data) => apiClient.put('/api/carts/quantity', data),

    /**
     * 장바구니 비우기
     * @param {number} userId - 사용자 ID
     */
    clear: (userId) => apiClient.delete(`/api/carts/users/${userId}`),
  },

  // ==================== 결제방법 관련 ====================
  paymentMethods: {
    /**
     * 사용자별 결제방법 목록 조회
     * @param {number} userId - 사용자 ID
     */
    getByUser: (userId) => apiClient.get(`/api/payment-methods/users/${userId}`),

    /**
     * ID로 결제방법 조회
     * @param {number} id - 결제방법 ID
     */
    getById: (id) => apiClient.get(`/api/payment-methods/${id}`),

    /**
     * 결제방법 생성
     * @param {Object} data - 결제방법 정보
     */
    create: (data) => apiClient.post('/api/payment-methods', data),

    /**
     * 결제방법 업데이트
     * @param {number} id - 결제방법 ID
     * @param {Object} data - 업데이트할 정보
     */
    update: (id, data) => apiClient.put(`/api/payment-methods/${id}`, data),

    /**
     * 결제방법 삭제
     * @param {number} id - 결제방법 ID
     */
    delete: (id) => apiClient.delete(`/api/payment-methods/${id}`),
  },

  // ==================== 팀 구성 관련 (Team Compositions) ====================
  teamCompositions: {
    /**
     * 사용자별 팀 구성 목록 조회
     * @param {number} userId - 사용자 ID
     * @param {Object} params - { page, limit }
     */
    getByUser: (userId, params = {}) =>
      apiClient.get(`/api/team-compositions/users/${userId}`, { params }),

    /**
     * 전체 팀 구성 목록 조회
     * @param {Object} params - { page, limit }
     */
    getList: (params = {}) => apiClient.get('/api/team-compositions', { params }),

    /**
     * ID로 팀 구성 조회
     * @param {number} id - 팀 구성 ID
     */
    getById: (id) => apiClient.get(`/api/team-compositions/${id}`),

    /**
     * 팀 구성 생성
     * @param {Object} data - { user_id, name, total_synergy_score }
     */
    create: (data) => apiClient.post('/api/team-compositions', data),

    /**
     * 팀 구성 업데이트
     * @param {number} id - 팀 구성 ID
     * @param {Object} data - { name, total_synergy_score }
     */
    update: (id, data) => apiClient.put(`/api/team-compositions/${id}`, data),

    /**
     * 팀 구성 삭제
     * @param {number} id - 팀 구성 ID
     */
    delete: (id) => apiClient.delete(`/api/team-compositions/${id}`),
  },

  // ==================== 팀 멤버 관련 (Team Members) ====================
  teamMembers: {
    /**
     * 팀별 멤버 목록 조회
     * @param {number} teamId - 팀 구성 ID
     */
    getByTeam: (teamId) => apiClient.get(`/api/team-members/teams/${teamId}`),

    /**
     * ID로 팀 멤버 조회
     * @param {number} id - 팀 멤버 ID
     */
    getById: (id) => apiClient.get(`/api/team-members/${id}`),

    /**
     * 팀 멤버 추가
     * @param {Object} data - { team_id, product_id, category_id, position }
     */
    create: (data) => apiClient.post('/api/team-members', data),

    /**
     * 팀 멤버 업데이트
     * @param {number} id - 팀 멤버 ID
     * @param {Object} data - { category_id, position }
     */
    update: (id, data) => apiClient.put(`/api/team-members/${id}`, data),

    /**
     * 팀 멤버 삭제 (ID로)
     * @param {number} id - 팀 멤버 ID
     */
    delete: (id) => apiClient.delete(`/api/team-members/${id}`),

    /**
     * 팀 멤버 삭제 (team_id와 product_id로)
     * @param {number} teamId - 팀 구성 ID
     * @param {number} productId - 상품 ID
     */
    deleteByTeamAndProduct: (teamId, productId) =>
      apiClient.delete(`/api/team-members/teams/${teamId}/products/${productId}`),
  },

  // ==================== 인증 관련 (Auth) ====================
  auth: {
    /**
     * 일반 로그인 (이메일/비밀번호)
     * @param {Object} data - { email, password }
     */
    login: (data) => apiClient.post('/auth/login', data),
  },

  // ==================== 정기결제 관련 (Subscriptions) ====================
  subscriptions: {
    /**
     * 구독 생성
     * @param {Object} data - { orderId, cardId, couponId, userLanguage }
     */
    create: (data) => apiClient.post('/api/subscriptions', data),

    /**
     * 사용자별 구독 목록 조회
     * @param {number} userId - 사용자 ID
     */
    getByUser: (userId) => apiClient.get(`/api/subscriptions/users/${userId}`),

    /**
     * ID로 구독 조회
     * @param {number} id - 구독 ID
     */
    getById: (id) => apiClient.get(`/api/subscriptions/${id}`),

    /**
     * 토큰으로 구독 정보 조회 (이메일 링크용)
     * @param {string} token - 리마인더 토큰
     */
    getByReminderToken: (token) => apiClient.get(`/api/subscriptions/reminder/${token}`),

    /**
     * 결제 수단 변경
     * @param {number} id - 구독 ID
     * @param {Object} data - { cardId }
     */
    updatePaymentMethod: (id, data) => apiClient.put(`/api/subscriptions/${id}/payment-method`, data),

    /**
     * 쿠폰 변경
     * @param {number} id - 구독 ID
     * @param {Object} data - { couponId }
     */
    updateCoupon: (id, data) => apiClient.put(`/api/subscriptions/${id}/coupon`, data),

    /**
     * 언어 설정 변경
     * @param {number} id - 구독 ID
     * @param {Object} data - { language }
     */
    updateLanguage: (id, data) => apiClient.put(`/api/subscriptions/${id}/language`, data),

    /**
     * 구독 취소
     * @param {number} id - 구독 ID
     */
    cancel: (id) => apiClient.post(`/api/subscriptions/${id}/cancel`),
  },

  // ==================== 활성화 코드 관련 (Product Activations) ====================
  productActivations: {
    /**
     * 사용자별 활성화 코드 목록 조회
     * @param {number} userId - 사용자 ID
     * @param {Object} params - { includeSuspended }
     */
    getByUser: (userId, params = {}) => apiClient.get(`/api/product-activations/users/${userId}`, { params }),

    /**
     * 활성화 코드 재활성화
     * @param {number} id - 활성화 코드 ID
     */
    reactivate: (id) => apiClient.post(`/api/product-activations/${id}/reactivate`),

    /**
     * 활성화 코드 검증
     * @param {string} code - 활성화 코드
     */
    verify: (code) => apiClient.get(`/api/product-activations/verify/${code}`),
  },

  // ==================== 학생 계정 관련 ====================
  studentAccount: {
    /**
     * 학생 인증 신청 (문서 업로드)
     * @param {number} userId - 사용자 ID
     * @param {FormData} formData - multipart/form-data (document 파일 포함)
     */
    verify: (userId, formData) =>
      apiClient.post(`/api/users/${userId}/student-verification`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),

    /**
     * 학생 인증 승인 (관리자용 또는 테스트용)
     * @param {number} userId - 사용자 ID
     */
    approve: (userId) => apiClient.post(`/api/users/${userId}/student-verification/approve`),

    /**
     * 학생 인증 상태 조회
     * @param {number} userId - 사용자 ID
     */
    getStatus: (userId) => apiClient.get(`/api/users/${userId}/student-status`),
  },

  // ==================== Super Admin 관련 ====================
  superAdmin: {
    // 상품 승인 관리
    products: {
      /**
       * 대기 중인 상품 목록 조회
       * @param {Object} params - { page, limit, category, search }
       */
      getPending: (params = {}) => apiClient.get('/api/admin/products/pending', { params }),
      
      /**
       * 상품 승인
       * @param {number} productId - 상품 ID
       */
      approve: (productId) => apiClient.post(`/api/admin/products/${productId}/approve`),
      
      /**
       * 상품 거부
       * @param {number} productId - 상품 ID
       * @param {string} reason - 거부 사유
       */
      reject: (productId, reason) => apiClient.post(`/api/admin/products/${productId}/reject`, { reason }),
      
      /**
       * 상품 상세 정보 (승인 대기용)
       * @param {number} productId - 상품 ID
       */
      getPendingDetail: (productId) => apiClient.get(`/api/admin/products/${productId}/pending-details`),
    },
    
    // 학생 인증 관리
    studentVerifications: {
      /**
       * 대기 중인 학생 인증 목록 조회
       * @param {Object} params - { page, limit, search }
       */
      getPending: (params = {}) => apiClient.get('/api/admin/student-verifications/pending', { params }),
      
      /**
       * 학생 인증 승인
       * @param {number} userId - 사용자 ID
       */
      approve: (userId) => apiClient.post(`/api/admin/users/${userId}/student-verification/approve`),
      
      /**
       * 학생 인증 거부
       * @param {number} userId - 사용자 ID
       * @param {string} reason - 거부 사유
       */
      reject: (userId, reason) => apiClient.post(`/api/admin/users/${userId}/student-verification/reject`, { reason }),
      
      /**
       * 인증 문서 조회
       * @param {number} userId - 사용자 ID
       */
      getDocument: (userId) => apiClient.get(`/api/admin/users/${userId}/verification-document`),
    },
    
    // 판매자 신청 관리
    sellerApplications: {
      /**
       * 신청 목록 조회
       * @param {Object} params - { status }
       */
      getList: (params = {}) => apiClient.get('/api/admin/seller-applications', { params }),
      
      /**
       * 신청 상세 조회
       * @param {number} userId - 사용자 ID
       */
      getDetail: (userId) => apiClient.get(`/api/admin/seller-applications/${userId}`),
      
      /**
       * 승인
       * @param {number} userId - 사용자 ID
       */
      approve: (userId) => apiClient.post(`/api/admin/seller-applications/${userId}/approve`),
      
      /**
       * 반려
       * @param {number} userId - 사용자 ID
       * @param {string} reason - 반려 사유
       */
      reject: (userId, reason) => apiClient.post(`/api/admin/seller-applications/${userId}/reject`, { reason }),
    },
    
    // IP 관리
    ip: {
      /**
       * IP 접속 로그 목록
       * @param {Object} params - { page, limit, ip, country, dateFrom, dateTo, blocked }
       */
      getLogs: (params = {}) => apiClient.get('/api/admin/ip/logs', { params }),
      
      /**
       * 접속 통계
       * @param {Object} params - { period, dateFrom, dateTo }
       */
      getStats: (params = {}) => apiClient.get('/api/admin/ip/logs/stats', { params }),
      
      /**
       * 국가별 통계
       * @param {Object} params - { dateFrom, dateTo }
       */
      getCountryStats: (params = {}) => apiClient.get('/api/admin/ip/logs/stats/countries', { params }),
      
      /**
       * 시간대별 통계
       * @param {Object} params - { dateFrom, dateTo }
       */
      getHourlyStats: (params = {}) => apiClient.get('/api/admin/ip/logs/stats/hourly', { params }),
      
      /**
       * IP 차단
       * @param {Object} data - { ip_address, reason, memo }
       */
      block: (data) => apiClient.post('/api/admin/ip/management/block', data),
      
      /**
       * IP 차단 해제
       * @param {Object} data - { ip_address }
       */
      unblock: (data) => apiClient.post('/api/admin/ip/management/unblock', data),
      
      /**
       * IP 화이트리스트 추가
       * @param {Object} data - { ip_address, memo }
       */
      whitelist: (data) => apiClient.post('/api/admin/ip/management/whitelist', data),
      
      /**
       * IP 관리 목록
       * @param {Object} params - { page, limit, blocked, whitelisted, search }
       */
      getManagement: (params = {}) => apiClient.get('/api/admin/ip/management', { params }),
      
      /**
       * IP 접속 추이 데이터
       * @param {Object} params - { days }
       */
      getAccessTrendData: (params = {}) => apiClient.get('/api/admin/ip/access/trend', { params }),
      
      /**
       * 국가별 접속 분포
       * @param {Object} params - { days }
       */
      getCountryDistribution: (params = {}) => apiClient.get('/api/admin/ip/access/countries', { params }),
      
      /**
       * 시간대별 접속 분포
       * @param {Object} params - { days }
       */
      getHourlyAccessDistribution: (params = {}) => apiClient.get('/api/admin/ip/access/hourly', { params }),
      
      /**
       * TOP 접속 IP 리스트
       * @param {Object} params - { days, limit }
       */
      getTopAccessIPs: (params = {}) => apiClient.get('/api/admin/ip/access/top-ips', { params }),
    },
    
    // 템플릿 관리
    templates: {
      /**
       * 템플릿 목록 조회 (슈퍼 어드민)
       * @param {Object} params - { page, limit, search }
       */
      getList: (params = {}) => apiClient.get('/api/admin/templates', { params }),
      
      /**
       * 템플릿 상세 조회
       * @param {number} id - 템플릿 ID
       */
      getDetail: (id) => apiClient.get(`/api/admin/templates/${id}`),
      
      /**
       * 템플릿 생성
       * @param {Object} data - { name, description, icon_url }
       */
      create: (data) => apiClient.post('/api/admin/templates', data),
      
      /**
       * 템플릿 업데이트
       * @param {number} id - 템플릿 ID
       * @param {Object} data - 업데이트할 정보
       */
      update: (id, data) => apiClient.put(`/api/admin/templates/${id}`, data),
      
      /**
       * 템플릿 삭제
       * @param {number} id - 템플릿 ID
       */
      delete: (id) => apiClient.delete(`/api/admin/templates/${id}`),
      
      /**
       * 템플릿에 상품 추가
       * @param {number} templateId - 템플릿 ID
       * @param {Object} data - { product_id, display_order }
       */
      addProduct: (templateId, data) => apiClient.post(`/api/admin/templates/${templateId}/products`, data),
      
      /**
       * 템플릿에서 상품 제거
       * @param {number} templateId - 템플릿 ID
       * @param {number} productId - 상품 ID
       */
      removeProduct: (templateId, productId) => apiClient.delete(`/api/admin/templates/${templateId}/products/${productId}`),
      
      /**
       * 템플릿 상품 순서 변경
       * @param {number} templateId - 템플릿 ID
       * @param {Array} productOrders - [{ product_id, display_order }]
       */
      updateProductOrder: (templateId, productOrders) => apiClient.put(`/api/admin/templates/${templateId}/products/order`, { productOrders }),
    },
    
    // 보안 관리
    security: {
      /**
       * 보안 이벤트 목록
       * @param {Object} params - { page, limit, type, severity, dateFrom, dateTo, ip }
       */
      getEvents: (params = {}) => apiClient.get('/api/admin/security/events', { params }),
      
      /**
       * 보안 이벤트 통계
       * @param {Object} params - { period, dateFrom, dateTo }
       */
      getEventStats: (params = {}) => apiClient.get('/api/admin/security/events/stats', { params }),
      
      /**
       * 이벤트 유형별 통계
       * @param {Object} params - { dateFrom, dateTo }
       */
      getEventStatsByType: (params = {}) => apiClient.get('/api/admin/security/events/stats/by-type', { params }),
      
      /**
       * 봇 탐지 목록
       * @param {Object} params - { page, limit, blocked, dateFrom, dateTo }
       */
      getBots: (params = {}) => apiClient.get('/api/admin/security/bots', { params }),
      
      /**
       * 봇 차단
       * @param {number} id - 봇 탐지 ID
       * @param {string} reason - 차단 사유
       */
      blockBot: (id, reason) => apiClient.post(`/api/admin/security/bots/${id}/block`, { reason }),
      
      /**
       * 봇 차단 해제
       * @param {number} id - 봇 탐지 ID
       */
      unblockBot: (id) => apiClient.post(`/api/admin/security/bots/${id}/unblock`),
      
      /**
       * IP 수동 차단
       * @param {Object} data - { ip_address, reason, duration_hours }
       */
      blockIP: (data) => apiClient.post('/api/admin/security/block-ip', data),
      
      /**
       * IP 수동 차단 해제
       * @param {Object} data - { ip_address }
       */
      unblockIP: (data) => apiClient.post('/api/admin/security/unblock-ip', data),
      
      /**
       * 보안 설정 조회
       */
      getSettings: () => apiClient.get('/api/admin/security/settings'),
      
      /**
       * 보안 설정 업데이트
       * @param {Object} settings - 설정 객체
       */
      updateSettings: (settings) => apiClient.put('/api/admin/security/settings', settings),
      
      /**
       * 보안 이벤트 추이 데이터
       * @param {Object} params - { days }
       */
      getEventTrendData: (params = {}) => apiClient.get('/api/admin/security/events/trend', { params }),
      
      /**
       * 이벤트 유형별 분포
       * @param {Object} params - { days }
       */
      getEventDistribution: (params = {}) => apiClient.get('/api/admin/security/events/distribution', { params }),
      
      /**
       * 시간대별 이벤트 분포
       * @param {Object} params - { days }
       */
      getHourlyDistribution: (params = {}) => apiClient.get('/api/admin/security/events/hourly', { params }),
      
      /**
       * TOP 공격 IP 리스트
       * @param {Object} params - { days, limit }
       */
      getTopAttackIPs: (params = {}) => apiClient.get('/api/admin/security/events/top-ips', { params }),
    },
  },

  // ==================== 템플릿 관련 (공개) ====================
  templates: {
    /**
     * 공개 템플릿 목록 조회
     * @param {Object} params - { page, limit, search }
     */
    getList: (params = {}) => apiClient.get('/api/templates', { params }),
    
    /**
     * 템플릿 상세 조회 (공개)
     * @param {number} id - 템플릿 ID
     */
    getDetail: (id) => apiClient.get(`/api/templates/${id}`),
    
    /**
     * 상품이 포함된 템플릿 목록 조회
     * @param {number} productId - 상품 ID
     */
    getByProduct: (productId) => apiClient.get(`/api/templates/by-product/${productId}`),
  },

  // ==================== 판매자 신청 관련 ====================
  seller: {
    /**
     * 신청 상태 확인
     */
    getApplicationStatus: () => apiClient.get('/api/seller/application-status'),

    /**
     * 판매자 신청
     * @param {Object} data - 신청 정보
     */
    apply: (data) => apiClient.post('/api/seller/apply', data),
  },

  // ==================== Admin 관련 ====================
  admin: {
    /**
     * Admin 통계 데이터 조회
     */
    getStats: () => apiClient.get('/api/admin/stats'),

    /**
     * Admin의 최근 상품 목록 조회
     * @param {Object} params - { limit }
     */
    getProducts: (params = {}) => apiClient.get('/api/admin/products', { params }),

    /**
     * Admin의 최근 리뷰 목록 조회
     * @param {Object} params - { limit }
     */
    getReviews: (params = {}) => apiClient.get('/api/admin/reviews', { params }),

    /**
     * Admin 상품 삭제
     * @param {number} id - 상품 ID
     */
    deleteProduct: (id) => apiClient.delete(`/api/admin/products/${id}`),

    /**
     * Admin 상품 상세
     * @param {number|string} id - 상품 ID
     */
    getProductDetail: (id) => apiClient.get(`/api/admin/products/${id}`),

    /**
     * Admin 상품 통계
     * @param {number|string} id - 상품 ID
     */
    getProductStats: (id) => apiClient.get(`/api/admin/products/${id}/stats`),

    /**
     * Admin 상품 월별 판매 차트
     * @param {number|string} id - 상품 ID
     */
    getProductSalesChart: (id) => apiClient.get(`/api/admin/products/${id}/sales-chart`),

    /**
     * Admin 상품 리뷰 (최근 N개)
     * @param {number|string} id - 상품 ID
     * @param {Object} params - { limit }
     */
    getProductReviews: (id, params = {}) => apiClient.get(`/api/admin/products/${id}/reviews`, { params }),

    /**
     * Admin 주문 목록 조회
     * @param {Object} params - { page, limit, dateRange, product, status, sort }
     */
    getOrders: (params = {}) => apiClient.get('/api/admin/orders', { params }),

    /**
     * Admin 주문 통계 조회
     */
    getOrderStats: () => apiClient.get('/api/admin/orders/stats'),

    /**
     * Admin 리뷰 목록 조회
     * @param {Object} params - { page, limit, search, product, rating, sort }
     */
    getReviewsList: (params = {}) => apiClient.get('/api/admin/reviews', { params }),

    /**
     * Admin 리뷰 통계 조회
     */
    getReviewsStats: () => apiClient.get('/api/admin/reviews/stats'),

    /**
     * Admin 월별 매출/판매 차트
     */
    getSalesChart: () => apiClient.get('/api/admin/sales-chart'),

    /**
     * Admin 쿠폰 사용량
     */
    getCouponUsage: () => apiClient.get('/api/admin/coupon-usage'),
  },
};

export default api;

