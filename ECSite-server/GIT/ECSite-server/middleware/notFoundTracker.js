const db = require('../db/initializer');
const autoBlockService = require('../services/autoBlockService');
const memoryManager = require('../services/memoryManager');

// IP별 404 카운트
const notFoundLog = new Map();

// 메모리 관리자에 등록 (5분 TTL)
memoryManager.registerStore('notFoundLog', notFoundLog, 300000);

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
      event_type: 'suspicious_activity',
      ip_address: ipAddress,
      request_path: requestPath,
      severity: severity,
      details: details
    });
  } catch (error) {
    console.error('❌ SecurityEvent 로깅 실패:', error);
  }
};

/**
 * 404 에러 추적 미들웨어
 */
exports.trackNotFound = (req, res, next) => {
  const ipAddress = getClientIP(req);
  const now = Date.now();

  // localhost 제외
  if (ipAddress === '::1' || ipAddress === '127.0.0.1' || ipAddress === '::ffff:127.0.0.1' || ipAddress === 'localhost' || ipAddress === 'unknown') {
    return next();
  }

  // 응답 완료 후 404 체크
  const originalSend = res.send;
  const originalJson = res.json;
  const originalEnd = res.end;

  let responseSent = false;

  const check404 = async () => {
    if (responseSent) return;
    responseSent = true;

    if (res.statusCode === 404) {
      try {
        if (!notFoundLog.has(ipAddress)) {
          notFoundLog.set(ipAddress, []);
        }

        const log = notFoundLog.get(ipAddress);

        // 최근 1분 내 404만 유지
        const oneMinuteAgo = now - 60000;
        const recent404s = log.filter(time => time > oneMinuteAgo);

        recent404s.push(now);
        notFoundLog.set(ipAddress, recent404s);

        // 1분에 404가 10번 이상
        if (recent404s.length >= 10) {
          console.warn(`⚠️ 疑わしい活動: ${ipAddress} - ${recent404s.length} 404 errors/min`);

          // 의심스러운 활동 추적
          await autoBlockService.trackSuspiciousActivity(
            ipAddress,
            '404_errors',
            {
              count: recent404s.length,
              path: req.path,
              threshold: 10
            }
          );

          // SecurityEvent 로깅
          await logSecurityEvent(
            ipAddress,
            req.path,
            recent404s.length >= 20 ? 'high' : 'medium',
            {
              type: '404_errors',
              count: recent404s.length,
              window: '1分間'
            }
          );
        }
      } catch (error) {
        console.error('❌ 404 추적 에러:', error);
      }
    }
  };

  // 여러 응답 메서드에 대해 체크
  res.send = function(...args) {
    check404();
    return originalSend.apply(this, args);
  };

  res.json = function(...args) {
    check404();
    return originalJson.apply(this, args);
  };

  res.end = function(...args) {
    check404();
    return originalEnd.apply(this, args);
  };

  next();
};

/**
 * 메모리 정리 (주기적으로 오래된 레코드 삭제)
 */
setInterval(() => {
  const now = Date.now();
  const fiveMinutesAgo = now - 300000;
  let deletedCount = 0;

  for (const [ip, log] of notFoundLog.entries()) {
    const recent = log.filter(time => time > fiveMinutesAgo);
    if (recent.length === 0) {
      notFoundLog.delete(ip);
      deletedCount++;
    } else {
      notFoundLog.set(ip, recent);
    }
  }

  if (deletedCount > 0) {
    console.log(`🧹 404 추적 메모리 정리: ${deletedCount}개 IP 삭제`);
  }
}, 300000); // 5분마다 실행

/**
 * 404 로그 조회 (디버깅용)
 */
exports.getNotFoundLog = (ip) => {
  const log = notFoundLog.get(ip) || [];
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  return log.filter(time => time > oneMinuteAgo);
};

