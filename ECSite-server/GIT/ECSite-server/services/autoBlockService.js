const db = require('../db/initializer');
const ipManagementService = require('../features/security/ipManagementService');
const ipBlockMiddleware = require('../middleware/ipBlockMiddleware');
const memoryManager = require('./memoryManager');

// 설정 캐시 (메모리)
let settingsCache = null;
let cacheTime = null;
const CACHE_TTL = 60000; // 1분

// 기본 설정 (DB에서 로드 실패 시 사용)
const defaultSettings = {
  auto_block_enabled: true,
  bot_detection_threshold: 80,
  max_login_attempts: 5,
  block_duration_hours: 24,
  rate_limit_enabled: true,
  rate_limit_global_requests: 1000,
  rate_limit_api_requests: 100,
  rate_limit_auth_requests: 10,
  rate_limit_window_minutes: 1,
  scraping_detection_threshold: 20,
  scraping_block_threshold: 30,
  notFound_error_threshold: 10,
  suspicious_activity_threshold: 10
};

// DB에서 설정 로드
const loadSettings = async () => {
  try {
    // SecuritySetting 모델이 있는지 확인
    if (!db.SecuritySetting) {
      console.warn('[AutoBlockService] SecuritySetting 모델이 없습니다. 기본 설정을 사용합니다.');
      return defaultSettings;
    }

    const settings = await db.SecuritySetting.findAll();
    const config = { ...defaultSettings };
    
    settings.forEach(setting => {
      let value = setting.setting_value;
      
      // 타입 변환
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (!isNaN(value) && value !== '') value = Number(value);
      
      config[setting.setting_key] = value;
    });
    
    return config;
  } catch (error) {
    console.error('[AutoBlockService] 설정 로드 실패:', error);
    return defaultSettings;
  }
};

/**
 * 보안 설정 조회 (캐시 사용)
 */
exports.getSecuritySettings = async () => {
  const now = Date.now();
  
  // 캐시 확인
  if (settingsCache && cacheTime && now - cacheTime < CACHE_TTL) {
    return settingsCache;
  }
  
  // DB에서 로드
  settingsCache = await loadSettings();
  cacheTime = now;
  
  return settingsCache;
};

/**
 * 보안 설정 조회 (동기, 캐시 사용)
 * 동기 함수가 필요한 경우 사용 (미들웨어 등)
 */
exports.getSecuritySettingsSync = () => {
  if (settingsCache) {
    return settingsCache;
  }
  // 캐시가 없으면 기본 설정 반환
  return defaultSettings;
};

/**
 * 보안 설정 업데이트
 */
exports.updateSecuritySettings = async (newSettings, userId = null) => {
  try {
    // SecuritySetting 모델이 있는지 확인
    if (!db.SecuritySetting) {
      console.warn('[AutoBlockService] SecuritySetting 모델이 없습니다. 메모리만 업데이트합니다.');
      settingsCache = { ...defaultSettings, ...newSettings };
      cacheTime = Date.now();
      return settingsCache;
    }

    for (const [key, value] of Object.entries(newSettings)) {
      await db.SecuritySetting.upsert({
        setting_key: key,
        setting_value: String(value),
        updated_by: userId
      });
    }
    
    // 캐시 무효화
    settingsCache = null;
    cacheTime = null;
    
    // 새 설정 로드
    return await exports.getSecuritySettings();
  } catch (error) {
    console.error('[AutoBlockService] 설정 업데이트 실패:', error);
    // 에러 발생 시 메모리만 업데이트
    settingsCache = { ...defaultSettings, ...newSettings };
    cacheTime = Date.now();
    return settingsCache;
  }
};

/**
 * 자동 IP 차단 로직
 */
exports.autoBlockIP = async (ipAddress, reason, severity = 'medium', details = {}) => {
  const settings = await exports.getSecuritySettings();
  if (!settings.auto_block_enabled) {
    console.log('⚠️ 자동 차단이 비활성화되어 있습니다.');
    return false;
  }

  try {
    if (!db.IpManagement) {
      console.warn('⚠️ IpManagement 모델이 로드되지 않았습니다.');
      return false;
    }

    // 이미 차단되어 있는지 확인
    const existing = await db.IpManagement.findOne({ 
      where: { ip_address: ipAddress } 
    });
    
    if (existing && existing.is_blocked) {
      console.log(`⚠️ ${ipAddress} 는 이미 차단되어 있습니다.`);
      return true;
    }

    // 차단 처리
    await ipManagementService.blockIP(
      ipAddress,
      null, // 자동 차단이므로 blocked_by는 null
      reason,
      `自動ブロック: ${reason}`
    );

    // 캐시 클리어
    ipBlockMiddleware.clearIPCache(ipAddress);

    // SecurityEvent 로깅
    if (db.SecurityEvent) {
      await db.SecurityEvent.create({
        event_type: 'ip_blocked',
        ip_address: ipAddress,
        severity: severity,
        is_blocked: true,
        blocked_at: new Date(),
        details: { ...details, reason, auto: true }
      });
    }

    console.log(`✅ ${ipAddress} 자동 차단: ${reason}`);
    return true;
    
  } catch (error) {
    console.error('❌ 자동 차단 실패:', error);
    return false;
  }
};

// 의심스러운 활동 추적 (IP별 활동 기록)
const suspiciousActivities = new Map();

// 메모리 관리자에 등록 (1시간 TTL)
memoryManager.registerStore('suspiciousActivities', suspiciousActivities, 3600000);

/**
 * 의심스러운 활동 추적
 */
exports.trackSuspiciousActivity = async (ip, activityType, details = {}) => {
  try {
    const settings = await exports.getSecuritySettings();
    const threshold = settings.suspicious_activity_threshold;
    const oneHourAgo = Date.now() - (60 * 60 * 1000); // 1시간 전

    if (!suspiciousActivities.has(ip)) {
      suspiciousActivities.set(ip, []);
    }

    const activities = suspiciousActivities.get(ip);

    // 최근 1시간 내 활동만 유지
    const recentActivities = activities.filter(a => a.timestamp > oneHourAgo);
    recentActivities.push({
      type: activityType,
      timestamp: Date.now(),
      details
    });
    suspiciousActivities.set(ip, recentActivities);

    console.log(`⚠️ 의심스러운 활동 기록: ${ip} (${activityType}) - 총 ${recentActivities.length}회 (임계값: ${threshold}회)`);
    
    // 임계값 초과 시 자동 차단
    if (recentActivities.length >= threshold) {
      console.log(`🚫 의심스러운 활동 ${threshold}회 초과 - 자동 차단: ${ip}`);
      
      await exports.autoBlockIP(
        ip,
        '疑わしい活動が多数検出されました',
        'high',
        { 
          activities: recentActivities,
          activityCount: recentActivities.length,
          window: '1時間'
        }
      );
      
      // SecurityEvent 추가 로깅
      if (db.SecurityEvent) {
        await db.SecurityEvent.create({
          event_type: 'suspicious_activity',
          ip_address: ip,
          severity: 'high',
          details: {
            activityType,
            activityCount: recentActivities.length,
            activities: recentActivities.map(a => a.type)
          }
        });
      }
      
      suspiciousActivities.delete(ip);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ 의심스러운 활동 추적 실패:', error);
    return false;
  }
};

/**
 * 의심스러운 활동 기록 조회 (디버깅용)
 */
exports.getSuspiciousActivities = (ip) => {
  const activities = suspiciousActivities.get(ip) || [];
  const oneHourAgo = Date.now() - (60 * 60 * 1000); // 1시간 전
  return activities.filter(a => a.timestamp > oneHourAgo);
};

/**
 * 모든 의심스러운 활동 조회 (디버깅용)
 */
exports.getAllSuspiciousActivities = () => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000); // 1시간 전
  const result = {};
  
  suspiciousActivities.forEach((activities, ip) => {
    const recentActivities = activities.filter(a => a.timestamp > oneHourAgo);
    if (recentActivities.length > 0) {
      result[ip] = {
        count: recentActivities.length,
        activities: recentActivities
      };
    }
  });
  
  return result;
};

/**
 * 서버 시작 시 초기 설정 로드
 */
(async () => {
  try {
    await exports.getSecuritySettings();
    console.log('✅ [AutoBlockService] 보안 설정 로드 완료');
  } catch (error) {
    console.error('⚠️ [AutoBlockService] 보안 설정 로드 실패, 기본값 사용:', error.message);
  }
})();

