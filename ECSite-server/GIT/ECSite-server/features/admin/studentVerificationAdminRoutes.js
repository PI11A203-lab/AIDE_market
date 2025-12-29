const express = require('express');
const router = express.Router();
const studentAccountController = require('../user/studentAccountController');
const { requireSuperAdmin } = require('../../middleware/adminAuth');

// 모든 라우트에 super_admin 권한 필요
router.use(requireSuperAdmin);

// 대기 중인 학생 인증 목록 조회
router.get('/student-verifications/pending', studentAccountController.getPendingStudentVerifications);

// 학생 인증 승인
router.post('/users/:userId/student-verification/approve', studentAccountController.approveStudent);

// 학생 인증 거부
router.post('/users/:userId/student-verification/reject', studentAccountController.rejectStudentVerification);

// 인증 문서 조회
router.get('/users/:userId/verification-document', studentAccountController.getVerificationDocument);

module.exports = router;

