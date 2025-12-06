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
        // 구글 로그인 사용자인 경우 특별한 메시지
        if (existingEmail.auth_provider === 'google') {
            throw new Error('이 이메일은 구글 계정으로 가입되어 있습니다. 구글 로그인을 사용해주세요.');
        }
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

// 구글 계정으로 신규 사용자 생성
exports.createGoogleUser = async ({ username, email, profile_image, google_id }) => {
    if (!username || !email) {
        throw new Error('username, email은 필수입니다');
    }
    
    // 이메일 중복 확인
    const existingEmail = await models.User.findOne({ where: { email } });
    if (existingEmail) {
        throw new Error('이미 사용 중인 이메일입니다');
    }
    
    // 사용자명 중복 확인
    const existingUsername = await models.User.findOne({ where: { username } });
    if (existingUsername) {
        // 사용자명이 중복되는 경우 이메일 기반으로 고유한 사용자명 생성
        const emailPrefix = email.split('@')[0];
        username = `${username}_${emailPrefix}_${Date.now()}`;
        console.log('사용자명 중복으로 인한 자동 변경:', username);
    }
    
    const user = await models.User.create({
        username,
        email,
        password_hash: null, // ⭐ 구글 로그인은 비밀번호 불필요
        role: 'user',
        profile_image: profile_image || null,
        google_id: google_id || null, // 구글 고유 ID 저장
        auth_provider: 'google' // 인증 제공자: google
    });
    
    console.log('구글 사용자 생성 완료:', user.id, user.email);
    
    // 비밀번호 제외하고 반환
    return user.toSafeJSON();
};

// 사용자 업데이트
exports.updateUser = async (id, { username, email, password, role, profile_image, is_email_public, bio, github_url, google_id, auth_provider }) => {
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
    
    if (google_id !== undefined) {
        updateData.google_id = google_id || null;
    }
    
    if (auth_provider !== undefined) {
        if (auth_provider !== 'local' && auth_provider !== 'google') {
            throw new Error('auth_provider는 "local" 또는 "google"이어야 합니다');
        }
        updateData.auth_provider = auth_provider;
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

// 비밀번호 재설정 토큰 저장소 (메모리 기반, 프로덕션에서는 DB 사용 권장)
const passwordResetTokens = new Map();

// 비밀번호 재설정 요청 (6자리 숫자 코드 생성)
exports.requestPasswordReset = async (email) => {
    const user = await exports.findUserByEmail(email);
    if (!user) {
        // 보안을 위해 사용자가 없어도 성공 메시지 반환
        return { success: true, message: '이메일이 등록되어 있다면 인증 코드를 전송했습니다.' };
    }
    
    // 6자리 숫자 코드 생성 (000000-999999)
    const crypto = require('crypto');
    const code = Math.floor(100000 + crypto.randomInt(0, 900000)).toString().padStart(6, '0');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료
    
    // 코드 저장 (이메일을 키로 사용하여 기존 코드 덮어쓰기)
    passwordResetTokens.set(user.email, {
        userId: user.id,
        email: user.email,
        code: code,
        expiresAt: expiresAt
    });
    
    // 만료된 코드 정리 (10분 후)
    setTimeout(() => {
        const stored = passwordResetTokens.get(user.email);
        if (stored && stored.code === code) {
            passwordResetTokens.delete(user.email);
        }
    }, 10 * 60 * 1000);
    
    // 이메일 전송 시도
    const emailService = require('./emailService');
    try {
        const emailResult = await emailService.sendPasswordResetCode(user.email, code);
        
        // 이메일이 성공적으로 전송된 경우 (코드 반환 안 함)
        if (emailResult.sent) {
            return {
                success: true,
                message: '이메일이 등록되어 있다면 인증 코드를 전송했습니다.',
            };
        }
        
        // 이메일 서버 설정이 없어서 전송되지 않은 경우에만 코드 반환 (개발 편의)
        if (!emailResult.sent && emailResult.code) {
            console.log('\n⚠️ 이메일 서버가 설정되지 않아 코드를 반환합니다.');
            console.log('실제 이메일을 받으려면 .env 파일에 SMTP_PASSWORD를 설정하세요.\n');
            return {
                success: true,
                message: '이메일이 등록되어 있다면 인증 코드를 전송했습니다.',
                // 이메일 서버가 없을 때만 코드 반환
                code: emailResult.code,
            };
        }
        
        // 기본 응답
        return {
            success: true,
            message: '이메일이 등록되어 있다면 인증 코드를 전송했습니다.',
        };
    } catch (error) {
        // 이메일 전송 실패
        console.error('이메일 전송 중 오류:', error);
        
        // 이메일 서버 설정이 있지만 전송 실패한 경우 (코드 반환 안 함)
        // 사용자에게는 성공 메시지만 표시 (보안)
        return {
            success: true,
            message: '이메일이 등록되어 있다면 인증 코드를 전송했습니다.',
        };
    }
};

// 인증 코드 검증
exports.verifyResetCode = async (email, code) => {
    if (!email || !code) {
        throw new Error('이메일과 인증 코드는 필수입니다');
    }
    
    // 코드 검증
    const codeData = passwordResetTokens.get(email);
    if (!codeData) {
        throw new Error('인증 코드가 없거나 만료되었습니다');
    }
    
    // 만료 확인
    if (new Date() > codeData.expiresAt) {
        passwordResetTokens.delete(email);
        throw new Error('인증 코드가 만료되었습니다');
    }
    
    // 코드 일치 확인
    if (codeData.code !== code) {
        throw new Error('인증 코드가 일치하지 않습니다');
    }
    
    // 검증 성공 - 토큰 생성하여 반환 (비밀번호 재설정 페이지에서 사용)
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30분 후 만료
    
    // 토큰 저장 (이메일을 키로 사용)
    passwordResetTokens.set(`token_${resetToken}`, {
        userId: codeData.userId,
        email: codeData.email,
        expiresAt: tokenExpiresAt
    });
    
    // 코드 삭제 (한 번만 사용 가능)
    passwordResetTokens.delete(email);
    
    return { 
        success: true, 
        message: '인증 코드가 확인되었습니다.',
        resetToken: resetToken
    };
};

// 비밀번호 재설정 (토큰으로)
exports.resetPassword = async (resetToken, newPassword) => {
    if (!resetToken || !newPassword) {
        throw new Error('토큰과 새 비밀번호는 필수입니다');
    }
    
    // 토큰 검증
    const tokenData = passwordResetTokens.get(`token_${resetToken}`);
    if (!tokenData) {
        throw new Error('유효하지 않거나 만료된 토큰입니다');
    }
    
    // 만료 확인
    if (new Date() > tokenData.expiresAt) {
        passwordResetTokens.delete(`token_${resetToken}`);
        throw new Error('토큰이 만료되었습니다');
    }
    
    // 비밀번호 업데이트
    await exports.updateUser(tokenData.userId, {
        password: newPassword
    });
    
    // 토큰 삭제 (한 번만 사용 가능)
    passwordResetTokens.delete(`token_${resetToken}`);
    
    return { success: true, message: '비밀번호가 성공적으로 변경되었습니다' };
};

