const jwt = require('jsonwebtoken');
const userService = require('../user/userService');

// 일반 로그인 (이메일/비밀번호)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
        }

        // 이메일로 사용자 찾기 (비밀번호 포함)
        const user = await userService.findUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        // 구글 로그인 사용자인 경우
        if (user.auth_provider === 'google') {
            return res.status(401).json({ error: '이 계정은 구글 로그인을 사용해주세요.' });
        }

        // 비밀번호 검증
        const isValidPassword = await user.validatePassword(password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

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

