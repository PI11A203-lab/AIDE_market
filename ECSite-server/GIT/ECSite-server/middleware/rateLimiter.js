const db = require('../db/initializer');
const autoBlockService = require('../services/autoBlockService');
const memoryManager = require('../services/memoryManager');

// Rate Limit 저장소 (IP별, 엔드포인트별 요청 카운트)
const rateLimitStore = new Map();

// 메모리 관리자에 등록 (5분 TTL)
memoryManager.registerStore('rateLimitStore', rateLimitStore, 300000);

/**
 * IP 주소 추출 헬퍼 함수
 */
const getClientIP = (req) => {
  return req.headers['cf-connecting-ip'] 
    || req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.ip 
    || req.connection?.remoteAddress
    || req.socket?.remoteAddress
    || 'unknown';
};

/**
 * SecurityEvent 로깅 헬퍼
 */
const logSecurityEvent = async (eventType, ipAddress, requestPath, requestMethod, severity, details = {}) => {
  try {
    if (!db.SecurityEvent) {
      console.warn('⚠️ SecurityEvent 모델이 로드되지 않았습니다.');
      return;
    }

    await db.SecurityEvent.create({
      event_type: eventType,
      ip_address: ipAddress,
      request_path: requestPath,
      user_agent: null, // rate limiter는 user agent를 추적하지 않음
      severity: severity,
      details: details
    });
  } catch (error) {
    console.error('❌ SecurityEvent 로깅 실패:', error);
  }
};

/**
 * Rate Limiting 미들웨어 생성
 * @param {number} maxRequests - 최대 요청 수
 * @param {number} windowMs - 시간 윈도우 (밀리초)
 */
exports.createRateLimiter = (maxRequests = 100, windowMs = 60000) => {
  return async (req, res, next) => {
    try {
      const ipAddress = getClientIP(req);
      // endpoint를 전체 경로로 사용 (baseUrl + path)
      const endpoint = (req.baseUrl || '') + (req.path || '');
      const key = `${ipAddress}:${endpoint}`;
      const now = Date.now();

      // localhost는 제외 (개발 환경 편의)
      if (ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress === '::ffff:127.0.0.1' || ipAddress === 'localhost' || ipAddress === 'unknown' || !ipAddress) {
        return next();
      }

      // 레코드가 없으면 새로 생성
      if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        return next();
      }

      const record = rateLimitStore.get(key);

      // 시간 윈도우 초과 시 리셋
      if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + windowMs;
        return next();
      }

      // 제한 초과
      if (record.count >= maxRequests) {
        console.warn(`⚠️ Rate Limit 초과: ${ipAddress} - ${endpoint} (${record.count}/${maxRequests})`);

        // SecurityEvent 로깅
        await logSecurityEvent(
          'api_abuse',
          ipAddress,
          endpoint,
          req.method,
          'high',
          {
            requestCount: record.count,
            limit: maxRequests,
            windowMs,
            windowSeconds: Math.ceil(windowMs / 1000)
          }
        );

        // 10% 초과 시 자동 차단 (예: 100 제한인데 110번 요청)
        if (record.count >= maxRequests * 1.1) {
          console.log(`🚫 Rate Limit 심각 초과 - 자동 차단: ${ipAddress}`);
          await autoBlockService.autoBlockIP(
            ipAddress,
            `API Rate Limit 超過: ${endpoint}`,
            'high',
            {
              endpoint,
              requestCount: record.count,
              limit: maxRequests,
              windowMs
            }
          );
        }

        const retryAfter = Math.ceil((record.resetTime - now) / 1000);

        return res.status(429).json({
          success: false,
          error: 'リクエストが多すぎます。しばらくしてから再試行してください。',
          retryAfter: retryAfter,
          limit: maxRequests,
          windowSeconds: Math.ceil(windowMs / 1000)
        });
      }

      // 카운트 증가
      record.count++;
      next();
    } catch (error) {
      console.error('❌ Rate Limiter 에러:', error);
      // 에러 발생 시 요청 계속 진행
      next();
    }
  };
};

// 글로벌 Rate Limiter (모든 API) - 1분에 1000개
exports.globalRateLimiter = exports.createRateLimiter(1000, 60000);

// API별 Rate Limiter - 1분에 100개
exports.apiRateLimiter = exports.createRateLimiter(100, 60000);

// 인증 Rate Limiter (더 엄격) - 1분에 10개
exports.authRateLimiter = exports.createRateLimiter(10, 60000);

/**
 * 주기적으로 오래된 레코드 삭제 (메모리 관리)
 */
setInterval(() => {
  const now = Date.now();
  let deletedCount = 0;

  for (const [key, record] of rateLimitStore.entries()) {
    // 5분 후 리셋 시간이 지난 레코드 삭제
    if (now > record.resetTime + 300000) {
      rateLimitStore.delete(key);
      deletedCount++;
    }
  }

  if (deletedCount > 0) {
    console.log(`🧹 Rate Limit 메모리 정리: ${deletedCount}개 레코드 삭제`);
  }
}, 300000); // 5분마다 실행

/**
 * Rate Limit 저장소 상태 조회 (디버깅용)
 */
exports.getRateLimitStatus = () => {
  const now = Date.now();
  const status = {};

  for (const [key, record] of rateLimitStore.entries()) {
    const [ip, endpoint] = key.split(':');
    if (!status[ip]) {
      status[ip] = {};
    }
    status[ip][endpoint] = {
      count: record.count,
      resetTime: new Date(record.resetTime).toISOString(),
      resetIn: Math.max(0, Math.ceil((record.resetTime - now) / 1000))
    };
  }

  return status;
};

