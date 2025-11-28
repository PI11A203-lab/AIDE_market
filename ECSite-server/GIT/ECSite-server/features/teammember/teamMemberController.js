const teamMemberService = require("./teamMemberService");

// 팀별 멤버 목록 조회
exports.getTeamMembersByTeamId = async (req, res) => {
    try {
        const teamMembers = await teamMemberService.findAllTeamMembersByTeamId(req.params.teamId);
        res.json({ teamMembers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "팀 멤버 목록 조회 실패" });
    }
};

// ID로 팀 멤버 조회
exports.getTeamMemberById = async (req, res) => {
    try {
        const teamMember = await teamMemberService.findTeamMemberById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ error: "팀 멤버를 찾을 수 없습니다" });
        }
        res.json({ teamMember });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "팀 멤버 조회 실패" });
    }
};

// 팀 멤버 추가
exports.addTeamMember = async (req, res) => {
    try {
        const { team_id, product_id, category_id, position } = req.body;
        
        if (!team_id || !product_id) {
            return res.status(400).json({ error: "team_id와 product_id는 필수입니다" });
        }
        
        const teamMember = await teamMemberService.addTeamMember({
            team_id,
            product_id,
            category_id,
            position
        });
        res.status(201).json({ teamMember });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다') || err.message.includes('이미')) {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "팀 멤버 추가 실패" });
    }
};

// 팀 멤버 업데이트
exports.updateTeamMember = async (req, res) => {
    try {
        const { category_id, position } = req.body;
        
        const teamMember = await teamMemberService.updateTeamMember(req.params.id, {
            category_id,
            position
        });
        res.json({ teamMember });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "팀 멤버 업데이트 실패" });
    }
};

// 팀 멤버 삭제 (ID로)
exports.removeTeamMember = async (req, res) => {
    try {
        await teamMemberService.removeTeamMember(req.params.id);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "팀 멤버 삭제 실패" });
    }
};

// 팀 멤버 삭제 (team_id와 product_id로)
exports.removeTeamMemberByTeamAndProduct = async (req, res) => {
    try {
        const { teamId, productId } = req.params;
        await teamMemberService.removeTeamMemberByTeamIdAndProductId(teamId, productId);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        if (err.message.includes('찾을 수 없습니다')) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "팀 멤버 삭제 실패" });
    }
};

