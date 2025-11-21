const categoryService = require("../services/categoryService");

// カテゴリ別商品一覧
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { subcategory, page, limit, sort } = req.query;
        const result = await categoryService.getProductsByCategory(categoryId, {
            subcategory,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "카테고리별 상품 조회 실패" });
    }
};

// カテゴリ別代表商品取得 (メインページ用)
exports.getFeaturedProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const limit = parseInt(req.query.limit) || 4;
        const products = await categoryService.getFeaturedProductsByCategory(categoryId, limit);
        res.json({ products });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "대표 상품 조회 실패" });
    }
};
