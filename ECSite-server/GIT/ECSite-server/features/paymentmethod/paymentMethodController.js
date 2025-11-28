const paymentMethodService = require("./paymentMethodService");

// 사용자별 결제방법 목록 조회
exports.getByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const paymentMethods = await paymentMethodService.findByUserId(userId);
        res.json({ paymentMethods });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "결제방법 목록 조회 실패" });
    }
};

// ID로 결제방법 조회
exports.getById = async (req, res) => {
    try {
        const paymentMethod = await paymentMethodService.findById(req.params.id);
        if (!paymentMethod) {
            return res.status(404).json({ error: "결제방법을 찾을 수 없습니다" });
        }
        res.json({ paymentMethod });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "결제방법 조회 실패" });
    }
};

// 결제방법 생성
exports.createPaymentMethod = async (req, res) => {
    try {
        const { user_id, payment_method, card_company, card_number, card_cvc, exp_month, exp_year, is_default } = req.body;
        
        if (!user_id) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }
        
        const paymentMethod = await paymentMethodService.createPaymentMethod({
            user_id,
            payment_method,
            card_company,
            card_number,
            card_cvc,
            exp_month,
            exp_year,
            is_default
        });
        
        res.status(201).json({ paymentMethod });
    } catch (err) {
        console.error(err);
        if (err.message.includes('필수')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "결제방법 생성 실패" });
    }
};

// 결제방법 업데이트
exports.updatePaymentMethod = async (req, res) => {
    try {
        const { card_company, card_number, card_cvc, exp_month, exp_year, is_default } = req.body;
        
        const paymentMethod = await paymentMethodService.updatePaymentMethod(req.params.id, {
            card_company,
            card_number,
            card_cvc,
            exp_month,
            exp_year,
            is_default
        });
        
        res.json({ paymentMethod });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "결제방법 업데이트 실패" });
    }
};

// 결제방법 삭제
exports.deletePaymentMethod = async (req, res) => {
    try {
        await paymentMethodService.deletePaymentMethod(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "결제방법 삭제 실패" });
    }
};

