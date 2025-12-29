const db = require('../db/initializer');
const autoBlockService = require('../services/autoBlockService');
const memoryManager = require('../services/memoryManager');

// IP별 페이지 접근 기록
const pageAccessLog = new Map();

// 메모리 관리자에 등록 (5분 TTL)
memoryManager.registerStore('pageAccessLog', pageAccessLog, 300000);

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
const logSecurityEvent = async (ipAddress, requestPath, severity, details = {}) => {
  try {
    if (!db.SecurityEvent) {
      console.warn('⚠️ SecurityEvent 모델이 로드되지 않았습니다.');
      return;
    }

    await db.SecurityEvent.create({
      event_type: 'scraping',
      ip_address: ipAddress,
      request_path: requestPath,
      user_agent: null,
      severity: severity,
      details: details
    });
  } catch (error) {
    console.error('❌ SecurityEvent 로깅 실패:', error);
  }
};

/**
 * 스크래핑 패턴 감지 미들웨어
 */
exports.detectScraping = async (req, res, next) => {
  try {
    const ipAddress = getClientIP(req);
    const path = req.path;
    const now = Date.now();

    // localhost 제외
    if (ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress === '::ffff:127.0.0.1' || ipAddress === 'localhost' || ipAddress === 'unknown') {
      return next();
    }

    // 상품 페이지만 추적
    if (!path.startsWith('/api/products/') && !path.startsWith('/products/')) {
      return next();
    }

    // 상품 목록 페이지는 제외 (특정 상품 페이지만 추적)
    if (path === '/api/products' || path === '/products') {
      return next();
    }

    if (!pageAccessLog.has(ipAddress)) {
      pageAccessLog.set(ipAddress, []);
    }

    const accessLog = pageAccessLog.get(ipAddress);

    // 최근 1분 내 접근 기록만 유지
    const oneMinuteAgo = now - 60000;
    const recentAccess = accessLog.filter(log => log.timestamp > oneMinuteAgo);

    recentAccess.push({
      path,
      timestamp: now
    });

    pageAccessLog.set(ipAddress, recentAccess);

    // 1분에 상품 페이지 20개 이상 접근 = 스크래핑 의심
    if (recentAccess.length >= 20) {
      console.warn(`⚠️ 스크래핑 의심: ${ipAddress} - ${recentAccess.length} pages/min`);

      // SecurityEvent 로깅
      await logSecurityEvent(
        ipAddress,
        path,
        recentAccess.length >= 30 ? 'high' : 'medium',
        {
          accessCount: recentAccess.length,
          pages: recentAccess.slice(-10).map(a => a.path) // 최근 10개만 저장
        }
      );

      // 30개 이상이면 자동 차단
      if (recentAccess.length >= 30) {
        console.log(`🚫 스크래핑 자동 차단: ${ipAddress} - ${recentAccess.length} pages/min`);

        await autoBlockService.autoBlockIP(
          ipAddress,
          'スクレイピング検出: 短時間に多数のページアクセス',
          'high',
          {
            accessCount: recentAccess.length,
            detectionTime: new Date().toISOString()
          }
        );

        return res.status(403).json({
          success: false,
          error: 'アクセスが拒否されました。'
        });
      }

      // 20-29개는 경고만 (의심스러운 활동 추적)
      if (recentAccess.length === 20) {
        await autoBlockService.trackSuspiciousActivity(
          ipAddress,
          'scraping_suspicion',
          {
            accessCount: recentAccess.length,
            threshold: 30
          }
        );
      }
    }

    next();
  } catch (error) {
    console.error('❌ 스크래핑 탐지 미들웨어 에러:', error);
    // 에러 발생 시 요청 계속 진행
    next();
  }
};

/**
 * 메모리 정리 (주기적으로 오래된 레코드 삭제)
 */
setInterval(() => {
  const now = Date.now();
  const fiveMinutesAgo = now - 300000;
  let deletedCount = 0;

  for (const [ip, accessLog] of pageAccessLog.entries()) {
    const recentAccess = accessLog.filter(log => log.timestamp > fiveMinutesAgo);
    if (recentAccess.length === 0) {
      pageAccessLog.delete(ip);
      deletedCount++;
    } else {
      pageAccessLog.set(ip, recentAccess);
    }
  }

  if (deletedCount > 0) {
    console.log(`🧹 스크래핑 탐지 메모리 정리: ${deletedCount}개 IP 삭제`);
  }
}, 300000); // 5분마다 실행

/**
 * 접근 로그 조회 (디버깅용)
 */
exports.getAccessLog = (ip) => {
  const accessLog = pageAccessLog.get(ip) || [];
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  return accessLog.filter(log => log.timestamp > oneMinuteAgo);
};

