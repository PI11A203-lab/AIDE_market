const models = require('../../db/initializer');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');

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

// 보안 설정 저장소 (실제로는 DB 테이블 또는 설정 파일에 저장해야 함)
let securitySettings = {
  auto_block_enabled: true,
  bot_detection_threshold: 70,
  max_login_attempts: 5,
  block_duration_hours: 24
};

/**
 * 보안 설정 조회
 */
exports.getSecuritySettings = async () => {
  // TODO: 실제로는 DB나 설정 파일에서 읽어와야 함
  return securitySettings;
};

/**
 * 보안 설정 업데이트
 */
exports.updateSecuritySettings = async (newSettings) => {
  // TODO: 실제로는 DB나 설정 파일에 저장해야 함
  securitySettings = { ...securitySettings, ...newSettings };
  return securitySettings;
};

