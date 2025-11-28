const models = require("../../db/initializer");

// 팀별 멤버 목록 조회
exports.findAllTeamMembersByTeamId = async (teamId) => {
    const teamMembers = await models.TeamMember.findAll({
        where: { team_id: parseInt(teamId) },
        order: [['position', 'ASC'], ['added_at', 'ASC']],
        include: [
            {
                model: models.Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'seller', 'imageUrl', 'description', 'category_id', 'sub_category_id', 'rating_average', 'rating_count']
            },
            {
                model: models.Category,
                as: 'category',
                attributes: ['id', 'name', 'name_ja'],
                required: false
            }
        ]
    });
    
    return teamMembers.map(tm => tm.toJSON());
};

// ID로 팀 멤버 조회
exports.findTeamMemberById = async (id) => {
    const teamMember = await models.TeamMember.findByPk(id, {
        include: [
            {
                model: models.Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'seller', 'imageUrl', 'description']
            },
            {
                model: models.Category,
                as: 'category',
                attributes: ['id', 'name', 'name_ja'],
                required: false
            }
        ]
    });
    
    if (!teamMember) {
        return null;
    }
    
    return teamMember.toJSON();
};

// 팀 멤버 추가
exports.addTeamMember = async ({ team_id, product_id, category_id = null, position = null }) => {
    if (!team_id || !product_id) {
        throw new Error('team_id와 product_id는 필수입니다');
    }
    
    // 팀 구성 존재 확인
    const team = await models.TeamComposition.findByPk(team_id);
    if (!team) {
        throw new Error('팀 구성을 찾을 수 없습니다');
    }
    
    // 상품 존재 확인
    const product = await models.Product.findByPk(product_id);
    if (!product) {
        throw new Error('상품을 찾을 수 없습니다');
    }
    
    // 카테고리 확인 (제공된 경우)
    if (category_id) {
        const category = await models.Category.findByPk(category_id);
        if (!category) {
            throw new Error('카테고리를 찾을 수 없습니다');
        }
    }
    
    // 중복 확인 (unique constraint)
    const existing = await models.TeamMember.findOne({
        where: {
            team_id: parseInt(team_id),
            product_id: parseInt(product_id)
        }
    });
    
    if (existing) {
        throw new Error('이미 해당 상품이 팀에 추가되어 있습니다');
    }
    
    // position이 제공되지 않은 경우, 현재 팀의 최대 position + 1
    let finalPosition = position;
    if (finalPosition === null || finalPosition === undefined) {
        const maxPosition = await models.TeamMember.max('position', {
            where: { team_id: parseInt(team_id) }
        });
        finalPosition = (maxPosition || 0) + 1;
    }
    
    const teamMember = await models.TeamMember.create({
        team_id: parseInt(team_id),
        product_id: parseInt(product_id),
        category_id: category_id ? parseInt(category_id) : null,
        position: finalPosition
    });
    
    return teamMember.toJSON();
};

// 팀 멤버 업데이트
exports.updateTeamMember = async (id, { category_id, position }) => {
    const teamMember = await models.TeamMember.findByPk(id);
    if (!teamMember) {
        throw new Error('팀 멤버를 찾을 수 없습니다');
    }
    
    const updateData = {};
    
    if (category_id !== undefined) {
        if (category_id === null) {
            updateData.category_id = null;
        } else {
            const category = await models.Category.findByPk(category_id);
            if (!category) {
                throw new Error('카테고리를 찾을 수 없습니다');
            }
            updateData.category_id = parseInt(category_id);
        }
    }
    
    if (position !== undefined) {
        updateData.position = position !== null ? parseInt(position) : null;
    }
    
    await teamMember.update(updateData);
    return teamMember.toJSON();
};

// 팀 멤버 삭제
exports.removeTeamMember = async (id) => {
    const teamMember = await models.TeamMember.findByPk(id);
    if (!teamMember) {
        throw new Error('팀 멤버를 찾을 수 없습니다');
    }
    
    await teamMember.destroy();
    return true;
};

// 팀에서 특정 상품 제거 (team_id와 product_id로)
exports.removeTeamMemberByTeamIdAndProductId = async (teamId, productId) => {
    const teamMember = await models.TeamMember.findOne({
        where: {
            team_id: parseInt(teamId),
            product_id: parseInt(productId)
        }
    });
    
    if (!teamMember) {
        throw new Error('팀 멤버를 찾을 수 없습니다');
    }
    
    await teamMember.destroy();
    return true;
};

// 팀 멤버 개수 조회
exports.countTeamMembersByTeamId = async (teamId) => {
    return await models.TeamMember.count({
        where: { team_id: parseInt(teamId) }
    });
};

