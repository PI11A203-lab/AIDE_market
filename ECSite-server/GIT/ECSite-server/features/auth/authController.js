const jwt = require('jsonwebtoken');
const userService = require('../user/userService');
const loginAttemptTracker = require('../../middleware/loginAttemptTracker');

/**
 * IP 주소 추출 헬퍼 함수
 */
const getClientIP = (req) => {
  return req.headers['cf-connecting-ip'] 
    || req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.ip 
    || req.connection?.remoteAddress
    || req.socket?.remoteAddress
    || 'unknown';
};

// 일반 로그인 (이메일/비밀번호)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ipAddress = getClientIP(req);

        if (!email || !password) {
            return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
        }

        // 이메일로 사용자 찾기 (비밀번호 포함)
        const user = await userService.findUserByEmail(email);
        
        // 사용자 없음 또는 비밀번호 불일치
        const isInvalidCredentials = !user || 
            user.auth_provider === 'google' || 
            !(await user.validatePassword(password));

        if (isInvalidCredentials) {
            // 로그인 실패 기록
            const attemptCount = await loginAttemptTracker.recordLoginFailure(ipAddress);
            const remainingAttempts = 5 - attemptCount;

            // 사용자가 존재하지 않는 경우와 비밀번호가 틀린 경우를 구분하여 에러 코드 반환
            let errorCode = 'invalidCredentials';
            if (!user) {
                errorCode = 'userNotFound';
            } else if (user.auth_provider === 'google') {
                errorCode = 'googleAccount';
            } else {
                errorCode = 'wrongPassword';
            }

            return res.status(401).json({ 
                success: false,
                error: errorCode,
                errorMessage: errorCode, // 클라이언트에서 i18n 키로 사용
                remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0
            });
        }

        // 로그인 성공 - 시도 횟수 리셋
        loginAttemptTracker.resetLoginAttempts(ipAddress);

        // JWT 토큰 생성
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET || 'jwt-secret',
            {
                expiresIn: '7d' // 7일 후 만료
            }
        );

        // 사용자 정보 (비밀번호 제외)
        const userData = user.toSafeJSON ? user.toSafeJSON() : {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile_image: user.profile_image,
            bio: user.bio,
            github_url: user.github_url,
            follower_count: user.follower_count
        };

        res.json({
            success: true,
            token,
            user: userData
        });
    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
    }
};

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

