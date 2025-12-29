const express = require("express");
const router = express.Router();
const studentAccountController = require("./studentAccountController");
const { requireSuperAdmin } = require("../../middleware/adminAuth");
// const auth = require("../../middleware/auth"); // 인증 미들웨어 (필요시 활성화)

// 학생 인증 신청 (문서 업로드) - 일반 사용자용
router.post("/:userId/student-verification", studentAccountController.upload, studentAccountController.verifyStudent);

// 학생 인증 승인 (관리자용 또는 테스트용)
router.post("/:userId/student-verification/approve", studentAccountController.approveStudent);

// 학생 인증 상태 조회
router.get("/:userId/student-status", studentAccountController.getStudentStatus);

// ===== Super Admin용 라우트 =====
// 대기 중인 학생 인증 목록 조회
router.get("/student-verifications/pending", requireSuperAdmin, studentAccountController.getPendingStudentVerifications);

// 학생 인증 거부
router.post("/:userId/student-verification/reject", requireSuperAdmin, studentAccountController.rejectStudentVerification);

// 인증 문서 조회
router.get("/:userId/verification-document", requireSuperAdmin, studentAccountController.getVerificationDocument);

module.exports = router;

