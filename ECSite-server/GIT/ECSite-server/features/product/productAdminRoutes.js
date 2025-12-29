const express = require('express');
const router = express.Router();
const productAdminController = require('./productAdminController');
const { requireSuperAdmin } = require('../../middleware/adminAuth');

// 모든 라우트에 super_admin 권한 필요
router.use(requireSuperAdmin);

// 대기 중인 상품 목록
router.get('/pending', productAdminController.getPendingProducts);

// 상품 승인
router.post('/:productId/approve', productAdminController.approveProduct);

// 상품 거부
router.post('/:productId/reject', productAdminController.rejectProduct);

// 상품 상세
router.get('/:productId/pending-details', productAdminController.getPendingProductDetail);

module.exports = router;

