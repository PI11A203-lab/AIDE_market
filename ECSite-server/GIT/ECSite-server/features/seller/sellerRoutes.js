const express = require('express');
const router = express.Router();
const sellerController = require('./sellerController');
const auth = require('../../middleware/auth');

// 신청 상태 확인
router.get('/application-status', auth, sellerController.getApplicationStatus);

// 판매자 신청
router.post('/apply', auth, sellerController.apply);

module.exports = router;
