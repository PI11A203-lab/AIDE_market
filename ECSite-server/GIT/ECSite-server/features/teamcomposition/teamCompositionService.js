const models = require("../../db/initializer");

// 사용자별 팀 구성 목록 조회
exports.findAllTeamCompositionsByUserId = async (userId, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await models.TeamComposition.findAndCountAll({
        where: { user_id: parseInt(userId) },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
    });
    
    return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        teamCompositions: rows.map(tc => tc.toJSON())
    };
};

// 전체 팀 구성 목록 조회 (관리자용)
exports.findAllTeamCompositions = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await models.TeamComposition.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
    });
    
    return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        teamCompositions: rows.map(tc => tc.toJSON())
    };
};

// ID로 팀 구성 조회
exports.findTeamCompositionById = async (id) => {
    const teamComposition = await models.TeamComposition.findByPk(id);
    
    if (!teamComposition) {
        return null;
    }
    
    return teamComposition.toJSON();
};

// 팀 구성 생성
exports.createTeamComposition = async ({ user_id, name, total_synergy_score = 0 }) => {
    if (!user_id || !name) {
        throw new Error('user_id와 name은 필수입니다');
    }
    
    const teamComposition = await models.TeamComposition.create({
        user_id: parseInt(user_id),
        name: name,
        total_synergy_score: total_synergy_score || 0
    });
    
    return teamComposition.toJSON();
};

// 팀 구성 업데이트
exports.updateTeamComposition = async (id, { name, total_synergy_score }) => {
    const teamComposition = await models.TeamComposition.findByPk(id);
    if (!teamComposition) {
        throw new Error('팀 구성을 찾을 수 없습니다');
    }
    
    const updateData = {};
    
    if (name !== undefined) {
        updateData.name = name;
    }
    
    if (total_synergy_score !== undefined) {
        updateData.total_synergy_score = parseInt(total_synergy_score) || 0;
    }
    
    await teamComposition.update(updateData);
    return teamComposition.toJSON();
};

// 팀 구성 삭제
exports.deleteTeamComposition = async (id) => {
    const teamComposition = await models.TeamComposition.findByPk(id);
    if (!teamComposition) {
        throw new Error('팀 구성을 찾을 수 없습니다');
    }
    
    // team_members는 CASCADE로 자동 삭제됨
    await teamComposition.destroy();
    return true;
};

// 사용자별 팀 구성 개수 조회
exports.countTeamCompositionsByUserId = async (userId) => {
    return await models.TeamComposition.count({
        where: { user_id: parseInt(userId) }
    });
};

