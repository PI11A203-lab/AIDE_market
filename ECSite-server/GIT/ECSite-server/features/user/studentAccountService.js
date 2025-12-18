const models = require("../../db/initializer");

/**
 * 학생 인증 처리
 */
exports.verifyStudent = async (userId, documentPath, transaction = null) => {
    const user = await models.User.findByPk(userId, { transaction });
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }

    // 학생 인증 정보 업데이트
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1년 후 만료

    await user.update({
        account_type: 'student',
        student_verified_at: now,
        student_expires_at: expiresAt.toISOString().split('T')[0],
        student_verification_document: documentPath
    }, { transaction });

    return user;
};

/**
 * 학생 인증 유효성 확인
 */
exports.isStudentActive = (user) => {
    if (!user || user.account_type !== 'student') {
        return false;
    }

    if (!user.student_expires_at) {
        return false;
    }

    const today = new Date();
    const expiresAt = new Date(user.student_expires_at);
    
    return expiresAt > today;
};

/**
 * 만료된 학생 계정 처리 (스케줄러용)
 */
exports.expireStudentAccounts = async (transaction = null) => {
    const today = new Date().toISOString().split('T')[0];

    const expiredUsers = await models.User.findAll({
        where: {
            account_type: 'student',
            student_expires_at: {
                [models.sequelize.Op.lt]: today
            }
        },
        transaction
    });

    if (expiredUsers.length === 0) {
        return [];
    }

    // 일반 계정으로 변경
    await models.User.update(
        {
            account_type: 'general'
        },
        {
            where: {
                account_type: 'student',
                student_expires_at: {
                    [models.sequelize.Op.lt]: today
                }
            },
            transaction
        }
    );

    return expiredUsers;
};

/**
 * 학생 할인 적용
 */
exports.calculateStudentDiscount = (originalPrice, user) => {
    if (!exports.isStudentActive(user)) {
        return originalPrice;
    }

    // 50% 할인
    return Math.floor(originalPrice * 0.5);
};

/**
 * 학생 인증 상태 조회
 */
exports.getStudentStatus = async (userId) => {
    const user = await models.User.findByPk(userId, {
        attributes: [
            'id',
            'account_type',
            'student_verified_at',
            'student_expires_at',
            'student_verification_document'
        ]
    });

    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }

    const isActive = exports.isStudentActive(user);
    let daysRemaining = 0;

    if (user.account_type === 'student' && user.student_expires_at) {
        const today = new Date();
        const expiresAt = new Date(user.student_expires_at);
        
        if (expiresAt > today) {
            daysRemaining = Math.ceil((expiresAt - today) / (1000 * 60 * 60 * 24));
        }
    }

    return {
        accountType: user.account_type,
        isStudentActive: isActive,
        verifiedAt: user.student_verified_at,
        expiresAt: user.student_expires_at,
        daysRemaining,
        documentPath: user.student_verification_document
    };
};

