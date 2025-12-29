const securityService = require('./securityService');

/**
 * 보안 이벤트 목록 조회
 */
exports.getSecurityEvents = async (req, res) => {
  try {
    const { page = 1, limit = 50, type, severity, dateFrom, dateTo, ip } = req.query;

    const result = await securityService.getSecurityEvents(
      parseInt(page),
      parseInt(limit),
      { type, severity, dateFrom, dateTo, ip }
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('보안 이벤트 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 보안 이벤트 통계
 */
exports.getSecurityEventStats = async (req, res) => {
  try {
    const { period = 'daily', dateFrom, dateTo } = req.query;

    const stats = await securityService.getSecurityEventStats(period, dateFrom, dateTo);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('보안 이벤트 통계 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 이벤트 유형별 통계
 */
exports.getSecurityEventStatsByType = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const stats = await securityService.getSecurityEventStatsByType(dateFrom, dateTo);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('이벤트 유형별 통계 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 봇 탐지 목록 조회
 */
exports.getBotDetections = async (req, res) => {
  try {
    const { page = 1, limit = 50, blocked, dateFrom, dateTo } = req.query;

    const result = await securityService.getBotDetections(
      parseInt(page),
      parseInt(limit),
      { blocked, dateFrom, dateTo }
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('봇 탐지 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 봇 차단
 */
exports.blockBot = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const blockedBy = req.user.id;

    const bot = await securityService.blockBot(id, blockedBy, reason);

    res.json({
      success: true,
      message: '봇이 차단되었습니다.',
      bot
    });
  } catch (error) {
    console.error('봇 차단 실패:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 봇 차단 해제
 */
exports.unblockBot = async (req, res) => {
  try {
    const { id } = req.params;

    const bot = await securityService.unblockBot(id);

    res.json({
      success: true,
      message: '봇 차단이 해제되었습니다.',
      bot
    });
  } catch (error) {
    console.error('봇 차단 해제 실패:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * IP 수동 차단
 */
exports.blockIPManual = async (req, res) => {
  try {
    const { ip_address, reason, duration_hours } = req.body;
    const blockedBy = req.user.id;

    if (!ip_address) {
      return res.status(400).json({
        success: false,
        error: 'IP 주소가 필요합니다.'
      });
    }

    const result = await securityService.blockIPManual(ip_address, blockedBy, reason, duration_hours);

    res.json({
      success: true,
      message: 'IP가 차단되었습니다.',
      ipManagement: result
    });
  } catch (error) {
    console.error('IP 수동 차단 실패:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * IP 수동 차단 해제
 */
exports.unblockIPManual = async (req, res) => {
  try {
    const { ip_address } = req.body;

    if (!ip_address) {
      return res.status(400).json({
        success: false,
        error: 'IP 주소가 필요합니다.'
      });
    }

    const result = await securityService.unblockIPManual(ip_address);

    res.json({
      success: true,
      message: 'IP 차단이 해제되었습니다.',
      ipManagement: result
    });
  } catch (error) {
    console.error('IP 수동 차단 해제 실패:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 보안 설정 조회
 */
exports.getSecuritySettings = async (req, res) => {
  try {
    const settings = await securityService.getSecuritySettings();

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('보안 설정 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 보안 설정 업데이트
 */
exports.updateSecuritySettings = async (req, res) => {
  try {
    const settings = await securityService.updateSecuritySettings(req.body);

    res.json({
      success: true,
      message: '보안 설정이 업데이트되었습니다.',
      settings
    });
  } catch (error) {
    console.error('보안 설정 업데이트 실패:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

