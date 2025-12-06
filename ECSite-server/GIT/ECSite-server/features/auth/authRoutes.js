const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('./authController');

// 구글 로그인 시작
// GET /auth/google
router.get(
    '/google',
    authController.googleAuth,
    passport.authenticate('google', {
        scope: ['profile', 'email'] // 구글에서 요청할 권한 범위
    })
);

// 구글 로그인 콜백
// GET /auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/google/failure', // 실패 시 리다이렉트
        session: false // 세션 사용 안 함 (JWT 사용)
    }),
    authController.googleSuccess
);

// 구글 로그인 실패 처리
// GET /auth/google/failure
router.get('/google/failure', authController.googleFailure);

module.exports = router;

