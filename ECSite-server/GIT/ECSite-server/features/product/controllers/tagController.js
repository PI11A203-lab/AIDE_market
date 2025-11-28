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

// 상품의 태그 목록 조회
exports.getTagsByProductId = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const tags = await tagService.getTagsByProductId(productId);
        res.json({ tags });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "태그 목록 조회 실패" });
    }
};

// 상품에 태그 추가
exports.addTagToProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const tagId = parseInt(req.body.tag_id || req.params.tagId);
        
        if (!tagId) {
            return res.status(400).json({ error: "tag_id는 필수입니다" });
        }
        
        await tagService.addTagToProduct(productId, tagId);
        res.status(201).json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이미')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "태그 추가 실패" });
    }
};

// 상품에서 태그 제거
exports.removeTagFromProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const tagId = parseInt(req.params.tagId || req.body.tag_id);
        
        if (!tagId) {
            return res.status(400).json({ error: "tag_id는 필수입니다" });
        }
        
        await tagService.removeTagFromProduct(productId, tagId);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "태그 제거 실패" });
    }
};