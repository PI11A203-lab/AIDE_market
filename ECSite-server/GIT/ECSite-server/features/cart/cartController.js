const cartService = require("./cartService");

// 사용자별 장바구니 조회
exports.getCartByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        if (!userId) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }

        const result = await cartService.getCartByUserId(userId);
        res.json(result);
    } catch (err) {
        console.error('장바구니 조회 실패:', err);
        res.status(500).json({ error: "장바구니 조회 실패" });
    }
};

// 장바구니에 상품 추가
exports.addToCart = async (req, res) => {
    try {
        const userId = parseInt(req.body.user_id);
        const productId = parseInt(req.body.product_id);
        const quantity = parseInt(req.body.quantity) || 1;

        if (!userId || !productId) {
            return res.status(400).json({ error: "user_id와 product_id는 필수입니다" });
        }

        const cartItem = await cartService.addToCart(userId, productId, quantity);
        res.status(201).json({ cartItem });
    } catch (err) {
        console.error('장바구니 추가 실패:', err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "장바구니 추가 실패" });
    }
};

// 장바구니에서 상품 제거
exports.removeFromCart = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const productId = parseInt(req.params.productId);

        if (!userId || !productId) {
            return res.status(400).json({ error: "user_id와 product_id는 필수입니다" });
        }

        await cartService.removeFromCart(userId, productId);
        res.json({ result: true });
    } catch (err) {
        console.error('장바구니 제거 실패:', err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "장바구니 제거 실패" });
    }
};

// 장바구니 아이템 수량 변경
exports.updateCartItemQuantity = async (req, res) => {
    try {
        const userId = parseInt(req.body.user_id);
        const productId = parseInt(req.body.product_id);
        const quantity = parseInt(req.body.quantity);

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ error: "user_id, product_id, quantity는 필수입니다" });
        }

        const cartItem = await cartService.updateCartItemQuantity(userId, productId, quantity);
        res.json({ cartItem });
    } catch (err) {
        console.error('장바구니 수량 변경 실패:', err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('없습니다') || err.message.includes('1 이상')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "장바구니 수량 변경 실패" });
    }
};

// 장바구니 비우기
exports.clearCart = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        if (!userId) {
            return res.status(400).json({ error: "user_id는 필수입니다" });
        }

        await cartService.clearCart(userId);
        res.json({ result: true });
    } catch (err) {
        console.error('장바구니 비우기 실패:', err);
        res.status(500).json({ error: "장바구니 비우기 실패" });
    }
};

