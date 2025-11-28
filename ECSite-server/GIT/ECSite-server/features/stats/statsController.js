const statsService = require("./statsService");

// 마켓플레이스 전체 통계
exports.getOverview = async (req, res) => {
    try {
        const stats = await statsService.getOverview();
        res.json({ stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "통계 조회 실패" });
    }
};

// 전체 Stats 목록 조회
exports.getAllStats = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await statsService.getAllStats(page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "통계 목록 조회 실패" });
    }
};

// 특정 Stats 조회 (ID로)
exports.getStatsById = async (req, res) => {
    try {
        const stats = await statsService.getStatsById(req.params.id);
        if (!stats) {
            return res.status(404).json({ error: "통계를 찾을 수 없습니다" });
        }
        res.json({ stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "통계 조회 실패" });
    }
};

// product_id로 Stats 조회
exports.getStatsByProductId = async (req, res) => {
    try {
        const stats = await statsService.getStatsByProductId(req.params.productId);
        if (!stats) {
            return res.status(404).json({ error: "통계를 찾을 수 없습니다" });
        }
        res.json({ stats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "통계 조회 실패" });
    }
};

// Stats 생성
exports.createStats = async (req, res) => {
    try {
        const stats = await statsService.createStats(req.body);
        res.status(201).json({ stats });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('존재합니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "통계 생성 실패" });
    }
};

// Stats 업데이트
exports.updateStats = async (req, res) => {
    try {
        const stats = await statsService.updateStats(req.params.id, req.body);
        res.json({ stats });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('존재합니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "통계 업데이트 실패" });
    }
};

// Stats 삭제
exports.deleteStats = async (req, res) => {
    try {
        await statsService.deleteStats(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "통계 삭제 실패" });
    }
};

// product_id로 Stats 생성 또는 업데이트 (upsert)
exports.upsertStatsByProductId = async (req, res) => {
    try {
        // productId는 req.params.id 또는 req.params.productId에서 가져올 수 있음
        const productId = req.params.productId || req.params.id;
        const stats = await statsService.upsertStatsByProductId(productId, req.body);
        res.json({ stats });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "통계 생성/업데이트 실패" });
    }
};

