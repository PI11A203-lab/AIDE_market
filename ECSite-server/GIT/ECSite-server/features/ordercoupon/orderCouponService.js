const models = require("../../db/initializer");

// 전체 주문 쿠폰 목록 조회
exports.findAllOrderCoupons = async (page = 1, limit = 20, orderId = null, userId = null, couponId = null) => {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (orderId) {
        where.order_id = parseInt(orderId);
    }
    
    if (userId) {
        where.user_id = parseInt(userId);
    }
    
    if (couponId) {
        where.coupon_id = parseInt(couponId);
    }
    
    const { count, rows } = await models.OrderCoupon.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']],
        include: [
            {
                model: models.Order,
                as: 'order',
                attributes: ['id', 'order_number', 'total_amount', 'status', 'purchased_at'],
                required: false
            },
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'username', 'email'],
                required: false
            },
            {
                model: models.Coupon,
                as: 'coupon',
                attributes: ['coupon_id', 'code', 'discount_type', 'discount_value'],
                required: false
            }
        ]
    });
    
    return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        orderCoupons: rows.map(oc => oc.toJSON())
    };
};

// ID로 주문 쿠폰 조회
exports.findOrderCouponById = async (id) => {
    const orderCoupon = await models.OrderCoupon.findByPk(id, {
        include: [
            {
                model: models.Order,
                as: 'order',
                attributes: ['id', 'order_number', 'total_amount', 'status'],
                required: false
            },
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'username', 'email'],
                required: false
            },
            {
                model: models.Coupon,
                as: 'coupon',
                attributes: ['coupon_id', 'code', 'discount_type', 'discount_value'],
                required: false
            }
        ]
    });
    
    if (!orderCoupon) {
        return null;
    }
    
    return orderCoupon.toJSON();
};

// 주문별 주문 쿠폰 목록 조회
exports.findOrderCouponsByOrderId = async (orderId) => {
    const orderCoupons = await models.OrderCoupon.findAll({
        where: { order_id: parseInt(orderId) },
        order: [['created_at', 'DESC']],
        include: [
            {
                model: models.Coupon,
                as: 'coupon',
                attributes: ['coupon_id', 'code', 'discount_type', 'discount_value'],
                required: false
            }
        ]
    });
    
    return orderCoupons.map(oc => oc.toJSON());
};

// 사용자별 주문 쿠폰 목록 조회
exports.findOrderCouponsByUserId = async (userId, page = 1, limit = 20) => {
    return await exports.findAllOrderCoupons(page, limit, null, userId, null);
};

// 쿠폰별 주문 쿠폰 목록 조회
exports.findOrderCouponsByCouponId = async (couponId, page = 1, limit = 20) => {
    return await exports.findAllOrderCoupons(page, limit, null, null, couponId);
};

// 주문 쿠폰 생성
exports.createOrderCoupon = async ({ order_id, user_id, coupon_id, applied_value }) => {
    if (!order_id || !user_id || !coupon_id || applied_value === undefined || applied_value === null) {
        throw new Error('order_id, user_id, coupon_id, applied_value는 필수입니다');
    }
    
    // 주문 존재 확인
    const order = await models.Order.findByPk(order_id);
    if (!order) {
        throw new Error('주문을 찾을 수 없습니다');
    }
    
    // 사용자 존재 확인
    const user = await models.User.findByPk(user_id);
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }
    
    // 쿠폰 존재 확인
    const coupon = await models.Coupon.findByPk(coupon_id);
    if (!coupon) {
        throw new Error('쿠폰을 찾을 수 없습니다');
    }
    
    // 주문의 사용자와 일치하는지 확인
    if (parseInt(order.user_id) !== parseInt(user_id)) {
        throw new Error('주문의 사용자와 일치하지 않습니다');
    }
    
    // applied_value 유효성 검사
    const value = parseFloat(applied_value);
    if (isNaN(value) || value < 0) {
        throw new Error('applied_value는 0 이상의 숫자여야 합니다');
    }
    
    // 같은 주문에 같은 쿠폰이 이미 적용되었는지 확인 (선택사항 - 비즈니스 로직에 따라)
    const existing = await models.OrderCoupon.findOne({
        where: {
            order_id: parseInt(order_id),
            coupon_id: parseInt(coupon_id)
        }
    });
    
    if (existing) {
        throw new Error('이 주문에 이미 해당 쿠폰이 적용되어 있습니다');
    }
    
    const orderCoupon = await models.OrderCoupon.create({
        order_id: parseInt(order_id),
        user_id: parseInt(user_id),
        coupon_id: parseInt(coupon_id),
        applied_value: value
    });
    
    return orderCoupon.toJSON();
};

// 주문 쿠폰 업데이트
exports.updateOrderCoupon = async (id, { applied_value }) => {
    const orderCoupon = await models.OrderCoupon.findByPk(id);
    if (!orderCoupon) {
        throw new Error('주문 쿠폰을 찾을 수 없습니다');
    }
    
    const updateData = {};
    
    if (applied_value !== undefined) {
        const value = parseFloat(applied_value);
        if (isNaN(value) || value < 0) {
            throw new Error('applied_value는 0 이상의 숫자여야 합니다');
        }
        updateData.applied_value = value;
    }
    
    await orderCoupon.update(updateData);
    return orderCoupon.toJSON();
};

// 주문 쿠폰 삭제
exports.deleteOrderCoupon = async (id) => {
    const orderCoupon = await models.OrderCoupon.findByPk(id);
    if (!orderCoupon) {
        throw new Error('주문 쿠폰을 찾을 수 없습니다');
    }
    
    await orderCoupon.destroy();
    return true;
};

