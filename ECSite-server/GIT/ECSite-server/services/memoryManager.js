/**
 * 메모리 관리 서비스
 * 
 * 현재 메모리에 저장되는 데이터:
 * - loginAttemptTracker: 로그인 시도 기록
 * - rateLimiter: Rate Limit 카운터
 * - scrapingDetector: 스크래핑 탐지
 * - notFoundTracker: 404 에러 추적
 * - ipBlockMiddleware: IP 차단 캐시
 * - geolocationService: 위치 정보 캐시
 * - autoBlockService: 의심스러운 활동 추적
 */

class MemoryManager {
  constructor() {
    this.stores = new Map();
    this.startCleanupScheduler();
  }

  /**
   * 스토어 등록
   */
  registerStore(name, store, ttl = 3600000) {
    this.stores.set(name, { store, ttl });
    console.log(`✅ Memory store registered: ${name} (TTL: ${ttl}ms)`);
  }

  /**
   * 스토어 정리
   */
  cleanStore(name) {
    const storeData = this.stores.get(name);
    if (!storeData) return 0;

    const { store, ttl } = storeData;
    const now = Date.now();
    let cleaned = 0;

    if (store instanceof Map) {
      for (const [key, value] of store.entries()) {
        // 타임스탬프 기반 정리
        if (value.timestamp && now - value.timestamp > ttl) {
          store.delete(key);
          cleaned++;
        }
        // resetTime 기반 정리
        else if (value.resetTime && now > value.resetTime + ttl) {
          store.delete(key);
          cleaned++;
        }
        // 배열인 경우 (시간 기록)
        else if (Array.isArray(value)) {
          const filtered = value.filter(item => {
            if (typeof item === 'number') return now - item < ttl;
            if (item.timestamp) return now - item.timestamp < ttl;
            return true;
          });
          if (filtered.length === 0) {
            store.delete(key);
            cleaned++;
          } else if (filtered.length !== value.length) {
            store.set(key, filtered);
          }
        }
      }
    }

    return cleaned;
  }

  /**
   * 모든 스토어 정리
   */
  cleanAllStores() {
    let totalCleaned = 0;
    for (const [name, _] of this.stores) {
      const cleaned = this.cleanStore(name);
      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} entries from ${name}`);
        totalCleaned += cleaned;
      }
    }
    if (totalCleaned > 0) {
      console.log(`✅ Total cleaned: ${totalCleaned} entries`);
    }
    return totalCleaned;
  }

  /**
   * 메모리 사용량 확인
   */
  getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB',
      external: Math.round(usage.external / 1024 / 1024) + ' MB'
    };
  }

  /**
   * 스토어 크기 확인
   */
  getStoreSize(name) {
    const storeData = this.stores.get(name);
    if (!storeData) return 0;
    
    const { store } = storeData;
    if (store instanceof Map) return store.size;
    return 0;
  }

  /**
   * 모든 스토어 크기 확인
   */
  getAllStoreSizes() {
    const sizes = {};
    for (const [name, _] of this.stores) {
      sizes[name] = this.getStoreSize(name);
    }
    return sizes;
  }

  /**
   * 정리 스케줄러 시작
   */
  startCleanupScheduler() {
    // 5분마다 메모리 정리
    setInterval(() => {
      console.log('🔄 Running memory cleanup...');
      this.cleanAllStores();
      
      const memoryUsage = this.getMemoryUsage();
      const storeSizes = this.getAllStoreSizes();
      
      console.log('📊 Memory usage:', memoryUsage);
      console.log('📊 Store sizes:', storeSizes);
    }, 300000); // 5분

    console.log('✅ Memory cleanup scheduler started (every 5 minutes)');
  }

  /**
   * 수동 메모리 정리 (강제)
   */
  forceCleanup() {
    console.log('⚠️ Force cleanup triggered');
    return this.cleanAllStores();
  }
}

// 싱글톤 인스턴스
const memoryManager = new MemoryManager();

module.exports = memoryManager;

