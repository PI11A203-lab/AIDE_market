const ipManagementService = require('./ipManagementService');

/**
 * 접속 로그 목록 조회
 */
exports.getIPLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, ip, country, dateFrom, dateTo, blocked } = req.query;

    const result = await ipManagementService.getIPLogs(
      parseInt(page),
      parseInt(limit),
      { ip, country, dateFrom, dateTo, blocked }
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('IP 로그 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 접속 통계
 */
exports.getIPStats = async (req, res) => {
  try {
    const { period = 'daily', dateFrom, dateTo } = req.query;

    const stats = await ipManagementService.getIPStats(period, dateFrom, dateTo);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('IP 통계 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 국가별 통계
 */
exports.getIPCountryStats = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const stats = await ipManagementService.getIPCountryStats(dateFrom, dateTo);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('국가별 통계 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 시간대별 통계
 */
exports.getIPHourlyStats = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const stats = await ipManagementService.getIPHourlyStats(dateFrom, dateTo);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('시간대별 통계 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * IP 차단
 */
exports.blockIP = async (req, res) => {
  try {
    const { ip_address, reason, memo } = req.body;
    const blockedBy = req.user.id;

    if (!ip_address) {
      return res.status(400).json({
        success: false,
        error: 'IP 주소가 필요합니다.'
      });
    }

    const ipManagement = await ipManagementService.blockIP(ip_address, blockedBy, reason, memo);

    res.json({
      success: true,
      message: 'IP가 차단되었습니다.',
      ipManagement
    });
  } catch (error) {
    console.error('IP 차단 실패:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * IP 차단 해제
 */
exports.unblockIP = async (req, res) => {
  try {
    const { ip_address } = req.body;

    if (!ip_address) {
      return res.status(400).json({
        success: false,
        error: 'IP 주소가 필요합니다.'
      });
    }

    const ipManagement = await ipManagementService.unblockIP(ip_address);

    res.json({
      success: true,
      message: 'IP 차단이 해제되었습니다.',
      ipManagement
    });
  } catch (error) {
    console.error('IP 차단 해제 실패:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * IP 화이트리스트 추가
 */
exports.whitelistIP = async (req, res) => {
  try {
    const { ip_address, memo } = req.body;

    if (!ip_address) {
      return res.status(400).json({
        success: false,
        error: 'IP 주소가 필요합니다.'
      });
    }

    const ipManagement = await ipManagementService.whitelistIP(ip_address, memo);

    res.json({
      success: true,
      message: 'IP가 화이트리스트에 추가되었습니다.',
      ipManagement
    });
  } catch (error) {
    console.error('IP 화이트리스트 추가 실패:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * IP 관리 목록 조회
 */
exports.getIPManagement = async (req, res) => {
  try {
    const { page = 1, limit = 50, blocked, whitelisted, search } = req.query;

    const result = await ipManagementService.getIPManagement(
      parseInt(page),
      parseInt(limit),
      { blocked, whitelisted, search }
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('IP 관리 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * 접속 추이 데이터
 */
exports.getAccessTrendData = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const data = await ipManagementService.getAccessTrendData(parseInt(days));
    res.json({ success: true, data });
  } catch (error) {
    console.error('접속 추이 조회 실패:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 국가별 접속 분포
 */
exports.getCountryDistribution = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const data = await ipManagementService.getCountryDistribution(parseInt(days));
    res.json({ success: true, data });
  } catch (error) {
    console.error('국가별 분포 조회 실패:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 시간대별 접속 분포
 */
exports.getHourlyAccessDistribution = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const data = await ipManagementService.getHourlyAccessDistribution(parseInt(days));
    res.json({ success: true, data });
  } catch (error) {
    console.error('시간대별 접속 분포 조회 실패:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * TOP 접속 IP 리스트
 */
exports.getTopAccessIPs = async (req, res) => {
  try {
    const { days = 7, limit = 10 } = req.query;
    const data = await ipManagementService.getTopAccessIPs(parseInt(days), parseInt(limit));
    res.json({ success: true, data });
  } catch (error) {
    console.error('TOP 접속 IP 조회 실패:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

