const paymentMethodService = require("./paymentMethodService");

// 사용자별 결제수단 목록 조회
exports.getByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const paymentMethods = await paymentMethodService.findByUserId(userId);
        res.json({ paymentMethods });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "결제수단 목록 조회 실패" });
    }
};

// ID로 결제수단 조회
exports.getById = async (req, res) => {
    try {
        const paymentMethod = await paymentMethodService.findById(req.params.id);
        if (!paymentMethod) {
            return res.status(404).json({ error: "결제수단을 찾을 수 없습니다" });
        }
        res.json({ paymentMethod });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "결제수단 조회 실패" });
    }
};

// 결제수단 등록
exports.createPaymentMethod = async (req, res) => {
    try {
        const { user_id, payment_method, card_company, card_holder, card_number, cvc, exp_month, exp_year, is_default } = req.body;
        
        console.log('결제수단 등록 요청:', {
            user_id,
            payment_method,
            card_company,
            has_card_number: !!card_number,
            has_cvc: !!cvc,
            exp_month,
            exp_year
        });
        
        if (!user_id) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }
        
        const paymentMethod = await paymentMethodService.createPaymentMethod({
            user_id,
            payment_method,
            card_company,
            card_holder,
            card_number,
            cvc,
            exp_month,
            exp_year,
            is_default
        });
        
        res.status(201).json({ paymentMethod });
    } catch (err) {
        console.error('결제수단 등록 에러:', err);
        console.error('에러 스택:', err.stack);
        if (err.message.includes('필수') || err.message.includes('찾을 수 없습니다') || err.message.includes('암호화')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "결제수단 등록 실패: " + (err.message || '알 수 없는 오류') });
    }
};

// 결제수단 업데이트
exports.updatePaymentMethod = async (req, res) => {
    try {
        const { card_company, card_holder, card_number, cvc, exp_month, exp_year, is_default } = req.body;
        
        const paymentMethod = await paymentMethodService.updatePaymentMethod(req.params.id, {
            card_company,
            card_holder,
            card_number,
            cvc,
            exp_month,
            exp_year,
            is_default
        });
        
        res.json({ paymentMethod });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('필수') || err.message.includes('암호화')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "결제수단 업데이트 실패" });
    }
};

// 결제수단 삭제
exports.deletePaymentMethod = async (req, res) => {
    try {
        await paymentMethodService.deletePaymentMethod(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error('결제수단 삭제 에러:', err);
        console.error('에러 스택:', err.stack);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        if (err.message.includes('최소 하나의 결제수단')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message || "결제수단 삭제 실패" });
    }
};
