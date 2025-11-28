const teamCompositionService = require("./teamCompositionService");

// 사용자별 팀 구성 목록 조회
exports.getTeamCompositionsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await teamCompositionService.findAllTeamCompositionsByUserId(userId, page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "팀 구성 목록 조회 실패" });
    }
};

// 전체 팀 구성 목록 조회 (관리자용)
exports.getAllTeamCompositions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        const result = await teamCompositionService.findAllTeamCompositions(page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "팀 구성 목록 조회 실패" });
    }
};

// ID로 팀 구성 조회
exports.getTeamCompositionById = async (req, res) => {
    try {
        const teamComposition = await teamCompositionService.findTeamCompositionById(req.params.id);
        if (!teamComposition) {
            return res.status(404).json({ error: "팀 구성을 찾을 수 없습니다" });
        }
        res.json({ teamComposition });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "팀 구성 조회 실패" });
    }
};

// 팀 구성 생성
exports.createTeamComposition = async (req, res) => {
    try {
        const { user_id, name, total_synergy_score } = req.body;
        
        if (!user_id || !name) {
            return res.status(400).json({ error: "user_id와 name은 필수입니다" });
        }
        
        const teamComposition = await teamCompositionService.createTeamComposition({
            user_id,
            name,
            total_synergy_score
        });
        res.status(201).json({ teamComposition });
    } catch (err) {
        console.error(err);
        if (err.message.includes('필수')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "팀 구성 생성 실패" });
    }
};

// 팀 구성 업데이트
exports.updateTeamComposition = async (req, res) => {
    try {
        const { name, total_synergy_score } = req.body;
        
        const teamComposition = await teamCompositionService.updateTeamComposition(req.params.id, {
            name,
            total_synergy_score
        });
        res.json({ teamComposition });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "팀 구성 업데이트 실패" });
    }
};

// 팀 구성 삭제
exports.deleteTeamComposition = async (req, res) => {
    try {
        await teamCompositionService.deleteTeamComposition(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "팀 구성 삭제 실패" });
    }
};

