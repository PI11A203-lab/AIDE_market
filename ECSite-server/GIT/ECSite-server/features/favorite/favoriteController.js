const favoriteService = require("./favoriteService");

// 사용자별 즐겨찾기 목록 조회
exports.getFavoritesByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await favoriteService.findFavoritesByUserId(userId, page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "즐겨찾기 목록 조회 실패" });
    }
};

// 즐겨찾기 추가
exports.createFavorite = async (req, res) => {
    try {
        const userId = parseInt(req.body.user_id);
        const productId = parseInt(req.body.product_id);
        const categoryId = req.body.category_id ? parseInt(req.body.category_id) : null;
        
        if (!userId || !productId) {
            return res.status(400).json({ error: "user_id와 product_id는 필수입니다" });
        }
        
        const favorite = await favoriteService.createFavorite(userId, productId, categoryId);
        res.status(201).json({ favorite });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이미')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "즐겨찾기 추가 실패" });
    }
};

// 즐겨찾기 삭제
exports.deleteFavorite = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const productId = parseInt(req.params.productId);
        
        await favoriteService.deleteFavorite(userId, productId);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "즐겨찾기 삭제 실패" });
    }
};

// 특정 상품이 즐겨찾기에 있는지 확인
exports.checkFavorite = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const productId = parseInt(req.params.productId);
        
        const isFavorite = await favoriteService.isFavorite(userId, productId);
        res.json({ isFavorite });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "즐겨찾기 확인 실패" });
    }
};

// ID로 즐겨찾기 조회
exports.getFavoriteById = async (req, res) => {
    try {
        const favorite = await favoriteService.findFavoriteById(req.params.id);
        if (!favorite) {
            return res.status(404).json({ error: "즐겨찾기를 찾을 수 없습니다" });
        }
        res.json({ favorite });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "즐겨찾기 조회 실패" });
    }
};

