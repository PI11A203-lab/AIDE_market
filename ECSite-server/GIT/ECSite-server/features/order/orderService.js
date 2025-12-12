const models = require("../../db/initializer");

// 주문 번호 생성
function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
}

// 전체 주문 목록 조회
exports.findAllOrders = async (page = 1, limit = 20, userId = null, status = null) => {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (userId) {
        where.user_id = parseInt(userId);
    }
    
    if (status) {
        where.status = status;
    }
    
    const { count, rows } = await models.Order.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['purchased_at', 'DESC']],
        include: [
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'username', 'email'],
                required: false
            },
            {
                model: models.PaymentMethod,
                as: 'paymentMethod',
                required: false,
                include: [{
                    model: models.CreditCard,
                    as: 'creditCard',
                    required: false,
                    attributes: ['card_id', 'card_company', 'card_holder', 'exp_month', 'exp_year']
                }]
            },
            {
                model: models.OrderItem,
                as: 'orderItems',
                required: false,
                include: [{
                    model: models.Product,
                    as: 'product',
                    required: false,
                    attributes: ['id', 'name', 'price', 'seller', 'imageUrl', 'description', 'category_id', 'sub_category_id']
                }]
            },
            {
                model: models.OrderCoupon,
                as: 'orderCoupons',
                required: false,
                include: [{
                    model: models.Coupon,
                    as: 'coupon',
                    required: false,
                    attributes: ['coupon_id', 'code', 'discount_type', 'discount_value']
                }]
            }
        ]
    });
    
    // 민감한 정보 제외
    const orders = rows.map(order => {
        const orderData = order.toJSON();
        // paymentMethod 정보 정리
        if (orderData.paymentMethod && orderData.paymentMethod.creditCard) {
            delete orderData.paymentMethod.creditCard.card_number_encrypted;
            delete orderData.paymentMethod.creditCard.cvc_encrypted;
        }
        // orderItems가 없는 경우 빈 배열로 설정
        if (!orderData.orderItems) {
            orderData.orderItems = [];
        }
        // orderCoupons가 없는 경우 빈 배열로 설정
        if (!orderData.orderCoupons) {
            orderData.orderCoupons = [];
        }
        return orderData;
    });
    
    return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        orders: orders
    };
};

// ID로 주문 조회
exports.findOrderById = async (id) => {
    const order = await models.Order.findByPk(id, {
        include: [
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'username', 'email'],
                required: false
            },
            {
                model: models.PaymentMethod,
                as: 'paymentMethod',
                required: false,
                include: [{
                    model: models.CreditCard,
                    as: 'creditCard',
                    required: false,
                    attributes: ['card_id', 'card_company', 'card_holder', 'exp_month', 'exp_year']
                }]
            },
            {
                model: models.OrderItem,
                as: 'orderItems',
                required: false,
                include: [{
                    model: models.Product,
                    as: 'product',
                    required: false,
                    attributes: ['id', 'name', 'price', 'seller', 'imageUrl', 'description', 'category_id', 'sub_category_id']
                }]
            },
            {
                model: models.OrderCoupon,
                as: 'orderCoupons',
                required: false,
                include: [{
                    model: models.Coupon,
                    as: 'coupon',
                    required: false,
                    attributes: ['coupon_id', 'code', 'discount_type', 'discount_value']
                }]
            }
        ]
    });
    
    if (!order) {
        return null;
    }
    
    // 민감한 정보 제외
    const orderData = order.toJSON();
    if (orderData.paymentMethod && orderData.paymentMethod.creditCard) {
        delete orderData.paymentMethod.creditCard.card_number_encrypted;
        delete orderData.paymentMethod.creditCard.cvc_encrypted;
    }
    // orderItems가 없는 경우 빈 배열로 설정
    if (!orderData.orderItems) {
        orderData.orderItems = [];
    }
    // orderCoupons가 없는 경우 빈 배열로 설정
    if (!orderData.orderCoupons) {
        orderData.orderCoupons = [];
    }
    
    return orderData;
};

// 주문 번호로 주문 조회
exports.findOrderByOrderNumber = async (orderNumber) => {
    const order = await models.Order.findOne({
        where: { order_number: orderNumber },
        include: [
            {
                model: models.User,
                as: 'user',
                attributes: ['id', 'username', 'email'],
                required: false
            },
            {
                model: models.PaymentMethod,
                as: 'paymentMethod',
                required: false,
                include: [{
                    model: models.CreditCard,
                    as: 'creditCard',
                    required: false,
                    attributes: ['card_id', 'card_company', 'card_holder', 'exp_month', 'exp_year']
                }]
            },
            {
                model: models.OrderItem,
                as: 'orderItems',
                required: false,
                include: [{
                    model: models.Product,
                    as: 'product',
                    required: false,
                    attributes: ['id', 'name', 'price', 'seller', 'imageUrl', 'description', 'category_id', 'sub_category_id']
                }]
            },
            {
                model: models.OrderCoupon,
                as: 'orderCoupons',
                required: false,
                include: [{
                    model: models.Coupon,
                    as: 'coupon',
                    required: false,
                    attributes: ['coupon_id', 'code', 'discount_type', 'discount_value']
                }]
            }
        ]
    });
    
    if (!order) {
        return null;
    }
    
    // 민감한 정보 제외
    const orderData = order.toJSON();
    if (orderData.paymentMethod && orderData.paymentMethod.creditCard) {
        delete orderData.paymentMethod.creditCard.card_number_encrypted;
        delete orderData.paymentMethod.creditCard.cvc_encrypted;
    }
    // orderItems가 없는 경우 빈 배열로 설정
    if (!orderData.orderItems) {
        orderData.orderItems = [];
    }
    // orderCoupons가 없는 경우 빈 배열로 설정
    if (!orderData.orderCoupons) {
        orderData.orderCoupons = [];
    }
    
    return orderData;
};

// 사용자별 주문 목록 조회
exports.findOrdersByUserId = async (userId, page = 1, limit = 20) => {
    return await exports.findAllOrders(page, limit, userId, null);
};

// 주문 생성
exports.createOrder = async ({ user_id, total_amount, payment_id, status }) => {
    if (!user_id || total_amount === undefined || total_amount === null) {
        throw new Error('user_id와 total_amount는 필수입니다');
    }
    
    // 사용자 존재 확인
    let user;
    try {
        user = await models.User.findByPk(user_id);
    } catch (err) {
        console.error('사용자 조회 에러:', err);
        throw new Error('사용자 조회 중 오류가 발생했습니다: ' + err.message);
    }
    
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다 (user_id: ' + user_id + ')');
    }
    
    // payment_id 유효성 검사
    if (payment_id) {
        const paymentMethod = await models.PaymentMethod.findByPk(payment_id);
        if (!paymentMethod) {
            throw new Error('결제수단을 찾을 수 없습니다 (payment_id: ' + payment_id + ')');
        }
        
        // 결제수단이 해당 사용자의 것인지 확인
        if (paymentMethod.user_id !== parseInt(user_id)) {
            throw new Error('해당 결제수단은 사용자의 것이 아닙니다');
        }
    }
    
    // 주문 번호 생성
    let orderNumber = generateOrderNumber();
    // 중복 확인 (매우 드물지만)
    let exists = await models.Order.findOne({ where: { order_number: orderNumber } });
    let attempts = 0;
    while (exists && attempts < 10) {
        orderNumber = generateOrderNumber();
        exists = await models.Order.findOne({ where: { order_number: orderNumber } });
        attempts++;
    }
    
    // status 유효성 검사
    const validStatuses = ['pending', 'completed', 'cancelled', 'refunded'];
    let finalStatus = status || 'pending';
    if (!validStatuses.includes(finalStatus)) {
        throw new Error('status는 pending, completed, cancelled, refunded 중 하나여야 합니다');
    }
    
    // total_amount 검증 및 변환
    const totalAmountInt = Math.round(parseFloat(total_amount));
    if (isNaN(totalAmountInt) || totalAmountInt < 0) {
        throw new Error('total_amount는 0 이상의 숫자여야 합니다');
    }
    
    let order;
    try {
        order = await models.Order.create({
            user_id: parseInt(user_id),
            order_number: orderNumber,
            total_amount: totalAmountInt,
            payment_id: payment_id ? parseInt(payment_id) : null,
            status: finalStatus
        });
    } catch (err) {
        console.error('주문 데이터베이스 생성 에러:', err);
        console.error('주문 데이터:', {
            user_id: parseInt(user_id),
            order_number: orderNumber,
            total_amount: totalAmountInt,
            payment_id: payment_id ? parseInt(payment_id) : null,
            status: finalStatus
        });
        
        // Sequelize 에러 처리
        if (err.name === 'SequelizeValidationError') {
            throw new Error('주문 데이터 검증 실패: ' + err.errors.map(e => e.message).join(', '));
        } else if (err.name === 'SequelizeDatabaseError') {
            throw new Error('데이터베이스 오류: ' + err.message);
        } else if (err.name === 'SequelizeUniqueConstraintError') {
            throw new Error('주문 번호 중복: ' + orderNumber);
        } else if (err.name === 'SequelizeForeignKeyConstraintError') {
            throw new Error('결제수단을 찾을 수 없습니다 (payment_id: ' + payment_id + ')');
        }
        throw new Error('주문 생성 실패: ' + err.message);
    }
    
    // 주문 정보 조회 (관계 포함)
    const orderWithRelations = await exports.findOrderById(order.id);
    
    return orderWithRelations;
};

// 주문 업데이트
exports.updateOrder = async (id, { status, payment_id }) => {
    const order = await models.Order.findByPk(id);
    if (!order) {
        throw new Error('주문을 찾을 수 없습니다');
    }
    
    const updateData = {};
    
    if (status !== undefined) {
        const validStatuses = ['pending', 'completed', 'cancelled', 'refunded'];
        if (!validStatuses.includes(status)) {
            throw new Error('status는 pending, completed, cancelled, refunded 중 하나여야 합니다');
        }
        updateData.status = status;
    }
    
    if (payment_id !== undefined) {
        if (payment_id) {
            // payment_id 유효성 검사
            const paymentMethod = await models.PaymentMethod.findByPk(payment_id);
            if (!paymentMethod) {
                throw new Error('결제수단을 찾을 수 없습니다 (payment_id: ' + payment_id + ')');
            }
            
            // 결제수단이 해당 사용자의 것인지 확인
            if (paymentMethod.user_id !== order.user_id) {
                throw new Error('해당 결제수단은 사용자의 것이 아닙니다');
            }
        }
        updateData.payment_id = payment_id ? parseInt(payment_id) : null;
    }
    
    await order.update(updateData);
    
    // 주문 정보 조회 (관계 포함)
    const orderWithRelations = await exports.findOrderById(order.id);
    
    return orderWithRelations;
};

// 주문 삭제
exports.deleteOrder = async (id) => {
    const order = await models.Order.findByPk(id);
    if (!order) {
        throw new Error('주문을 찾을 수 없습니다');
    }
    
    await order.destroy();
    return true;
};
