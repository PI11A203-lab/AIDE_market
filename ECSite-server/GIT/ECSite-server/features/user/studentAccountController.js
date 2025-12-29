const studentAccountService = require('./studentAccountService');
const emailService = require('./emailService');
const models = require('../../db/initializer');
const multer = require('multer');
const path = require('path');

// 파일 업로드 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/student-documents/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `student-${req.params.userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
    fileFilter: function (req, file, cb) {
        // 이미지 파일만 허용
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('이미지 파일만 업로드 가능합니다.'));
        }
    }
});

/**
 * 학생 인증 신청 (문서 업로드)
 */
exports.verifyStudent = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: '학생증 또는 재학증명서 파일이 필요합니다.'
            });
        }

        const documentPath = req.file.path;
        
        const transaction = await models.sequelize.transaction();
        
        try {
            // 학생 인증 신청 - 대기 상태로 저장
            const user = await studentAccountService.verifyStudent(userId, documentPath, transaction);
            await transaction.commit();

            // 이메일 발송은 승인 후에 발송되므로 여기서는 발송하지 않음

            res.json({
                success: true,
                message: '학생 인증이 신청되었습니다. 검토 후 처리됩니다.',
                user: user.toSafeJSON ? user.toSafeJSON() : user
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('학생 인증 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 학생 인증 상태 조회
 */
exports.getStudentStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const status = await studentAccountService.getStudentStatus(userId);
        
        res.json({
            success: true,
            ...status
        });
    } catch (error) {
        console.error('학생 인증 상태 조회 실패:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 학생 인증 승인 (관리자용 또는 테스트용)
 */
exports.approveStudent = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const transaction = await models.sequelize.transaction();
        
        try {
            // 학생 인증 승인 처리
            const user = await studentAccountService.approveStudent(userId, transaction);
            await transaction.commit();

            // 학생 인증 완료 이메일 발송
            const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            try {
                await emailService.sendStudentVerifiedEmail(user, baseUrl);
            } catch (emailError) {
                console.error('학생 인증 완료 이메일 발송 실패:', emailError);
            }

            res.json({
                success: true,
                message: '학생 인증이 승인되었습니다.',
                user: user.toSafeJSON ? user.toSafeJSON() : user
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('학생 인증 승인 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 대기 중인 학생 인증 신청 목록 조회 (super_admin용)
 */
exports.getPendingStudentVerifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;

        const result = await studentAccountService.getPendingStudentVerifications(
            parseInt(page),
            parseInt(limit),
            { search }
        );

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('대기 중인 학생 인증 목록 조회 실패:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 학생 인증 거부 (super_admin용)
 */
exports.rejectStudentVerification = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;
        const rejectedBy = req.user.id;

        if (!reason) {
            return res.status(400).json({
                success: false,
                error: '거부 사유를 입력해주세요.'
            });
        }

        const transaction = await models.sequelize.transaction();

        try {
            const user = await studentAccountService.rejectStudentVerification(
                userId,
                rejectedBy,
                reason,
                transaction
            );
            await transaction.commit();

            res.json({
                success: true,
                message: '학생 인증이 거부되었습니다.',
                user: user.toSafeJSON ? user.toSafeJSON() : user
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('학생 인증 거부 실패:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * 인증 문서 조회 (super_admin용)
 */
exports.getVerificationDocument = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await models.User.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'student_verification_document']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: '사용자를 찾을 수 없습니다.'
            });
        }

        if (!user.student_verification_document) {
            return res.status(404).json({
                success: false,
                error: '인증 문서가 없습니다.'
            });
        }

        // 파일 경로 반환 (프론트엔드에서 다운로드)
        res.json({
            success: true,
            documentPath: user.student_verification_document,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('인증 문서 조회 실패:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// multer 미들웨어 export
exports.upload = upload.single('document');

