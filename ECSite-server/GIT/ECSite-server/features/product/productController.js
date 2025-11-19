const productService = require("./productService");

// 전체 상품 목록 (페이지네이션 + 필터 + 정렬)
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

// 상품 상세 정보 (stats + tags + synergies 포함)
exports.getProductById = async (req, res) => {
    try {
        const result = await productService.findProductById(req.params.id);
        if (!result) {
            return res.status(404).json({ error: "상품을 찾을 수 없습니다" });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "상품 조회 실패" });
    }
};

// 상품 통계 조회
exports.getProductStats = async (req, res) => {
    try {
        const stats = await productService.getProductStats(req.params.id);
        if (!stats) {
            return res.status(404).json({ error: "통계를 찾을 수 없습니다" });
        }
        res.json({ stats });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "통계 조회 실패" });
    }
};

// 상품 시너지 조회
exports.getProductSynergies = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const synergies = await productService.getProductSynergies(req.params.id, limit);
        res.json({ synergies });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "시너지 조회 실패" });
    }
};

// 카테고리별 상품 목록
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { subcategory, page, limit, sort } = req.query;
        const result = await productService.getProductsByCategory(categoryId, {
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

// 태그별 상품 목록
exports.getProductsByTag = async (req, res) => {
    try {
        const { tagId } = req.params;
        const { page, limit } = req.query;
        const result = await productService.getProductsByTag(tagId, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "태그별 상품 조회 실패" });
    }
};

// 상품 생성
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

// 상품 구매
exports.purchaseProduct = async (req, res) => {
    try {
        await productService.markAsSoldOut(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "구매 처리 실패" });
    }
};

// 카테고리별 대표 상품 조회 (메인 페이지용)
exports.getFeaturedProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const limit = parseInt(req.query.limit) || 4;
        const products = await productService.getFeaturedProductsByCategory(categoryId, limit);
        res.json({ products });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "대표 상품 조회 실패" });
    }
};