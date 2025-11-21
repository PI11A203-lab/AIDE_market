const productService = require("../services/productService");

// 全商品一覧 (ページネーション + フィルタ + ソート)
exports.getProducts = async (req, res) => {
    try {
        const { page, limit, category, subcategory, search, sort } = req.query;
        const result = await productService.findAllProducts({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            category,
            subcategory,
            search,
            sort
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "상품 목록 조회 실패" });
    }
};

// 商品作成
exports.createProduct = async (req, res) => {
    const { name, description, price, seller, imageUrl, category_id, sub_category_id } = req.body;
    if (!name || !description || !price || !seller || !imageUrl) {
        return res.status(400).json({ error: "모든 필수 필드를 입력해주세요" });
    }

    try {
        const result = await productService.createProduct({
            name,
            description,
            price,
            seller,
            imageUrl,
            category_id,
            sub_category_id
        });
        res.json({ result });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "상품 생성 실패" });
    }
};
