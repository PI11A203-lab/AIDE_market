const models = require("../../db/initializer");
const { Op } = require("sequelize");

// 전체 사용자 목록 조회
exports.findAllUsers = async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await models.User.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password_hash'] } // 비밀번호 제외
    });
    
    return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
        users: rows.map(user => user.toJSON())
    };
};

// ID로 사용자 조회
exports.findUserById = async (id) => {
    const user = await models.User.findByPk(id, {
        attributes: { exclude: ['password_hash'] } // 비밀번호 제외
    });
    
    if (!user) {
        return null;
    }
    
    const userData = user.toJSON();
    
    // 사용자의 태그 목록 가져오기
    try {
        const userTags = await models.sequelize.query(
            `SELECT t.id, t.name, t.description 
             FROM user_tags ut 
             JOIN tags t ON ut.tag_id = t.id 
             WHERE ut.user_id = :userId`,
            {
                replacements: { userId: id },
                type: models.sequelize.QueryTypes.SELECT
            }
        );
        userData.tags = userTags || [];
    } catch (error) {
        console.error('사용자 태그 조회 실패:', error);
        userData.tags = [];
    }
    
    return userData;
};

// 이메일로 사용자 조회 (로그인용 - 비밀번호 포함)
exports.findUserByEmail = async (email) => {
    const user = await models.User.findOne({
        where: { email: email }
    });
    
    if (!user) {
        return null;
    }
    
    return user;
};

// 사용자명으로 사용자 조회
exports.findUserByUsername = async (username) => {
    const user = await models.User.findOne({
        where: { username: username },
        attributes: { exclude: ['password_hash'] } // 비밀번호 제외
    });
    
    if (!user) {
        return null;
    }
    
    return user.toJSON();
};

// 사용자 생성
exports.createUser = async ({ username, email, password, role, profile_image }) => {
    if (!username || !email || !password) {
        throw new Error('username, email, password는 필수입니다');
    }
    
    // 이메일 중복 확인
    const existingEmail = await models.User.findOne({ where: { email } });
    if (existingEmail) {
        throw new Error('이미 사용 중인 이메일입니다');
    }
    
    // 사용자명 중복 확인
    const existingUsername = await models.User.findOne({ where: { username } });
    if (existingUsername) {
        throw new Error('이미 사용 중인 사용자명입니다');
    }
    
    // role 유효성 검사
    if (role && role !== 'admin' && role !== 'user') {
        throw new Error('role은 "admin" 또는 "user"여야 합니다');
    }
    
    const user = await models.User.create({
        username,
        email,
        password_hash: password, // hook에서 자동으로 해시 처리됨
        role: role || 'user',
        profile_image: profile_image || null
    });
    
    // 비밀번호 제외하고 반환
    return user.toSafeJSON();
};

// 사용자 업데이트
exports.updateUser = async (id, { username, email, password, role, profile_image, is_email_public, bio, github_url }) => {
    const user = await models.User.findByPk(id);
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }
    
    const updateData = {};
    
    if (username !== undefined) {
        // 사용자명 중복 확인 (자신 제외)
        const existing = await models.User.findOne({
            where: {
                username: username,
                id: { [Op.ne]: id }
            }
        });
        
        if (existing) {
            throw new Error('이미 사용 중인 사용자명입니다');
        }
        updateData.username = username;
    }
    
    if (email !== undefined) {
        // 이메일 중복 확인 (자신 제외)
        const existing = await models.User.findOne({
            where: {
                email: email,
                id: { [Op.ne]: id }
            }
        });
        
        if (existing) {
            throw new Error('이미 사용 중인 이메일입니다');
        }
        updateData.email = email;
    }
    
    if (password !== undefined) {
        updateData.password_hash = password; // hook에서 자동으로 해시 처리됨
    }
    
    if (role !== undefined) {
        if (role !== 'admin' && role !== 'user') {
            throw new Error('role은 "admin" 또는 "user"여야 합니다');
        }
        updateData.role = role;
    }
    
    if (profile_image !== undefined) {
        updateData.profile_image = profile_image || null;
    }
    
    if (is_email_public !== undefined) {
        updateData.is_email_public = is_email_public === true || is_email_public === 'true' || is_email_public === 1;
    }
    
    if (bio !== undefined) {
        updateData.bio = bio || null;
    }
    
    if (github_url !== undefined) {
        updateData.github_url = github_url || null;
    }
    
    await user.update(updateData);
    
    // 비밀번호 제외하고 반환
    return user.toSafeJSON();
};

// 사용자 삭제
exports.deleteUser = async (id) => {
    const user = await models.User.findByPk(id);
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }
    
    await user.destroy();
    return true;
};

// 비밀번호 검증
exports.validatePassword = async (userId, password) => {
    const user = await models.User.findByPk(userId);
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }
    
    return await user.validatePassword(password);
};

// 사용자 태그 업데이트 (태그 이름 배열을 받아서 처리)
exports.updateUserTags = async (userId, tagNames) => {
    try {
        // 기존 태그 삭제
        await models.sequelize.query(
            'DELETE FROM user_tags WHERE user_id = :userId',
            {
                replacements: { userId },
                type: models.sequelize.QueryTypes.DELETE
            }
        );
        
        // 새 태그 추가 (태그 이름으로 처리)
        if (tagNames && tagNames.length > 0) {
            for (const tagName of tagNames) {
                if (!tagName || typeof tagName !== 'string') {
                    continue; // 유효하지 않은 태그 이름은 건너뛰기
                }
                
                // 태그 이름으로 태그 찾기 또는 생성
                let tag = await models.Tag.findOne({
                    where: { name: tagName.trim() }
                });
                
                if (!tag) {
                    // 태그가 없으면 생성
                    tag = await models.Tag.create({
                        name: tagName.trim(),
                        description: null
                    });
                }
                
                // user_tags에 추가 (중복 체크)
                const existingUserTag = await models.sequelize.query(
                    'SELECT id FROM user_tags WHERE user_id = :userId AND tag_id = :tagId',
                    {
                        replacements: { userId, tagId: tag.id },
                        type: models.sequelize.QueryTypes.SELECT
                    }
                );
                
                if (existingUserTag.length === 0) {
                    await models.sequelize.query(
                        'INSERT INTO user_tags (user_id, tag_id, created_at) VALUES (:userId, :tagId, NOW())',
                        {
                            replacements: { userId, tagId: tag.id },
                            type: models.sequelize.QueryTypes.INSERT
                        }
                    );
                }
            }
        }
        
        return true;
    } catch (error) {
        console.error('사용자 태그 업데이트 실패:', error);
        throw new Error('사용자 태그 업데이트에 실패했습니다: ' + error.message);
    }
};

