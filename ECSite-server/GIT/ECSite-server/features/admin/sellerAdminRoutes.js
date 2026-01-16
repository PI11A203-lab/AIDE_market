const express = require('express');
const router = express.Router();
const sellerAdminController = require('./sellerAdminController');
const { requireSuperAdmin } = require('../../middleware/adminAuth');
const auth = require('../../middleware/auth');

// 신청 목록
router.get('/seller-applications', auth, requireSuperAdmin, sellerAdminController.getApplications);

// 신청 상세 + 자동 검증
router.get('/seller-applications/:userId', auth, requireSuperAdmin, sellerAdminController.getApplicationDetail);

// 승인
router.post('/seller-applications/:userId/approve', auth, requireSuperAdmin, sellerAdminController.approve);

// 반려
router.post('/seller-applications/:userId/reject', auth, requireSuperAdmin, sellerAdminController.reject);

module.exports = router;
