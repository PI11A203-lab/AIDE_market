const orderService = require("./orderService");

// 전체 주문 목록 조회
exports.getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const userId = req.query.user_id || null;
        const status = req.query.status || null;
        
        const result = await orderService.findAllOrders(page, limit, userId, status);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 목록 조회 실패" });
    }
};

// 사용자별 주문 목록 조회
exports.getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await orderService.findOrdersByUserId(userId, page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 목록 조회 실패" });
    }
};

// ID로 주문 조회
exports.getOrderById = async (req, res) => {
    try {
        const order = await orderService.findOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "주문을 찾을 수 없습니다" });
        }
        res.json({ order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 조회 실패" });
    }
};

// 주문 번호로 주문 조회
exports.getOrderByOrderNumber = async (req, res) => {
    try {
        const order = await orderService.findOrderByOrderNumber(req.params.orderNumber);
        if (!order) {
            return res.status(404).json({ error: "주문을 찾을 수 없습니다" });
        }
        res.json({ order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 조회 실패" });
    }
};

// 주문 생성
exports.createOrder = async (req, res) => {
    try {
        const { user_id, total_amount, payment_id, status } = req.body;
        
        console.log('주문 생성 요청:', { user_id, total_amount, payment_id, status });
        
        if (!user_id || total_amount === undefined || total_amount === null) {
            return res.status(400).json({ error: "user_id와 total_amount는 필수입니다" });
        }
        
        const order = await orderService.createOrder({
            user_id,
            total_amount,
            payment_id,
            status
        });
        res.status(201).json({ order });
    } catch (err) {
        console.error('주문 생성 에러:', err);
        console.error('에러 스택:', err.stack);
        if (err.message.includes('필수') || err.message.includes('찾을 수 없습니다') || err.message.includes('이어야 합니다') || err.message.includes('사용자의 것이 아닙니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message || "주문 생성 실패: " + err.toString() });
    }
};

// 주문 업데이트
exports.updateOrder = async (req, res) => {
    try {
        const { status, payment_id } = req.body;
        
        const order = await orderService.updateOrder(req.params.id, {
            status,
            payment_id
        });
        res.json({ order });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이어야 합니다') || err.message.includes('사용자의 것이 아닙니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "주문 업데이트 실패" });
    }
};

// 주문 삭제
exports.deleteOrder = async (req, res) => {
    try {
        await orderService.deleteOrder(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "주문 삭제 실패" });
    }
};
