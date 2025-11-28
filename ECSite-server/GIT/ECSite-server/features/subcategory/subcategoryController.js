const subcategoryService = require("./subcategoryService");

// 전체 서브카테고리 목록 조회
exports.getAllSubCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const categoryId = req.query.category_id || null;
        
        const result = await subcategoryService.findAllSubCategories(page, limit, categoryId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서브카테고리 목록 조회 실패" });
    }
};

// ID로 서브카테고리 조회
exports.getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await subcategoryService.findSubCategoryById(req.params.id);
        if (!subCategory) {
            return res.status(404).json({ error: "서브카테고리를 찾을 수 없습니다" });
        }
        res.json({ subcategory: subCategory });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서브카테고리 조회 실패" });
    }
};

// 카테고리별 서브카테고리 목록 조회
exports.getSubCategoriesByCategoryId = async (req, res) => {
    try {
        const subCategories = await subcategoryService.findSubCategoriesByCategoryId(req.params.categoryId);
        res.json({ subcategories: subCategories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "서브카테고리 목록 조회 실패" });
    }
};

// 서브카테고리 생성
exports.createSubCategory = async (req, res) => {
    try {
        const { category_id, name, tech_stack } = req.body;
        
        if (!category_id || !name) {
            return res.status(400).json({ error: "category_id와 name은 필수입니다" });
        }
        
        const subCategory = await subcategoryService.createSubCategory({
            category_id,
            name,
            tech_stack
        });
        res.status(201).json({ subcategory: subCategory });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이미')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "서브카테고리 생성 실패" });
    }
};

// 서브카테고리 업데이트
exports.updateSubCategory = async (req, res) => {
    try {
        const { category_id, name, tech_stack } = req.body;
        
        const subCategory = await subcategoryService.updateSubCategory(req.params.id, {
            category_id,
            name,
            tech_stack
        });
        res.json({ subcategory: subCategory });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이미')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "서브카테고리 업데이트 실패" });
    }
};

// 서브카테고리 삭제
exports.deleteSubCategory = async (req, res) => {
    try {
        await subcategoryService.deleteSubCategory(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('삭제할 수 없습니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "서브카테고리 삭제 실패" });
    }
};

