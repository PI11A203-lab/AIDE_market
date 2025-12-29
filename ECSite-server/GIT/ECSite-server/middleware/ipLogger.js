const db = require('../db/initializer');

/**
 * IP 접속 로그 기록 미들웨어
 */
exports.logIpAccess = async (req, res, next) => {
  try {
    // IP 주소 추출 (프록시 고려)
    const ipAddress = req.headers['cf-connecting-ip'] 
                   || req.headers['x-forwarded-for']?.split(',')[0]?.trim()
                   || req.ip 
                   || req.connection?.remoteAddress
                   || req.socket?.remoteAddress
                   || 'unknown';

    // 비동기로 로그 저장 (요청 흐름 방해하지 않음)
    setImmediate(async () => {
      try {
        // IpAccessLog 모델이 로드되었는지 확인
        if (!db.IpAccessLog) {
          console.warn('IpAccessLog 모델이 로드되지 않았습니다.');
          return;
        }

        await db.IpAccessLog.create({
          ip_address: ipAddress,
          user_id: req.user?.id || null,
          request_path: req.path,
          request_method: req.method,
          user_agent: req.headers['user-agent'] || null
        });
      } catch (error) {
        // 로깅 실패해도 무시 (비즈니스 로직에 영향 없음)
        console.error('IP 로그 저장 실패:', error);
      }
    });

    next();
  } catch (error) {
    // 에러 발생해도 요청 계속 진행
    console.error('IP 로깅 미들웨어 에러:', error);
    next();
  }
};

