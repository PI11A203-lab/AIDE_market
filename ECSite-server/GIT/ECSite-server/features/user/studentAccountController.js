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
            // 학생 인증 처리
            const user = await studentAccountService.verifyStudent(userId, documentPath, transaction);
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

// multer 미들웨어 export
exports.upload = upload.single('document');

