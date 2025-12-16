const productService = require("../services/productService");

// 全商品一覧 (ページネーション + フィルタ + ソート)
exports.getProducts = async (req, res) => {
    try {
        const { page, limit, category, subcategory, search, sort, user_id } = req.query;
        
        // 디버깅: 요청 파라미터 확인
        console.log('상품 목록 요청 파라미터:', { page, limit, category, subcategory, search, sort, user_id });
        
        const result = await productService.findAllProducts({
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            category,
            subcategory,
            search,
            sort: sort || 'download', // 기본값 명시
            user_id: user_id || null
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "상품 목록 조회 실패" });
    }
};

// 商品作成
exports.createProduct = async (req, res) => {
    const { name, description, price, seller, imageUrl, category_id, sub_category_id, tech_stack } = req.body;
    if (!name || !description || !price || !seller) {
        return res.status(400).json({ error: "name, description, price, seller는 필수 필드입니다" });
    }

    try {
        const result = await productService.createProduct({
            name,
            description,
            price,
            seller,
            imageUrl,
            category_id,
            sub_category_id,
            tech_stack
        });
        res.status(201).json({ product: result });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "상품 생성 실패" });
    }
};

// 상품 업데이트
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, seller, imageUrl, category_id, sub_category_id, tech_stack, soldout, download_count, view_count } = req.body;
        
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        if (seller !== undefined) updateData.seller = seller;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (category_id !== undefined) updateData.category_id = category_id;
        if (sub_category_id !== undefined) updateData.sub_category_id = sub_category_id;
        if (tech_stack !== undefined) updateData.tech_stack = tech_stack;
        if (soldout !== undefined) updateData.soldout = soldout;
        if (download_count !== undefined) updateData.download_count = download_count;
        if (view_count !== undefined) updateData.view_count = view_count;
        
        const product = await productService.updateProduct(id, updateData);
        res.json({ product });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "상품 업데이트 실패" });
    }
};

// 상품 삭제
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await productService.deleteProduct(id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "상품 삭제 실패" });
    }
};
