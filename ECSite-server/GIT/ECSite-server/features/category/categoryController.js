const categoryService = require("./categoryService");

// 전체 카테고리 목록
exports.getCategories = async (req, res) => {
    try {
        const categories = await categoryService.findAllCategories();
        res.json({ categories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "카테고리 목록 조회 실패" });
    }
};

// 특정 카테고리의 서브카테고리 목록
exports.getSubcategories = async (req, res) => {
    try {
        const subcategories = await categoryService.findSubcategories(req.params.id);
        res.json({ subcategories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서브카테고리 목록 조회 실패" });
    }
};

// 카테고리 생성
exports.createCategory = async (req, res) => {
    try {
        const { name, name_ja, description } = req.body;
        const category = await categoryService.createCategory({ name, name_ja, description });
        res.json({ category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "카테고리 생성 실패" });
    }
};

// 메인 페이지용: 카테고리 목록과 각 카테고리의 대표 상품
exports.getCategoriesWithFeaturedProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.productsLimit) || 4;
        const categories = await categoryService.findAllCategoriesWithFeaturedProducts(limit);
        res.json({ categories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "카테고리 및 대표 상품 조회 실패" });
    }
};

