const models = require("../../db/initializer");

// 전체 쿠폰 목록 조회
exports.findAllCoupons = async (page = 1, limit = 20, activeOnly = false) => {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (activeOnly) {
        where.is_active = true;
        where.expires_at = {
            [models.sequelize.Op.or]: [
                { [models.sequelize.Op.gt]: new Date() },
                null
            ]
        };
    }
    
    const { count, rows } = await models.Coupon.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
    });
    
    return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        coupons: rows.map(coupon => coupon.toJSON())
    };
};

// ID로 쿠폰 조회
exports.findCouponById = async (id) => {
    const coupon = await models.Coupon.findByPk(id);
    
    if (!coupon) {
        return null;
    }
    
    return coupon.toJSON();
};

// 쿠폰 코드로 조회
exports.findCouponByCode = async (code) => {
    const coupon = await models.Coupon.findOne({
        where: { code: code.toUpperCase() }
    });
    
    if (!coupon) {
        return null;
    }
    
    return coupon.toJSON();
};

// 쿠폰 유효성 검사 및 할인 계산
exports.validateAndCalculateDiscount = async (code, orderAmount) => {
    const coupon = await models.Coupon.findOne({
        where: { code: code.toUpperCase() }
    });
    
    if (!coupon) {
        throw new Error('쿠폰을 찾을 수 없습니다');
    }
    
    const couponData = coupon.toJSON();
    
    // 활성화 상태 확인
    if (!couponData.is_active) {
        throw new Error('쿠폰이 비활성화되어 있습니다');
    }
    
    // 만료일 확인
    if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
        throw new Error('쿠폰이 만료되었습니다');
    }
    
    // 최소 주문 금액 확인
    if (couponData.min_order && parseFloat(orderAmount) < parseFloat(couponData.min_order)) {
        throw new Error(`최소 주문 금액 ${couponData.min_order}원 이상이어야 합니다`);
    }
    
    // 할인 금액 계산
    let discountAmount = 0;
    if (couponData.discount_type === 'amount') {
        // 고정 금액 할인
        discountAmount = parseFloat(couponData.discount_value);
    } else if (couponData.discount_type === 'rate') {
        // 비율 할인
        discountAmount = parseFloat(orderAmount) * (parseFloat(couponData.discount_value) / 100);
        
        // 최대 할인 금액 제한
        if (couponData.max_discount && discountAmount > parseFloat(couponData.max_discount)) {
            discountAmount = parseFloat(couponData.max_discount);
        }
    }
    
    // 할인 금액이 주문 금액을 초과하지 않도록
    if (discountAmount > parseFloat(orderAmount)) {
        discountAmount = parseFloat(orderAmount);
    }
    
    return {
        coupon: couponData,
        discountAmount: discountAmount.toFixed(2),
        finalAmount: (parseFloat(orderAmount) - discountAmount).toFixed(2)
    };
};

// 쿠폰 생성
exports.createCoupon = async ({ code, discount_type, discount_value, max_discount, min_order, expires_at, is_active }) => {
    if (!code || !discount_type || discount_value === undefined || discount_value === null) {
        throw new Error('code, discount_type, discount_value는 필수입니다');
    }
    
    if (discount_type !== 'amount' && discount_type !== 'rate') {
        throw new Error('discount_type은 "amount" 또는 "rate"여야 합니다');
    }
    
    if (parseFloat(discount_value) < 0) {
        throw new Error('discount_value는 0 이상이어야 합니다');
    }
    
    if (max_discount !== undefined && max_discount !== null && parseFloat(max_discount) < 0) {
        throw new Error('max_discount는 0 이상이어야 합니다');
    }
    
    if (min_order !== undefined && min_order !== null && parseFloat(min_order) < 0) {
        throw new Error('min_order는 0 이상이어야 합니다');
    }
    
    // 코드 중복 확인
    const existing = await models.Coupon.findOne({
        where: { code: code.toUpperCase() }
    });
    
    if (existing) {
        throw new Error('이미 존재하는 쿠폰 코드입니다');
    }
    
    const coupon = await models.Coupon.create({
        code: code.toUpperCase(),
        discount_type: discount_type,
        discount_value: parseFloat(discount_value),
        max_discount: max_discount !== undefined ? parseFloat(max_discount) : null,
        min_order: min_order !== undefined ? parseFloat(min_order) : null,
        expires_at: expires_at || null,
        is_active: is_active !== undefined ? Boolean(is_active) : true
    });
    
    return coupon.toJSON();
};

// 쿠폰 업데이트
exports.updateCoupon = async (id, { code, discount_type, discount_value, max_discount, min_order, expires_at, is_active }) => {
    const coupon = await models.Coupon.findByPk(id);
    if (!coupon) {
        throw new Error('쿠폰을 찾을 수 없습니다');
    }
    
    const updateData = {};
    
    if (code !== undefined) {
        // 코드 중복 확인 (자신 제외)
        const existing = await models.Coupon.findOne({
            where: {
                code: code.toUpperCase(),
                coupon_id: { [models.sequelize.Op.ne]: id }
            }
        });
        
        if (existing) {
            throw new Error('이미 존재하는 쿠폰 코드입니다');
        }
        updateData.code = code.toUpperCase();
    }
    
    if (discount_type !== undefined) {
        if (discount_type !== 'amount' && discount_type !== 'rate') {
            throw new Error('discount_type은 "amount" 또는 "rate"여야 합니다');
        }
        updateData.discount_type = discount_type;
    }
    
    if (discount_value !== undefined) {
        if (parseFloat(discount_value) < 0) {
            throw new Error('discount_value는 0 이상이어야 합니다');
        }
        updateData.discount_value = parseFloat(discount_value);
    }
    
    if (max_discount !== undefined) {
        if (max_discount === null) {
            updateData.max_discount = null;
        } else if (parseFloat(max_discount) < 0) {
            throw new Error('max_discount는 0 이상이어야 합니다');
        } else {
            updateData.max_discount = parseFloat(max_discount);
        }
    }
    
    if (min_order !== undefined) {
        if (min_order === null) {
            updateData.min_order = null;
        } else if (parseFloat(min_order) < 0) {
            throw new Error('min_order는 0 이상이어야 합니다');
        } else {
            updateData.min_order = parseFloat(min_order);
        }
    }
    
    if (expires_at !== undefined) {
        updateData.expires_at = expires_at || null;
    }
    
    if (is_active !== undefined) {
        updateData.is_active = Boolean(is_active);
    }
    
    await coupon.update(updateData);
    return coupon.toJSON();
};

// 쿠폰 삭제
exports.deleteCoupon = async (id) => {
    const coupon = await models.Coupon.findByPk(id);
    if (!coupon) {
        throw new Error('쿠폰을 찾을 수 없습니다');
    }
    
    await coupon.destroy();
    return true;
};

