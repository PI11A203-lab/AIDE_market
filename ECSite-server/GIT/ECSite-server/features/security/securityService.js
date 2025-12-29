const models = require('../../db/initializer');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const sequelize = models.sequelize;

/**
 * 보안 이벤트 목록 조회
 */
exports.getSecurityEvents = async (page = 1, limit = 50, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (filters.type) {
    where.event_type = filters.type;
  }
  
  if (filters.severity) {
    where.severity = filters.severity;
  }
  
  if (filters.ip) {
    where.ip_address = { [Op.like]: `%${filters.ip}%` };
  }
  
  if (filters.dateFrom || filters.dateTo) {
    where.created_at = {};
    if (filters.dateFrom) {
      where.created_at[Op.gte] = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.created_at[Op.lte] = new Date(filters.dateTo);
    }
  }

  const { count, rows } = await models.SecurityEvent.findAndCountAll({
    where,
    include: [
      {
        model: models.User,
        as: 'user',
        attributes: ['id', 'username', 'email'],
        required: false
      }
    ],
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });

  return {
    events: rows,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * 보안 이벤트 통계 (일별/주별/월별)
 */
exports.getSecurityEventStats = async (period = 'daily', dateFrom = null, dateTo = null) => {
  const dateFormat = period === 'daily' ? '%Y-%m-%d' : period === 'weekly' ? '%Y-%u' : '%Y-%m';
  
  const where = {};
  if (dateFrom || dateTo) {
    where.created_at = {};
    if (dateFrom) where.created_at[Op.gte] = new Date(dateFrom);
    if (dateTo) where.created_at[Op.lte] = new Date(dateTo);
  }

  const stats = await models.SecurityEvent.findAll({
    attributes: [
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), dateFormat), 'date'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
    ],
    where,
    group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), dateFormat)],
    order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), dateFormat), 'ASC']],
    raw: true
  });

  return stats;
};

/**
 * 이벤트 유형별 통계
 */
exports.getSecurityEventStatsByType = async (dateFrom = null, dateTo = null) => {
  const where = {};
  if (dateFrom || dateTo) {
    where.created_at = {};
    if (dateFrom) where.created_at[Op.gte] = new Date(dateFrom);
    if (dateTo) where.created_at[Op.lte] = new Date(dateTo);
  }

  const stats = await models.SecurityEvent.findAll({
    attributes: [
      'event_type',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
    ],
    where,
    group: ['event_type'],
    order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
    raw: true
  });

  return stats;
};

/**
 * 봇 탐지 목록 조회
 */
exports.getBotDetections = async (page = 1, limit = 50, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (filters.blocked !== undefined) {
    where.is_blocked = filters.blocked === 'true';
  }
  
  if (filters.dateFrom || filters.dateTo) {
    where.created_at = {};
    if (filters.dateFrom) {
      where.created_at[Op.gte] = new Date(filters.dateFrom);
    }
    if (filters.dateTo) {
      where.created_at[Op.lte] = new Date(filters.dateTo);
    }
  }

  const { count, rows } = await models.BotDetection.findAndCountAll({
    where,
    include: [
      {
        model: models.User,
        as: 'blocker',
        attributes: ['id', 'username', 'email'],
        required: false
      }
    ],
    limit,
    offset,
    order: [['created_at', 'DESC']]
  });

  return {
    bots: rows,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * 봇 차단
 */
exports.blockBot = async (botId, blockedByUserId, reason) => {
  const transaction = await models.sequelize.transaction();

  try {
    const bot = await models.BotDetection.findByPk(botId, { transaction });

    if (!bot) {
      throw new Error('봇 탐지 기록을 찾을 수 없습니다.');
    }

    await bot.update({
      is_blocked: true,
      blocked_by: blockedByUserId,
      blocked_at: new Date()
    }, { transaction });

    await transaction.commit();
    return bot;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * 봇 차단 해제
 */
exports.unblockBot = async (botId) => {
  const bot = await models.BotDetection.findByPk(botId);

  if (!bot) {
    throw new Error('봇 탐지 기록을 찾을 수 없습니다.');
  }

  await bot.update({
    is_blocked: false,
    blocked_at: null
  });

  return bot;
};

/**
 * IP 수동 차단
 */
exports.blockIPManual = async (ipAddress, blockedByUserId, reason, durationHours = 24) => {
  // ipManagementService의 blockIP와 동일하지만 보안 컨텍스트에서 사용
  const ipManagementService = require('./ipManagementService');
  return await ipManagementService.blockIP(ipAddress, blockedByUserId, reason);
};

/**
 * IP 수동 차단 해제
 */
exports.unblockIPManual = async (ipAddress) => {
  const ipManagementService = require('./ipManagementService');
  return await ipManagementService.unblockIP(ipAddress);
};

// autoBlockService와 통합
const autoBlockService = require('../../services/autoBlockService');

/**
 * 일별 보안 이벤트 추이 (최근 N일)
 */
exports.getEventTrendData = async (days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const events = await models.SecurityEvent.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        'event_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [
        sequelize.fn('DATE', sequelize.col('created_at')),
        'event_type'
      ],
      order: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']
      ],
      raw: true
    });

    // 데이터 포맷팅 (그래프용)
    const trendData = {};
    events.forEach(event => {
      const date = event.date ? new Date(event.date).toISOString().split('T')[0] : null;
      if (!date) return;

      const type = event.event_type;
      const count = parseInt(event.count) || 0;

      if (!trendData[date]) {
        trendData[date] = {
          date,
          login_failed: 0,
          bot_detected: 0,
          api_abuse: 0,
          scraping: 0,
          suspicious_activity: 0,
          ip_blocked: 0
        };
      }

      if (trendData[date].hasOwnProperty(type)) {
        trendData[date][type] = count;
      }
    });

    return Object.values(trendData);
  } catch (error) {
    console.error('이벤트 추이 데이터 조회 실패:', error);
    throw error;
  }
};

/**
 * 이벤트 유형별 분포 (파이 차트용)
 */
exports.getEventDistribution = async (days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const distribution = await models.SecurityEvent.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'event_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['event_type'],
      raw: true
    });

    return distribution.map(item => ({
      name: item.event_type,
      value: parseInt(item.count) || 0
    }));
  } catch (error) {
    console.error('이벤트 분포 데이터 조회 실패:', error);
    throw error;
  }
};

/**
 * 시간대별 이벤트 분포 (히트맵용)
 */
exports.getHourlyDistribution = async (days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const hourly = await models.SecurityEvent.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('HOUR', sequelize.col('created_at')), 'hour'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('HOUR', sequelize.col('created_at'))],
      order: [[sequelize.fn('HOUR', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // 0-23시 전체 데이터 생성 (빈 시간대는 0으로)
    const result = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0
    }));

    hourly.forEach(item => {
      const hour = parseInt(item.hour);
      if (hour >= 0 && hour < 24) {
        result[hour].count = parseInt(item.count) || 0;
      }
    });

    return result;
  } catch (error) {
    console.error('시간대별 이벤트 분포 조회 실패:', error);
    throw error;
  }
};

/**
 * TOP 공격 IP 리스트
 */
exports.getTopAttackIPs = async (days = 7, limit = 10) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const topIPs = await models.SecurityEvent.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        },
        severity: {
          [Op.in]: ['high', 'critical']
        }
      },
      attributes: [
        'ip_address',
        [sequelize.fn('COUNT', sequelize.col('id')), 'event_count'],
        [sequelize.fn('MAX', sequelize.col('severity')), 'max_severity']
      ],
      group: ['ip_address'],
      order: [[sequelize.literal('event_count'), 'DESC']],
      limit: parseInt(limit),
      raw: true
    });

    return topIPs.map(item => ({
      ip: item.ip_address,
      eventCount: parseInt(item.event_count) || 0,
      maxSeverity: item.max_severity || 'medium'
    }));
  } catch (error) {
    console.error('TOP 공격 IP 조회 실패:', error);
    throw error;
  }
};

/**
 * 보안 설정 조회
 */
exports.getSecuritySettings = async () => {
  // autoBlockService에서 설정 가져오기
  return await autoBlockService.getSecuritySettings();
};

/**
 * 보안 설정 업데이트
 */
exports.updateSecuritySettings = async (newSettings, userId = null) => {
  // autoBlockService에서 설정 업데이트
  return await autoBlockService.updateSecuritySettings(newSettings, userId);
};

