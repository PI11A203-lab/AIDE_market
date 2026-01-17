const templateService = require("./templateService");

// 전체 템플릿 목록 조회
exports.getTemplates = async (req, res) => {
    try {
        const { limit, search } = req.query;
        let templates = await templateService.findAllTemplates();
        
        // 검색 필터링
        if (search) {
            const searchLower = search.toLowerCase();
            templates = templates.filter(t => 
                t.name.toLowerCase().includes(searchLower) ||
                t.description.toLowerCase().includes(searchLower)
            );
        }
        
        // limit 적용
        if (limit) {
            templates = templates.slice(0, parseInt(limit));
        }
        
        res.json({ templates });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "템플릿 목록 조회 실패" });
    }
};

// ID로 템플릿 상세 조회
exports.getTemplateById = async (req, res) => {
    try {
        const template = await templateService.findTemplateById(req.params.id);
        if (!template) {
            return res.status(404).json({ error: "템플릿을 찾을 수 없습니다" });
        }
        res.json({ template });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "템플릿 조회 실패" });
    }
};

// 상품이 포함된 템플릿 목록 조회
exports.getTemplatesByProduct = async (req, res) => {
    try {
        const templates = await templateService.findTemplatesByProductId(req.params.productId);
        res.json({ templates });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "템플릿 목록 조회 실패" });
    }
};
