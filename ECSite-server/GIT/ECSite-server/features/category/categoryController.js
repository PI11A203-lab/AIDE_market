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

// ID로 카테고리 조회
exports.getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.findCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "카테고리를 찾을 수 없습니다" });
        }
        res.json({ category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "카테고리 조회 실패" });
    }
};

// 카테고리 생성
exports.createCategory = async (req, res) => {
    try {
        const { name, name_ja, description, parentId, category_id, tech_stack } = req.body;
        const category = await categoryService.createCategory({ 
            name, 
            name_ja, 
            description,
            parentId,
            category_id,
            tech_stack
        });
        res.status(201).json({ category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "카테고리 생성 실패" });
    }
};

// 카테고리 업데이트
exports.updateCategory = async (req, res) => {
    try {
        const { name, name_ja, description, parentId, category_id, tech_stack } = req.body;
        const category = await categoryService.updateCategory(req.params.id, {
            name,
            name_ja,
            description,
            parentId,
            category_id,
            tech_stack
        });
        res.json({ category });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "카테고리 업데이트 실패" });
    }
};

// 카테고리 삭제
exports.deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('삭제할 수 없습니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "카테고리 삭제 실패" });
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

