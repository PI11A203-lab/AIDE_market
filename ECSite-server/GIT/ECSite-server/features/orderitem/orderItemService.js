const models = require("../../db/initializer");

// 전체 주문 아이템 목록 조회
exports.findAllOrderItems = async (page = 1, limit = 20, orderId = null, productId = null) => {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (orderId) {
        where.order_id = parseInt(orderId);
    }
    
    if (productId) {
        where.product_id = parseInt(productId);
    }
    
    const { count, rows } = await models.OrderItem.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['id', 'DESC']],
        include: [
            {
                model: models.Order,
                as: 'order',
                attributes: ['id', 'order_number', 'total_amount', 'status', 'purchased_at'],
                required: false
            },
            {
                model: models.Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'seller', 'imageUrl', 'description'],
                required: false
            }
        ]
    });
    
    return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        orderItems: rows.map(oi => oi.toJSON())
    };
};

// ID로 주문 아이템 조회
exports.findOrderItemById = async (id) => {
    const orderItem = await models.OrderItem.findByPk(id, {
        include: [
            {
                model: models.Order,
                as: 'order',
                attributes: ['id', 'order_number', 'total_amount', 'status'],
                required: false
            },
            {
                model: models.Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'seller', 'imageUrl', 'description'],
                required: false
            }
        ]
    });
    
    if (!orderItem) {
        return null;
    }
    
    return orderItem.toJSON();
};

// 주문별 주문 아이템 목록 조회
exports.findOrderItemsByOrderId = async (orderId) => {
    const orderItems = await models.OrderItem.findAll({
        where: { order_id: parseInt(orderId) },
        order: [['id', 'ASC']],
        include: [
            {
                model: models.Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'seller', 'imageUrl', 'description', 'category_id', 'sub_category_id'],
                required: false
            }
        ]
    });
    
    return orderItems.map(oi => oi.toJSON());
};

// 상품별 주문 아이템 목록 조회
exports.findOrderItemsByProductId = async (productId, page = 1, limit = 20) => {
    return await exports.findAllOrderItems(page, limit, null, productId);
};

// 주문 아이템 생성
exports.createOrderItem = async ({ order_id, product_id, quantity, unit_price, has_review }) => {
    if (!order_id || !product_id || unit_price === undefined || unit_price === null) {
        throw new Error('order_id, product_id, unit_price는 필수입니다');
    }
    
    // 주문 존재 확인
    const order = await models.Order.findByPk(order_id);
    if (!order) {
        throw new Error('주문을 찾을 수 없습니다');
    }
    
    // 상품 존재 확인
    const product = await models.Product.findByPk(product_id);
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }
    
    // 이미 구매한 상품인지 체크
    const existingOrderItem = await models.OrderItem.findOne({
        where: { product_id: parseInt(product_id) },
        include: [{
            model: models.Order,
            as: 'order',
            where: { user_id: order.user_id },
            required: true
        }]
    });
    
    if (existingOrderItem) {
        throw new Error('이미 구매한 상품입니다. 한 유저당 한 상품은 한 번만 구매 가능합니다.');
    }
    
    // quantity 유효성 검사
    const finalQuantity = quantity !== undefined && quantity !== null ? parseInt(quantity) : 1;
    if (finalQuantity < 1) {
        throw new Error('quantity는 1 이상이어야 합니다');
    }
    
    // unit_price 유효성 검사
    const price = parseInt(unit_price);
    if (isNaN(price) || price < 0) {
        throw new Error('unit_price는 0 이상의 숫자여야 합니다');
    }
    
    const orderItem = await models.OrderItem.create({
        order_id: parseInt(order_id),
        product_id: parseInt(product_id),
        quantity: finalQuantity,
        unit_price: price,
        has_review: has_review !== undefined ? Boolean(has_review) : false
    });
    
    // 주문이 'completed' 상태인 경우 상품을 soldout으로 처리
    if (order.status === 'completed') {
        await models.Product.update(
            { soldout: true },
            { where: { id: parseInt(product_id) } }
        );
    }
    
    return orderItem.toJSON();
};

// 주문 아이템 업데이트
exports.updateOrderItem = async (id, { quantity, unit_price, has_review }) => {
    const orderItem = await models.OrderItem.findByPk(id);
    if (!orderItem) {
        throw new Error('주문 아이템을 찾을 수 없습니다');
    }
    
    const updateData = {};
    
    if (quantity !== undefined) {
        if (quantity === null) {
            updateData.quantity = 1;
        } else {
            const qty = parseInt(quantity);
            if (isNaN(qty) || qty < 1) {
                throw new Error('quantity는 1 이상이어야 합니다');
            }
            updateData.quantity = qty;
        }
    }
    
    if (unit_price !== undefined) {
        if (unit_price === null) {
            throw new Error('unit_price는 필수입니다');
        } else {
            const price = parseInt(unit_price);
            if (isNaN(price) || price < 0) {
                throw new Error('unit_price는 0 이상의 숫자여야 합니다');
            }
            updateData.unit_price = price;
        }
    }
    
    if (has_review !== undefined) {
        updateData.has_review = Boolean(has_review);
    }
    
    await orderItem.update(updateData);
    return orderItem.toJSON();
};

// 주문 아이템 삭제
exports.deleteOrderItem = async (id) => {
    const orderItem = await models.OrderItem.findByPk(id);
    if (!orderItem) {
        throw new Error('주문 아이템을 찾을 수 없습니다');
    }
    
    await orderItem.destroy();
    return true;
};

// 주문별 주문 아이템 총합 계산
exports.calculateOrderItemsTotal = async (orderId) => {
    const orderItems = await models.OrderItem.findAll({
        where: { order_id: parseInt(orderId) }
    });
    
    const total = orderItems.reduce((sum, item) => {
        return sum + (parseInt(item.quantity) || 1) * parseInt(item.unit_price);
    }, 0);
    
    return total;
};

