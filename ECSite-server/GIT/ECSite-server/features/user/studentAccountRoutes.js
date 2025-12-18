const express = require("express");
const router = express.Router();
const studentAccountController = require("./studentAccountController");
// const auth = require("../../middleware/auth"); // 인증 미들웨어 (필요시 활성화)

// 학생 인증 신청 (문서 업로드)
router.post("/:userId/student-verification", studentAccountController.upload, studentAccountController.verifyStudent);

// 학생 인증 상태 조회
router.get("/:userId/student-status", studentAccountController.getStudentStatus);

module.exports = router;

