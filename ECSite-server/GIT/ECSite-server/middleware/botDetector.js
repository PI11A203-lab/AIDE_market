const db = require('../db/initializer');

// 봇 탐지 패턴
const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /scrape/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /java\//i,
  /okhttp/i,
  /go-http-client/i,
  /axios/i,
  /node-fetch/i,
  /postman/i,
  /insomnia/i,
  /httpie/i,
  /scrapy/i,
  /beautifulsoup/i
];

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
 * 봇 탐지 로직
 */
exports.detectBot = (userAgent) => {
  if (!userAgent) {
    return { 
      isBot: true, 
      reason: 'User-Agent が空です', 
      confidence: 90 
    };
  }

  // 알려진 봇 패턴 매칭
  for (const pattern of BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return { 
        isBot: true, 
        reason: `ボットパターン一致: ${pattern.toString()}`,
        confidence: 85 
      };
    }
  }

  // User-Agent가 너무 짧음 (비정상)
  if (userAgent.length < 20) {
    return { 
      isBot: true, 
      reason: 'User-Agent が異常に短い',
      confidence: 70 
    };
  }

  // 일반 브라우저가 아님 (Mozilla, Chrome, Safari 등이 없음)
  const hasBrowser = userAgent.includes('Mozilla') || 
                     userAgent.includes('Chrome') || 
                     userAgent.includes('Safari') ||
                     userAgent.includes('Firefox') ||
                     userAgent.includes('Edge') ||
                     userAgent.includes('Opera');
  
  if (!hasBrowser) {
    return {
      isBot: true,
      reason: '一般的なブラウザではありません',
      confidence: 60
    };
  }

  return { isBot: false, reason: null, confidence: 0 };
};

/**
 * BotDetection 테이블에 기록
 */
const logBotDetection = async (ipAddress, userAgent, detection) => {
  try {
    if (!db.BotDetection) {
      console.warn('⚠️ BotDetection 모델이 로드되지 않았습니다.');
      return null;
    }

    const botDetection = await db.BotDetection.create({
      ip_address: ipAddress,
      user_agent: userAgent,
      detection_reason: detection.reason,
      confidence_score: detection.confidence,
      is_blocked: detection.confidence >= 90 // 90% 이상이면 즉시 차단
    });

    console.log(`🤖 봇 탐지 기록: ${ipAddress} (신뢰도: ${detection.confidence}%) - ${detection.reason}`);
    return botDetection;
  } catch (error) {
    console.error('❌ BotDetection 로깅 실패:', error);
    return null;
  }
};

/**
 * SecurityEvent 로깅
 */
const logSecurityEvent = async (ipAddress, userAgent, detection) => {
  try {
    if (!db.SecurityEvent) {
      console.warn('⚠️ SecurityEvent 모델이 로드되지 않았습니다.');
      return;
    }

    await db.SecurityEvent.create({
      event_type: 'bot_detected',
      ip_address: ipAddress,
      user_agent: userAgent,
      severity: detection.confidence >= 90 ? 'high' : detection.confidence >= 70 ? 'medium' : 'low',
      details: { 
        reason: detection.reason, 
        confidence: detection.confidence,
        is_blocked: detection.confidence >= 90
      }
    });
  } catch (error) {
    console.error('❌ SecurityEvent 로깅 실패:', error);
  }
};

/**
 * IP 자동 차단
 */
const autoBlockIP = async (ipAddress, reason) => {
  try {
    const ipManagementService = require('../features/security/ipManagementService');
    
    await ipManagementService.blockIP(
      ipAddress,
      null, // 자동 차단이므로 blocked_by는 null
      reason,
      `自動ボット検出: ${reason}`
    );

    // 캐시 클리어 (차단 상태 업데이트 반영)
    const ipBlockMiddleware = require('./ipBlockMiddleware');
    ipBlockMiddleware.clearIPCache(ipAddress);

    console.log(`✅ 봇 자동 차단: ${ipAddress} - ${reason}`);
    return true;
  } catch (error) {
    console.error('❌ 봇 자동 차단 실패:', error);
    return false;
  }
};

/**
 * 봇 탐지 미들웨어
 */
exports.botCheckMiddleware = async (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = getClientIP(req);

    // localhost는 체크 생략
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress === 'localhost' || ipAddress === 'unknown') {
      return next();
    }

    // 봇 탐지
    const detection = exports.detectBot(userAgent);

    // 봇으로 탐지되고 신뢰도 80% 이상인 경우
    if (detection.isBot && detection.confidence >= 80) {
      console.log(`🤖 봇 탐지: ${ipAddress} (신뢰도: ${detection.confidence}%) - ${detection.reason}`);

      // BotDetection 테이블에 기록
      await logBotDetection(ipAddress, userAgent, detection);

      // SecurityEvent 로깅
      await logSecurityEvent(ipAddress, userAgent, detection);

      // 신뢰도 90% 이상이면 즉시 차단
      if (detection.confidence >= 90) {
        await autoBlockIP(ipAddress, detection.reason);

        return res.status(403).json({ 
          success: false,
          error: 'アクセスが拒否されました。ボットと判断されました。',
          message: 'このアクセスはボットとして検出されました。'
        });
      }

      // 80-89%는 기록만 하고 진행 (향후 통계에서 활용)
    }

    // 봇이 아니거나 신뢰도가 낮은 경우 다음 미들웨어로 진행
    next();
  } catch (error) {
    console.error('❌ 봇 탐지 미들웨어 에러:', error);
    // 에러 발생 시 요청 계속 진행
    next();
  }
};

