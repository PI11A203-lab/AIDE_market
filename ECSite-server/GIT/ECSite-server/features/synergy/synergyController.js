const synergyService = require("./synergyService");

// 상품별 시너지 목록 조회
exports.getSynergiesByProductId = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        
        const synergies = await synergyService.findSynergiesByProductId(productId, limit);
        res.json({ synergies });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "시너지 목록 조회 실패" });
    }
};

// ID로 시너지 조회
exports.getSynergyById = async (req, res) => {
    try {
        const synergy = await synergyService.findSynergyById(req.params.id);
        if (!synergy) {
            return res.status(404).json({ error: "시너지를 찾을 수 없습니다" });
        }
        res.json({ synergy });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "시너지 조회 실패" });
    }
};

// 시너지 생성
exports.createSynergy = async (req, res) => {
    try {
        const productId = parseInt(req.body.product_id);
        const relatedProductId = parseInt(req.body.related_product_id);
        const synergyScore = req.body.synergy_score !== undefined ? parseInt(req.body.synergy_score) : 80;
        const synergyDescription = req.body.synergy_description || null;
        
        if (!productId || !relatedProductId) {
            return res.status(400).json({ error: "product_id와 related_product_id는 필수입니다" });
        }
        
        const synergy = await synergyService.createSynergy(productId, relatedProductId, synergyScore, synergyDescription);
        res.status(201).json({ synergy });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이미') || err.message.includes('같은')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "시너지 생성 실패" });
    }
};

// 시너지 업데이트
exports.updateSynergy = async (req, res) => {
    try {
        const synergyId = parseInt(req.params.id);
        const synergyScore = req.body.synergy_score !== undefined ? parseInt(req.body.synergy_score) : undefined;
        const synergyDescription = req.body.synergy_description !== undefined ? req.body.synergy_description : undefined;
        
        const synergy = await synergyService.updateSynergy(synergyId, { synergy_score: synergyScore, synergy_description: synergyDescription });
        res.json({ synergy });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('시너지 점수는')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "시너지 업데이트 실패" });
    }
};

// 시너지 삭제
exports.deleteSynergy = async (req, res) => {
    try {
        await synergyService.deleteSynergy(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "시너지 삭제 실패" });
    }
};

