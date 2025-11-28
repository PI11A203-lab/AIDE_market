const orderCouponService = require("./orderCouponService");

// 전체 주문 쿠폰 목록 조회
exports.getAllOrderCoupons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const orderId = req.query.order_id || null;
        const userId = req.query.user_id || null;
        const couponId = req.query.coupon_id || null;
        
        const result = await orderCouponService.findAllOrderCoupons(page, limit, orderId, userId, couponId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 쿠폰 목록 조회 실패" });
    }
};

// 주문별 주문 쿠폰 목록 조회
exports.getOrderCouponsByOrderId = async (req, res) => {
    try {
        const orderCoupons = await orderCouponService.findOrderCouponsByOrderId(req.params.orderId);
        res.json({ orderCoupons });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 쿠폰 목록 조회 실패" });
    }
};

// 사용자별 주문 쿠폰 목록 조회
exports.getOrderCouponsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await orderCouponService.findOrderCouponsByUserId(userId, page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 쿠폰 목록 조회 실패" });
    }
};

// 쿠폰별 주문 쿠폰 목록 조회
exports.getOrderCouponsByCouponId = async (req, res) => {
    try {
        const couponId = req.params.couponId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await orderCouponService.findOrderCouponsByCouponId(couponId, page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 쿠폰 목록 조회 실패" });
    }
};

// ID로 주문 쿠폰 조회
exports.getOrderCouponById = async (req, res) => {
    try {
        const orderCoupon = await orderCouponService.findOrderCouponById(req.params.id);
        if (!orderCoupon) {
            return res.status(404).json({ error: "주문 쿠폰을 찾을 수 없습니다" });
        }
        res.json({ orderCoupon });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "주문 쿠폰 조회 실패" });
    }
};

// 주문 쿠폰 생성
exports.createOrderCoupon = async (req, res) => {
    try {
        const { order_id, user_id, coupon_id, applied_value } = req.body;
        
        if (!order_id || !user_id || !coupon_id || applied_value === undefined || applied_value === null) {
            return res.status(400).json({ error: "order_id, user_id, coupon_id, applied_value는 필수입니다" });
        }
        
        const orderCoupon = await orderCouponService.createOrderCoupon({
            order_id,
            user_id,
            coupon_id,
            applied_value
        });
        res.status(201).json({ orderCoupon });
    } catch (err) {
        console.error(err);
        if (err.message.includes('필수') || err.message.includes('찾을 수 없습니다') || err.message.includes('일치하지 않습니다') || err.message.includes('이미') || err.message.includes('이어야 합니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "주문 쿠폰 생성 실패" });
    }
};

// 주문 쿠폰 업데이트
exports.updateOrderCoupon = async (req, res) => {
    try {
        const { applied_value } = req.body;
        
        const orderCoupon = await orderCouponService.updateOrderCoupon(req.params.id, {
            applied_value
        });
        res.json({ orderCoupon });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이어야 합니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "주문 쿠폰 업데이트 실패" });
    }
};

// 주문 쿠폰 삭제
exports.deleteOrderCoupon = async (req, res) => {
    try {
        await orderCouponService.deleteOrderCoupon(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "주문 쿠폰 삭제 실패" });
    }
};

