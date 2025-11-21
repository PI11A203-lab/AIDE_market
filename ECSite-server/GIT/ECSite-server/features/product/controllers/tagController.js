const tagService = require("../services/tagService");

// タグ別商品一覧
exports.getProductsByTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const { page, limit } = req.query;
        const result = await tagService.getProductsByTag(tagId, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "태그별 상품 조회 실패" });
    }
};
