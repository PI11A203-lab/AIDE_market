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
    let createdOrderId = null;
    try {
        const { user_id, total_amount, payment_id, status, is_recurring, is_first_payment, subscription_id, parent_order_id } = req.body;
        
        console.log('주문 생성 요청:', { user_id, total_amount, payment_id, status, is_recurring, is_first_payment, subscription_id, parent_order_id });
        
        if (!user_id || total_amount === undefined || total_amount === null) {
            return res.status(400).json({ error: "user_id와 total_amount는 필수입니다" });
        }
        
        const order = await orderService.createOrder({
            user_id,
            total_amount,
            payment_id,
            status,
            is_recurring,
            is_first_payment,
            subscription_id,
            parent_order_id
        });
        
        createdOrderId = order.id;
        
        // 주문 완료 이메일 발송 (비동기 처리, 실패해도 주문은 성공)
        try {
            const emailService = require('../user/emailService');
            const user = order.user;
            if (user && user.email) {
                const baseUrl = req.protocol + '://' + req.get('host');
                emailService.sendOrderConfirmationEmail(order, user, baseUrl).catch(err => {
                    console.error('주문 완료 이메일 발송 실패 (주문은 성공):', err);
                });
            }
        } catch (emailErr) {
            console.error('이메일 발송 초기화 실패 (주문은 성공):', emailErr);
        }
        
        res.status(201).json({ order });
    } catch (err) {
        console.error('주문 생성 에러:', err);
        console.error('에러 스택:', err.stack);
        
        // 주문이 생성되었지만 에러가 발생한 경우 상태를 'pending'으로 변경
        if (createdOrderId) {
            try {
                await orderService.updateOrder(createdOrderId, { status: 'pending' });
                console.log(`주문 ${createdOrderId}의 상태를 'pending'으로 변경했습니다.`);
            } catch (updateErr) {
                console.error('주문 상태 업데이트 실패:', updateErr);
            }
        }
        
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
