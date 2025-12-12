const orderItemService = require("./orderItemService");

// 전체 주문 아이템 목록 조회
exports.getAllOrderItems = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const orderId = req.query.order_id || null;
        const productId = req.query.product_id || null;
        
        const result = await orderItemService.findAllOrderItems(page, limit, orderId, productId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 아이템 목록 조회 실패" });
    }
};

// 주문별 주문 아이템 목록 조회
exports.getOrderItemsByOrderId = async (req, res) => {
    try {
        const orderItems = await orderItemService.findOrderItemsByOrderId(req.params.orderId);
        res.json({ orderItems });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 아이템 목록 조회 실패" });
    }
};

// 상품별 주문 아이템 목록 조회
exports.getOrderItemsByProductId = async (req, res) => {
    try {
        const productId = req.params.productId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await orderItemService.findOrderItemsByProductId(productId, page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 아이템 목록 조회 실패" });
    }
};

// ID로 주문 아이템 조회
exports.getOrderItemById = async (req, res) => {
    try {
        const orderItem = await orderItemService.findOrderItemById(req.params.id);
        if (!orderItem) {
            return res.status(404).json({ error: "주문 아이템을 찾을 수 없습니다" });
        }
        res.json({ orderItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 아이템 조회 실패" });
    }
};

// 주문 아이템 생성
exports.createOrderItem = async (req, res) => {
    try {
        const { order_id, product_id, quantity, unit_price, has_review } = req.body;
        
        if (!order_id || !product_id || unit_price === undefined || unit_price === null) {
            return res.status(400).json({ error: "order_id, product_id, unit_price는 필수입니다" });
        }
        
        const orderItem = await orderItemService.createOrderItem({
            order_id,
            product_id,
            quantity,
            unit_price,
            has_review
        });
        res.status(201).json({ orderItem });
    } catch (err) {
        console.error('주문 아이템 생성 에러:', err);
        
        // 주문 아이템 생성 실패 시 주문 상태를 'pending'으로 변경
        const { order_id } = req.body;
        if (order_id) {
            try {
                const orderService = require('../order/orderService');
                await orderService.updateOrder(order_id, { status: 'pending' });
                console.log(`주문 ${order_id}의 상태를 'pending'으로 변경했습니다.`);
            } catch (updateErr) {
                console.error('주문 상태 업데이트 실패:', updateErr);
            }
        }
        
        if (err.message.includes('필수') || err.message.includes('찾을 수 없습니다') || err.message.includes('이어야 합니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "주문 아이템 생성 실패" });
    }
};

// 주문 아이템 업데이트
exports.updateOrderItem = async (req, res) => {
    try {
        const { quantity, unit_price, has_review } = req.body;
        
        const orderItem = await orderItemService.updateOrderItem(req.params.id, {
            quantity,
            unit_price,
            has_review
        });
        res.json({ orderItem });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이어야 합니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "주문 아이템 업데이트 실패" });
    }
};

// 주문 아이템 삭제
exports.deleteOrderItem = async (req, res) => {
    try {
        await orderItemService.deleteOrderItem(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "주문 아이템 삭제 실패" });
    }
};

// 주문별 주문 아이템 총합 계산
exports.getOrderItemsTotal = async (req, res) => {
    try {
        const total = await orderItemService.calculateOrderItemsTotal(req.params.orderId);
        res.json({ total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 아이템 총합 계산 실패" });
    }
};

