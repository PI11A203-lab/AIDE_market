const axios = require('axios');
const memoryManager = require('./memoryManager');

/**
 * IP Geolocation 서비스
 * 무료 API: ip-api.com (하루 45개 요청 제한, 상업용 사용 금지)
 * 프로덕션에서는 유료 서비스 사용 권장: MaxMind, ipinfo.io 등
 */

// 캐시 (메모리)
const locationCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간

// 메모리 관리자에 등록 (24시간 TTL)
memoryManager.registerStore('locationCache', locationCache, 86400000);

/**
 * IP 위치 정보 조회
 */
exports.getLocation = async (ipAddress) => {
  // localhost는 제외
  if (!ipAddress || ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress === '::ffff:127.0.0.1' || ipAddress === 'localhost' || ipAddress === 'unknown') {
    return { country: null, city: null };
  }

  // 캐시 확인
  if (locationCache.has(ipAddress)) {
    const cached = locationCache.get(ipAddress);
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    locationCache.delete(ipAddress);
  }

  try {
    // ip-api.com 무료 API 사용
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}?fields=status,country,city`, {
      timeout: 5000
    });

    if (response.data.status === 'success') {
      const location = {
        country: response.data.country,
        city: response.data.city
      };

      // 캐시에 저장
      locationCache.set(ipAddress, {
        data: location,
        timestamp: Date.now()
      });

      return location;
    }
  } catch (error) {
    console.error(`Geolocation API 失敗: ${ipAddress}`, error.message);
  }

  return { country: null, city: null };
};

/**
 * 일괄 처리 (여러 IP의 위치 정보 한 번에 조회)
 */
exports.getBatchLocations = async (ipAddresses) => {
  const results = {};

  for (const ip of ipAddresses) {
    results[ip] = await exports.getLocation(ip);

    // API Rate Limit 방지 (초당 최대 45개 요청)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
};

// 주기적으로 캐시 정리
setInterval(() => {
  const now = Date.now();
  let deletedCount = 0;
  for (const [ip, data] of locationCache.entries()) {
    if (now - data.timestamp > CACHE_TTL) {
      locationCache.delete(ip);
      deletedCount++;
    }
  }
  if (deletedCount > 0) {
    console.log(`🧹 Geolocation 캐시 정리: ${deletedCount}개 IP 삭제`);
  }
}, CACHE_TTL);

