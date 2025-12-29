const models = require('../../db/initializer');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const sequelize = models.sequelize;

/**
 * IP 접속 로그 목록 조회
 */
exports.getIPLogs = async (page = 1, limit = 50, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {};

  // 필터 적용
  if (filters.ip) {
    where.ip_address = { [Op.like]: `%${filters.ip}%` };
  }
  
  if (filters.country) {
    where.country = filters.country;
  }
  
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

  const { count, rows } = await models.IpAccessLog.findAndCountAll({
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
    logs: rows,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * 접속 통계 (일별/주별/월별)
 */
exports.getIPStats = async (period = 'daily', dateFrom = null, dateTo = null) => {
  const dateFormat = period === 'daily' ? '%Y-%m-%d' : period === 'weekly' ? '%Y-%u' : '%Y-%m';
  
  const where = {};
  if (dateFrom || dateTo) {
    where.created_at = {};
    if (dateFrom) where.created_at[Op.gte] = new Date(dateFrom);
    if (dateTo) where.created_at[Op.lte] = new Date(dateTo);
  }

  const stats = await models.IpAccessLog.findAll({
    attributes: [
      [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), dateFormat), 'date'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('ip_address'))), 'unique_ips']
    ],
    where,
    group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), dateFormat)],
    order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), dateFormat), 'ASC']],
    raw: true
  });

  return stats;
};

/**
 * 국가별 통계
 */
exports.getIPCountryStats = async (dateFrom = null, dateTo = null) => {
  const where = {};
  if (dateFrom || dateTo) {
    where.created_at = {};
    if (dateFrom) where.created_at[Op.gte] = new Date(dateFrom);
    if (dateTo) where.created_at[Op.lte] = new Date(dateTo);
  }

  const stats = await models.IpAccessLog.findAll({
    attributes: [
      'country',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('ip_address'))), 'unique_ips']
    ],
    where: {
      ...where,
      country: { [Op.ne]: null }
    },
    group: ['country'],
    order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
    limit: 20,
    raw: true
  });

  return stats;
};

/**
 * 시간대별 통계
 */
exports.getIPHourlyStats = async (dateFrom = null, dateTo = null) => {
  const where = {};
  if (dateFrom || dateTo) {
    where.created_at = {};
    if (dateFrom) where.created_at[Op.gte] = new Date(dateFrom);
    if (dateTo) where.created_at[Op.lte] = new Date(dateTo);
  }

  const stats = await models.IpAccessLog.findAll({
    attributes: [
      [Sequelize.fn('HOUR', Sequelize.col('created_at')), 'hour'],
      [Sequelize.fn('DAYOFWEEK', Sequelize.col('created_at')), 'dayOfWeek'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
    ],
    where,
    group: [
      Sequelize.fn('HOUR', Sequelize.col('created_at')),
      Sequelize.fn('DAYOFWEEK', Sequelize.col('created_at'))
    ],
    raw: true
  });

  return stats;
};

/**
 * IP 차단
 */
exports.blockIP = async (ipAddress, blockedByUserId, reason, memo = null) => {
  const transaction = await models.sequelize.transaction();

  try {
    // IP 관리에 추가 또는 업데이트
    const [ipManagement, created] = await models.IpManagement.findOrCreate({
      where: { ip_address: ipAddress },
      defaults: {
        ip_address: ipAddress,
        is_blocked: true,
        block_reason: reason,
        memo: memo,
        blocked_by: blockedByUserId,
        blocked_at: new Date()
      },
      transaction
    });

    if (!created) {
      await ipManagement.update({
        is_blocked: true,
        block_reason: reason,
        memo: memo,
        blocked_by: blockedByUserId,
        blocked_at: new Date()
      }, { transaction });
    }

    await transaction.commit();

    // 캐시 클리어 (차단 상태 업데이트 반영)
    try {
      const ipBlockMiddleware = require('../../../middleware/ipBlockMiddleware');
      ipBlockMiddleware.clearIPCache(ipAddress);
    } catch (cacheError) {
      console.warn('⚠️ IP 캐시 클리어 실패:', cacheError);
    }

    return ipManagement;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * IP 차단 해제
 */
exports.unblockIP = async (ipAddress) => {
  const ipManagement = await models.IpManagement.findOne({
    where: { ip_address: ipAddress }
  });

  if (!ipManagement) {
    throw new Error('IP가 관리 목록에 없습니다.');
  }

  await ipManagement.update({
    is_blocked: false,
    block_reason: null,
    blocked_at: null
  });

  // 캐시 클리어 (차단 해제 상태 업데이트 반영)
  try {
    const ipBlockMiddleware = require('../../../middleware/ipBlockMiddleware');
    ipBlockMiddleware.clearIPCache(ipAddress);
  } catch (cacheError) {
    console.warn('⚠️ IP 캐시 클리어 실패:', cacheError);
  }

  return ipManagement;
};

/**
 * IP 화이트리스트 추가
 */
exports.whitelistIP = async (ipAddress, memo = null) => {
  const transaction = await models.sequelize.transaction();

  try {
    const [ipManagement, created] = await models.IpManagement.findOrCreate({
      where: { ip_address: ipAddress },
      defaults: {
        ip_address: ipAddress,
        is_whitelisted: true,
        is_blocked: false,
        memo: memo
      },
      transaction
    });

    if (!created) {
      await ipManagement.update({
        is_whitelisted: true,
        is_blocked: false,
        memo: memo
      }, { transaction });
    }

    await transaction.commit();
    return ipManagement;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * IP 관리 목록 조회
 */
exports.getIPManagement = async (page = 1, limit = 50, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (filters.blocked !== undefined) {
    where.is_blocked = filters.blocked === 'true';
  }
  
  if (filters.whitelisted !== undefined) {
    where.is_whitelisted = filters.whitelisted === 'true';
  }
  
  if (filters.search) {
    where.ip_address = { [Op.like]: `%${filters.search}%` };
  }

  const { count, rows } = await models.IpManagement.findAndCountAll({
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
    ipManagement: rows,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * 일별 접속자 추이 (최근 N일)
 */
exports.getAccessTrendData = async (days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const trend = await models.IpAccessLog.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('ip_address'))), 'unique']
      ],
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    return trend.map(item => ({
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : null,
      total: parseInt(item.total) || 0,
      unique: parseInt(item.unique) || 0
    })).filter(item => item.date !== null);
  } catch (error) {
    console.error('접속 추이 데이터 조회 실패:', error);
    throw error;
  }
};

/**
 * 국가별 접속 분포 (파이 차트용)
 */
exports.getCountryDistribution = async (days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const countries = await models.IpAccessLog.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        },
        country: {
          [Op.ne]: null
        }
      },
      attributes: [
        'country',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['country'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10,
      raw: true
    });

    return countries.map(item => ({
      name: item.country,
      value: parseInt(item.count) || 0
    }));
  } catch (error) {
    console.error('국가별 분포 데이터 조회 실패:', error);
    throw error;
  }
};

/**
 * 시간대별 접속 분포 (히트맵용)
 */
exports.getHourlyAccessDistribution = async (days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const hourly = await models.IpAccessLog.findAll({
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
    console.error('시간대별 접속 분포 조회 실패:', error);
    throw error;
  }
};

/**
 * TOP 접속 IP 리스트
 */
exports.getTopAccessIPs = async (days = 7, limit = 10) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const topIPs = await models.IpAccessLog.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'ip_address',
        'country',
        [sequelize.fn('COUNT', sequelize.col('id')), 'access_count']
      ],
      group: ['ip_address', 'country'],
      order: [[sequelize.literal('access_count'), 'DESC']],
      limit: parseInt(limit),
      raw: true
    });

    return topIPs.map(item => ({
      ip: item.ip_address,
      country: item.country || 'Unknown',
      accessCount: parseInt(item.access_count) || 0
    }));
  } catch (error) {
    console.error('TOP 접속 IP 조회 실패:', error);
    throw error;
  }
};

