const express = require("express");
const router = express.Router();
const userController = require("./userController");

// 전체 사용자 목록 (페이징 지원)
router.get("/", userController.getAllUsers);

// 사용자명으로 사용자 조회
router.get("/username/:username", userController.getUserByUsername);

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

module.exports = router;

