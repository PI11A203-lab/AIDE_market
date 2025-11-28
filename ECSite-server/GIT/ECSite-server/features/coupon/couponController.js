const couponService = require("./couponService");

// 전체 쿠폰 목록 조회
exports.getAllCoupons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const activeOnly = req.query.activeOnly === 'true';
        
        const result = await couponService.findAllCoupons(page, limit, activeOnly);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "쿠폰 목록 조회 실패" });
    }
};

// ID로 쿠폰 조회
exports.getCouponById = async (req, res) => {
    try {
        const coupon = await couponService.findCouponById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ error: "쿠폰을 찾을 수 없습니다" });
        }
        res.json({ coupon });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "쿠폰 조회 실패" });
    }
};

// 쿠폰 코드로 조회
exports.getCouponByCode = async (req, res) => {
    try {
        const coupon = await couponService.findCouponByCode(req.params.code);
        if (!coupon) {
            return res.status(404).json({ error: "쿠폰을 찾을 수 없습니다" });
        }
        res.json({ coupon });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "쿠폰 조회 실패" });
    }
};

// 쿠폰 유효성 검사 및 할인 계산
exports.validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        
        if (!code || orderAmount === undefined || orderAmount === null) {
            return res.status(400).json({ error: "code와 orderAmount는 필수입니다" });
        }
        
        const result = await couponService.validateAndCalculateDiscount(code, orderAmount);
        res.json(result);
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('만료') || err.message.includes('비활성화') || err.message.includes('최소 주문')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "쿠폰 검증 실패" });
    }
};

// 쿠폰 생성
exports.createCoupon = async (req, res) => {
    try {
        const { code, discount_type, discount_value, max_discount, min_order, expires_at, is_active } = req.body;
        
        const coupon = await couponService.createCoupon({
            code,
            discount_type,
            discount_value,
            max_discount,
            min_order,
            expires_at,
            is_active
        });
        res.status(201).json({ coupon });
    } catch (err) {
        console.error(err);
        if (err.message.includes('필수') || err.message.includes('이미 존재') || err.message.includes('이어야 합니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "쿠폰 생성 실패" });
    }
};

// 쿠폰 업데이트
exports.updateCoupon = async (req, res) => {
    try {
        const { code, discount_type, discount_value, max_discount, min_order, expires_at, is_active } = req.body;
        
        const coupon = await couponService.updateCoupon(req.params.id, {
            code,
            discount_type,
            discount_value,
            max_discount,
            min_order,
            expires_at,
            is_active
        });
        res.json({ coupon });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이미 존재') || err.message.includes('이어야 합니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "쿠폰 업데이트 실패" });
    }
};

// 쿠폰 삭제
exports.deleteCoupon = async (req, res) => {
    try {
        await couponService.deleteCoupon(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "쿠폰 삭제 실패" });
    }
};

