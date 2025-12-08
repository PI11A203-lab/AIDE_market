const express = require("express");
const router = express.Router();
const userController = require("./userController");
const userFollowController = require("./userFollowController");

// 전체 사용자 목록 (페이징 지원)
router.get("/", userController.getAllUsers);

// 사용자명으로 사용자 조회
router.get("/username/:username", userController.getUserByUsername);

// 팔로우 관련 라우트 (/:id 라우트보다 먼저 정의)
router.post("/:user_id/follow", userFollowController.followUser);
router.post("/:user_id/unfollow", userFollowController.unfollowUser);
router.get("/:user_id/follow-status", userFollowController.getFollowStatus);
router.get("/:user_id/followers", userFollowController.getFollowers);
router.get("/:user_id/following", userFollowController.getFollowing);

// ID로 사용자 조회
router.get("/:id", userController.getUserById);

// 사용자 생성
router.post("/", userController.createUser);

// 사용자 업데이트
router.put("/:id", userController.updateUser);

// 사용자 삭제
router.delete("/:id", userController.deleteUser);

// 비밀번호 검증
router.post("/:id/validate-password", userController.validatePassword);

// 비밀번호 재설정 요청 (6자리 코드 전송)
router.post("/forgot-password", userController.requestPasswordReset);

// 인증 코드 검증
router.post("/verify-reset-code", userController.verifyResetCode);

// 비밀번호 재설정 (토큰으로)
router.post("/reset-password", userController.resetPassword);

module.exports = router;

