const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userService = require('../user/userService');

// Passport 구글 OAuth 전략 설정 (환경변수가 있을 때만)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8081/auth/google/callback'
            },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('구글 로그인 프로필 정보:', {
                    id: profile.id,
                    email: profile.emails?.[0]?.value,
                    name: profile.displayName,
                    photo: profile.photos?.[0]?.value
                });

                const email = profile.emails?.[0]?.value;
                const username = profile.displayName || profile.name?.givenName || 'Google User';
                const profile_image = profile.photos?.[0]?.value || null;
                const google_id = profile.id; // 구글 고유 ID

                if (!email) {
                    console.error('구글 프로필에 이메일이 없습니다');
                    return done(new Error('구글 계정에서 이메일 정보를 가져올 수 없습니다'), null);
                }

                // 기존 사용자 확인
                let user = await userService.findUserByEmail(email);

                if (user) {
                    // 기존 사용자가 있는 경우 google_id, auth_provider, profile_image 업데이트
                    console.log('기존 사용자 발견, 프로필 정보 업데이트:', user.id);
                    user = await userService.updateUser(user.id, {
                        username: username,
                        profile_image: profile_image,
                        google_id: google_id, // 구글 고유 ID 저장
                        auth_provider: 'google' // 인증 제공자: google
                    });
                } else {
                    // 신규 사용자 생성
                    console.log('신규 구글 사용자 생성:', email);
                    user = await userService.createGoogleUser({
                        username: username,
                        email: email,
                        profile_image: profile_image,
                        google_id: google_id // 구글 고유 ID 저장
                    });
                }

                return done(null, user);
            } catch (error) {
                console.error('구글 로그인 처리 중 오류:', error);
                return done(error, null);
            }
        }
    )
    );
} else {
    console.log('⚠️ Google OAuth 설정이 없습니다. GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET을 설정하세요.');
}

// 사용자 정보를 세션에 저장 (직렬화)
passport.serializeUser((user, done) => {
    console.log('사용자 세션 직렬화:', user.id);
    done(null, user.id);
});

// 세션에서 사용자 정보 복원 (역직렬화)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userService.findUserById(id);
        if (!user) {
            return done(new Error('사용자를 찾을 수 없습니다'), null);
        }
        console.log('사용자 세션 역직렬화:', user.id);
        done(null, user);
    } catch (error) {
        console.error('사용자 세션 역직렬화 중 오류:', error);
        done(error, null);
    }
});

module.exports = passport;

