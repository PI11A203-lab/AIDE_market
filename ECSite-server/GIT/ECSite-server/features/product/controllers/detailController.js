const detailService = require("../services/detailService");

// 商品詳細情報 (stats + tags + synergies 含む)
exports.getProductById = async (req, res) => {
    try {
        const result = await detailService.findProductById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: "상품을 찾을 수 없습니다" });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "상품 조회 실패" });
    }
};

// 商品統計取得
exports.getProductStats = async (req, res) => {
    try {
        const stats = await detailService.getProductStats(req.params.id);
        if (!stats) {
            return res.status(404).json({ error: "통계를 찾을 수 없습니다" });
        }
        res.json({ stats });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "통계 조회 실패" });
    }
};

// 商品シナジー取得
exports.getProductSynergies = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const synergies = await detailService.getProductSynergies(req.params.id, limit);
        res.json({ synergies });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "시너지 조회 실패" });
    }
};

// 商品購入
exports.purchaseProduct = async (req, res) => {
    try {
        await detailService.markAsSoldOut(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "구매 처리 실패" });
    }
};
