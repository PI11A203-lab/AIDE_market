const express = require('express');
const router = express.Router();
const productAdminController = require('./productAdminController');
const { requireSuperAdmin } = require('../../middleware/adminAuth');

// 대기 중인 상품 목록
router.get('/pending', requireSuperAdmin, productAdminController.getPendingProducts);

// 상품 승인
router.post('/:productId/approve', requireSuperAdmin, productAdminController.approveProduct);

// 상품 거부
router.post('/:productId/reject', requireSuperAdmin, productAdminController.rejectProduct);

// 상품 상세
router.get('/:productId/pending-details', requireSuperAdmin, productAdminController.getPendingProductDetail);

module.exports = router;

