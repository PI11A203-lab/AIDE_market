const express = require('express');
const router = express.Router();
const ipManagementController = require('./ipManagementController');
const { requireSuperAdmin } = require('../../middleware/adminAuth');

// 모든 라우트에 super_admin 권한 필요
router.use(requireSuperAdmin);

// 접속 로그 목록
router.get('/logs', ipManagementController.getIPLogs);

// 접속 통계
router.get('/logs/stats', ipManagementController.getIPStats);

// 국가별 통계
router.get('/logs/stats/countries', ipManagementController.getIPCountryStats);

// 시간대별 통계
router.get('/logs/stats/hourly', ipManagementController.getIPHourlyStats);

// IP 차단
router.post('/management/block', ipManagementController.blockIP);

// IP 차단 해제
router.post('/management/unblock', ipManagementController.unblockIP);

// IP 화이트리스트 추가
router.post('/management/whitelist', ipManagementController.whitelistIP);

// IP 관리 목록
router.get('/management', ipManagementController.getIPManagement);

// 통계 API
router.get('/access/trend', ipManagementController.getAccessTrendData);
router.get('/access/countries', ipManagementController.getCountryDistribution);
router.get('/access/hourly', ipManagementController.getHourlyAccessDistribution);
router.get('/access/top-ips', ipManagementController.getTopAccessIPs);

module.exports = router;

