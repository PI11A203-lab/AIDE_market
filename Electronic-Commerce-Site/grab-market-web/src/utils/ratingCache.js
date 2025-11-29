/**
 * 상품 별점 캐싱 유틸리티
 * localStorage를 사용하여 상품별 별점 정보를 캐싱하고 관리합니다.
 */

const CACHE_KEY_PREFIX = 'product_rating_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24시간

/**
 * 상품별 별점 캐시 가져오기
 * @param {number} productId - 상품 ID
 * @returns {Object|null} { rating_average, rating_count, updatedAt } 또는 null
 */
export const getRatingCache = (productId) => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${productId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const now = Date.now();
    
    // 캐시 만료 확인
    if (now - data.updatedAt > CACHE_EXPIRY_MS) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get rating cache:', error);
    return null;
  }
};

/**
 * 상품별 별점 캐시 저장/갱신
 * @param {number} productId - 상품 ID
 * @param {number} ratingAverage - 평균 별점 (0-5)
 * @param {number} ratingCount - 리뷰 개수
 */
export const setRatingCache = (productId, ratingAverage, ratingCount) => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${productId}`;
    const data = {
      rating_average: parseFloat(ratingAverage) || 0,
      rating_count: parseInt(ratingCount) || 0,
      updatedAt: Date.now()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to set rating cache:', error);
  }
};

/**
 * 상품별 별점 캐시 삭제
 * @param {number} productId - 상품 ID
 */
export const clearRatingCache = (productId) => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${productId}`;
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('Failed to clear rating cache:', error);
  }
};

/**
 * 모든 별점 캐시 삭제
 */
export const clearAllRatingCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear all rating cache:', error);
  }
};

/**
 * 별점을 퍼센테이지로 변환 (0-100)
 * @param {number} rating - 별점 (0-5)
 * @returns {number} 퍼센테이지 (0-100)
 */
export const ratingToPercentage = (rating) => {
  const numRating = parseFloat(rating) || 0;
  return Math.min(100, Math.max(0, (numRating / 5.0) * 100));
};

/**
 * 퍼센테이지를 별점으로 변환 (0-5)
 * @param {number} percentage - 퍼센테이지 (0-100)
 * @returns {number} 별점 (0-5)
 */
export const percentageToRating = (percentage) => {
  const numPercentage = parseFloat(percentage) || 0;
  return Math.min(5, Math.max(0, (numPercentage / 100) * 5));
};

/**
 * 별점에 따라 채워진 별 개수 계산
 * @param {number} rating - 별점 (0-5)
 * @returns {number} 채워진 별 개수 (0-5)
 */
export const getFilledStars = (rating) => {
  const numRating = parseFloat(rating) || 0;
  return Math.min(5, Math.max(0, Math.round(numRating)));
};

