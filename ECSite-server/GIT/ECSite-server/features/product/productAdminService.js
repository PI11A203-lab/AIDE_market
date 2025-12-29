const models = require('../../db/initializer');
const { Op } = require('sequelize');

/**
 * 대기 중인 상품 신청 목록 조회
 */
exports.getPendingProducts = async (page = 1, limit = 20, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = { approval_status: 'pending' };

  // 필터 적용
  if (filters.category_id) {
    where.category_id = filters.category_id;
  }
  
  if (filters.search) {
    where.name = { [Op.like]: `%${filters.search}%` };
  }

  const { count, rows } = await models.Product.findAndCountAll({
    where,
    include: [
      {
        model: models.Category,
        as: 'category',
        attributes: ['id', 'name', 'name_ja']
      },
      {
        model: models.User,
        as: 'approver',
        attributes: ['id', 'username', 'email'],
        required: false
      }
    ],
    limit,
    offset,
    order: [['approval_requested_at', 'DESC']]
  });

  return {
    products: rows,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit)
  };
};

/**
 * 상품 승인
 */
exports.approveProduct = async (productId, approvedByUserId) => {
  const transaction = await models.sequelize.transaction();

  try {
    const product = await models.Product.findByPk(productId, { transaction });

    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    if (product.approval_status !== 'pending') {
      throw new Error('대기 중인 상품만 승인할 수 있습니다.');
    }

    await product.update({
      approval_status: 'approved',
      approved_at: new Date(),
      approved_by: approvedByUserId
    }, { transaction });

    await transaction.commit();
    
    // 업데이트된 상품 반환 (관계 포함)
    return await models.Product.findByPk(productId, {
      include: [
        {
          model: models.User,
          as: 'approver',
          attributes: ['id', 'username', 'email']
        }
      ]
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * 상품 거부
 */
exports.rejectProduct = async (productId, rejectedByUserId, reason) => {
  const transaction = await models.sequelize.transaction();

  try {
    const product = await models.Product.findByPk(productId, { transaction });

    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    if (product.approval_status !== 'pending') {
      throw new Error('대기 중인 상품만 거부할 수 있습니다.');
    }

    await product.update({
      approval_status: 'rejected',
      rejected_at: new Date(),
      rejection_reason: reason
    }, { transaction });

    await transaction.commit();
    
    // 업데이트된 상품 반환
    return await models.Product.findByPk(productId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * 상품 상세 정보 (승인 대기용)
 */
exports.getPendingProductDetail = async (productId) => {
  const product = await models.Product.findByPk(productId, {
    include: [
      {
        model: models.Category,
        as: 'category',
        attributes: ['id', 'name', 'name_ja']
      },
      {
        model: models.Category,
        as: 'subcategory',
        attributes: ['id', 'name', 'name_ja']
      },
      {
        model: models.Tag,
        as: 'tags',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      },
      {
        model: models.User,
        as: 'approver',
        attributes: ['id', 'username', 'email'],
        required: false
      }
    ]
  });

  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }

  return product;
};

