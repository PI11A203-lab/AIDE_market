const models = require("../../db/initializer");
const { Op } = require("sequelize");

/**
 * 학생 인증 신청 (대기 상태로 저장)
 */
exports.verifyStudent = async (userId, documentPath, transaction = null) => {
    const user = await models.User.findByPk(userId, { transaction });
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }

    // 학생 인증 신청 - 대기 상태로 저장 (student_verified_at은 null)
    await user.update({
        account_type: 'student', // 계정 타입은 student로 변경
        student_verified_at: null, // 아직 승인 전
        student_expires_at: null, // 승인 후 설정됨
        student_verification_document: documentPath // 문서 경로만 저장
    }, { transaction });

    return user;
};

/**
 * 학생 인증 승인 (관리자용)
 */
exports.approveStudent = async (userId, transaction = null) => {
    const user = await models.User.findByPk(userId, { transaction });
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }

    if (!user.student_verification_document) {
        throw new Error('학생 인증 신청이 없습니다.');
    }

    // 학생 인증 승인 처리
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1년 후 만료

    await user.update({
        account_type: 'student',
        student_verified_at: now,
        student_expires_at: expiresAt.toISOString().split('T')[0]
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
                [Op.lt]: today
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

    // 응답 형식을 프론트엔드에서 사용하는 형식으로 맞춤
    return {
        account_type: user.account_type,
        student_verified_at: user.student_verified_at,
        student_expires_at: user.student_expires_at,
        student_verification_document: user.student_verification_document,
        accountType: user.account_type, // 호환성을 위해 둘 다 제공
        isStudentActive: isActive,
        verifiedAt: user.student_verified_at,
        expiresAt: user.student_expires_at,
        daysRemaining,
        documentPath: user.student_verification_document
    };
};

/**
 * 대기 중인 학생 인증 신청 목록 조회 (super_admin용)
 */
exports.getPendingStudentVerifications = async (page = 1, limit = 20, filters = {}) => {
    const offset = (page - 1) * limit;
    
    const where = {
        account_type: 'student',
        student_verified_at: null,
        student_verification_document: {
            [Op.ne]: null
        }
    };

    // 검색 필터
    if (filters.search) {
        where[Op.or] = [
            { username: { [Op.like]: `%${filters.search}%` } },
            { email: { [Op.like]: `%${filters.search}%` } }
        ];
    }

    const { count, rows } = await models.User.findAndCountAll({
        where,
        attributes: [
            'id',
            'username',
            'email',
            'account_type',
            'student_verified_at',
            'student_expires_at',
            'student_verification_document',
            'createdAt'
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });

    return {
        verifications: rows,
        totalCount: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit)
    };
};

/**
 * 학생 인증 거부 (super_admin용)
 */
exports.rejectStudentVerification = async (userId, rejectedByUserId, reason, transaction = null) => {
    const user = await models.User.findByPk(userId, { transaction });
    
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
    }

    if (!user.student_verification_document) {
        throw new Error('학생 인증 신청이 없습니다.');
    }

    // 인증 거부 처리 - 일반 계정으로 변경하고 문서 제거
    await user.update({
        account_type: 'general',
        student_verification_document: null,
        student_verified_at: null,
        student_expires_at: null
    }, { transaction });

    return user;
};

