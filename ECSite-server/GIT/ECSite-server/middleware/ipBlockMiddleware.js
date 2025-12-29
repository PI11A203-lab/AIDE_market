const db = require('../db/initializer');
const memoryManager = require('../services/memoryManager');

// IP 차단 상태 캐시 (성능 향상)
const ipBlockCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5분 캐시

// 메모리 관리자에 등록 (5분 TTL)
memoryManager.registerStore('ipBlockCache', ipBlockCache, 300000);

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
 * IP 차단 상태 확인 (캐시 포함)
 */
const checkIPBlockStatus = async (ipAddress) => {
  // 캐시 확인
  const cached = ipBlockCache.get(ipAddress);
  if (cached) {
    if (Date.now() < cached.expiresAt) {
      return cached.data;
    } else {
      // 캐시 만료
      ipBlockCache.delete(ipAddress);
    }
  }

  try {
    if (!db.IpManagement) {
      console.warn('⚠️ IpManagement 모델이 로드되지 않았습니다.');
      return { isBlocked: false, isWhitelisted: false };
    }

    // DB에서 IP 상태 확인
    const ipManagement = await db.IpManagement.findOne({
      where: { ip_address: ipAddress }
    });

    const result = {
      isBlocked: ipManagement?.is_blocked || false,
      isWhitelisted: ipManagement?.is_whitelisted || false,
      blockReason: ipManagement?.block_reason || null
    };

    // 캐시에 저장
    ipBlockCache.set(ipAddress, {
      data: result,
      expiresAt: Date.now() + CACHE_TTL
    });

    return result;
  } catch (error) {
    console.error('❌ IP 차단 상태 확인 실패:', error);
    // 에러 발생 시 차단하지 않음 (기본값: 허용)
    return { isBlocked: false, isWhitelisted: false };
  }
};

/**
 * SecurityEvent 로깅
 */
const logSecurityEvent = async (ipAddress, req, blockReason) => {
  try {
    if (!db.SecurityEvent) {
      console.warn('⚠️ SecurityEvent 모델이 로드되지 않았습니다.');
      return;
    }

    await db.SecurityEvent.create({
      event_type: 'ip_blocked',
      ip_address: ipAddress,
      request_path: req.path,
      user_agent: req.headers['user-agent'] || null,
      severity: 'high',
      is_blocked: true,
      blocked_at: new Date(),
      details: {
        block_reason: blockReason,
        method: req.method,
        attempted_access: true
      }
    });
  } catch (error) {
    console.error('❌ SecurityEvent 로깅 실패:', error);
  }
};

/**
 * 캐시 클리어 (IP 차단/해제 시 사용)
 */
exports.clearIPCache = (ipAddress) => {
  ipBlockCache.delete(ipAddress);
  console.log(`✅ IP 캐시 클리어: ${ipAddress}`);
};

/**
 * IP 차단 확인 미들웨어
 */
exports.checkIPBlock = async (req, res, next) => {
  try {
    const ipAddress = getClientIP(req);

    // localhost는 항상 허용 (개발 환경)
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress === 'localhost' || ipAddress === 'unknown') {
      return next();
    }

    // IP 차단 상태 확인
    const { isBlocked, isWhitelisted, blockReason } = await checkIPBlockStatus(ipAddress);

    // 화이트리스트 확인 (최우선)
    if (isWhitelisted) {
      console.log(`✅ 화이트리스트 IP 허용: ${ipAddress}`);
      return next();
    }

    // 차단된 IP인 경우
    if (isBlocked) {
      console.log(`🚫 차단된 IP 접근 시도: ${ipAddress} - ${blockReason}`);

      // SecurityEvent 로깅
      await logSecurityEvent(ipAddress, req, blockReason);

      // 403 응답
      return res.status(403).json({
        success: false,
        error: 'アクセスが拒否されました',
        message: 'このIPアドレスはブロックされています。'
      });
    }

    // 차단되지 않은 경우 다음 미들웨어로 진행
    next();
  } catch (error) {
    // 에러 발생 시 로그만 남기고 요청은 계속 진행
    console.error('❌ IP 차단 미들웨어 에러:', error);
    next();
  }
};

