const jwt = require('jsonwebtoken');
const userService = require('../user/userService');

// 구글 로그인 시작
exports.googleAuth = (req, res, next) => {
    console.log('구글 로그인 요청 받음');
    // passport.authenticate('google') 미들웨어가 자동으로 구글 로그인 페이지로 리다이렉트
    next();
};

// 구글 로그인 콜백 처리
exports.googleCallback = async (req, res, next) => {
    // passport.authenticate 미들웨어가 먼저 실행되어 사용자 정보를 req.user에 설정
    // 이 함수는 성공 시 실행됨
    next();
};

// 구글 로그인 성공 후 JWT 토큰 생성 및 리다이렉트
exports.googleSuccess = async (req, res) => {
    try {
        if (!req.user) {
            console.error('구글 로그인 성공했지만 사용자 정보가 없습니다');
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }

        console.log('구글 로그인 성공, JWT 토큰 생성:', req.user.id);

        // JWT 토큰 생성
        const token = jwt.sign(
            {
                id: req.user.id,
                email: req.user.email
            },
            process.env.JWT_SECRET || 'jwt-secret',
            {
                expiresIn: '7d' // 7일 후 만료
            }
        );

        console.log('JWT 토큰 생성 완료, 프론트엔드로 리다이렉트');

        // 프론트엔드로 리다이렉트 (토큰 포함)
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
        console.error('구글 로그인 성공 처리 중 오류:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
};

// 구글 로그인 실패 처리
exports.googleFailure = (req, res) => {
    console.error('구글 로그인 실패');
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
};

