const db = require('../db/initializer');
const memoryManager = require('../services/memoryManager');

// IP별 로그인 시도 추적 (메모리 저장)
const loginAttempts = new Map();

// 메모리 관리자에 등록 (30분 TTL)
memoryManager.registerStore('loginAttempts', loginAttempts, 1800000);

// 로그인 시도 초기화 시간 (30분)
const BLOCK_DURATION_MS = 30 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

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
const logSecurityEvent = async (eventType, ipAddress, severity, details = {}) => {
  try {
    if (!db.SecurityEvent) {
      console.warn('⚠️ SecurityEvent 모델이 로드되지 않았습니다.');
      return;
    }

    await db.SecurityEvent.create({
      event_type: eventType,
      ip_address: ipAddress,
      severity: severity,
      details: details,
      is_blocked: eventType === 'ip_blocked'
    });
  } catch (error) {
    console.error('❌ SecurityEvent 로깅 실패:', error);
  }
};

/**
 * IP 자동 차단 (ipManagementService 사용)
 */
const autoBlockIP = async (ipAddress, reason) => {
  try {
    const ipManagementService = require('../features/security/ipManagementService');
    
    await ipManagementService.blockIP(
      ipAddress,
      null, // 자동 차단이므로 blocked_by는 null
      reason,
      'ログイン失敗5回超過による自動ブロック'
    );

    // 캐시 클리어 (차단 상태 업데이트 반영)
    const ipBlockMiddleware = require('./ipBlockMiddleware');
    ipBlockMiddleware.clearIPCache(ipAddress);

    console.log(`✅ IP 자동 차단: ${ipAddress} - ${reason}`);
    return true;
  } catch (error) {
    console.error('❌ IP 자동 차단 실패:', error);
    return false;
  }
};

/**
 * 로그인 시도 확인 미들웨어
 * 차단된 IP는 로그인을 시도할 수 없도록 차단
 */
exports.checkLoginAttempts = async (req, res, next) => {
  try {
    const ipAddress = getClientIP(req);

    // localhost는 체크 생략
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress === 'localhost' || ipAddress === 'unknown') {
      return next();
    }

    const attempts = loginAttempts.get(ipAddress) || { count: 0, blockedUntil: null };

    // 차단 시간 확인
    if (attempts.blockedUntil && Date.now() < attempts.blockedUntil) {
      const remainingMinutes = Math.ceil((attempts.blockedUntil - Date.now()) / 60000);
      
      console.log(`🚫 로그인 차단된 IP 접근 시도: ${ipAddress} (남은 시간: ${remainingMinutes}분)`);

      // SecurityEvent 로깅
      await logSecurityEvent('login_failed', ipAddress, 'high', {
        blocked: true,
        remainingMinutes,
        attemptCount: attempts.count
      });

      return res.status(429).json({
        success: false,
        error: `ログイン試行回数を超過しました。${remainingMinutes}分後に再試行してください。`
      });
    }

    // 5회 실패 시 30분 차단 및 자동 IP 차단
    if (attempts.count >= MAX_LOGIN_ATTEMPTS && !attempts.blockedUntil) {
      attempts.blockedUntil = Date.now() + BLOCK_DURATION_MS;
      loginAttempts.set(ipAddress, attempts);
      
      console.log(`🚫 로그인 5회 실패 - IP 차단: ${ipAddress}`);

      // 자동 IP 차단
      await autoBlockIP(ipAddress, 'ログイン失敗5回超過による自動ブロック');

      // SecurityEvent 로깅
      await logSecurityEvent('ip_blocked', ipAddress, 'high', {
        reason: 'login_failures',
        attemptCount: attempts.count,
        blocked_at: new Date()
      });

      return res.status(429).json({
        success: false,
        error: 'ログイン試行回数を超過しました。30分後に再試行してください。'
      });
    }

    // 로그인 시도 정보를 req에 추가
    req.loginAttempts = attempts;
    next();
  } catch (error) {
    console.error('❌ 로그인 시도 확인 미들웨어 에러:', error);
    // 에러 발생 시 요청 계속 진행
    next();
  }
};

/**
 * 로그인 실패 기록
 */
exports.recordLoginFailure = async (ipAddress) => {
  try {
    const attempts = loginAttempts.get(ipAddress) || { count: 0, blockedUntil: null };
    attempts.count++;
    loginAttempts.set(ipAddress, attempts);

    console.log(`⚠️ 로그인 실패 기록: ${ipAddress} (${attempts.count}/${MAX_LOGIN_ATTEMPTS}회)`);

    // SecurityEvent 로깅
    const severity = attempts.count >= 3 ? 'high' : 'medium';
    await logSecurityEvent('login_failed', ipAddress, severity, {
      attemptCount: attempts.count,
      remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.count
    });

    // 5회 도달 시 차단 설정
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      attempts.blockedUntil = Date.now() + BLOCK_DURATION_MS;
      loginAttempts.set(ipAddress, attempts);

      // 자동 IP 차단
      await autoBlockIP(ipAddress, 'ログイン失敗5回超過による自動ブロック');

      // SecurityEvent 로깅
      await logSecurityEvent('ip_blocked', ipAddress, 'high', {
        reason: 'login_failures',
        attemptCount: attempts.count,
        blocked_at: new Date()
      });
    }

    return attempts.count;
  } catch (error) {
    console.error('❌ 로그인 실패 기록 실패:', error);
    return 0;
  }
};

/**
 * 로그인 성공 시 시도 횟수 리셋
 */
exports.resetLoginAttempts = (ipAddress) => {
  if (loginAttempts.has(ipAddress)) {
    loginAttempts.delete(ipAddress);
    console.log(`✅ 로그인 성공 - 시도 횟수 리셋: ${ipAddress}`);
  }
};

/**
 * 모든 로그인 시도 정보 조회 (디버깅용)
 */
exports.getLoginAttempts = () => {
  return Array.from(loginAttempts.entries()).map(([ip, data]) => ({
    ip,
    count: data.count,
    blockedUntil: data.blockedUntil,
    isBlocked: data.blockedUntil && Date.now() < data.blockedUntil
  }));
};

