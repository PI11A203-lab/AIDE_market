const express = require('express');
const router = express.Router();
const securityController = require('./securityController');
const { requireSuperAdmin } = require('../../middleware/adminAuth');

// 모든 라우트에 super_admin 권한 필요
router.use(requireSuperAdmin);

// 보안 이벤트 목록
router.get('/events', securityController.getSecurityEvents);

// 보안 이벤트 통계
router.get('/events/stats', securityController.getSecurityEventStats);

// 이벤트 유형별 통계
router.get('/events/stats/by-type', securityController.getSecurityEventStatsByType);

// 봇 탐지 목록
router.get('/bots', securityController.getBotDetections);

// 봇 차단
router.post('/bots/:id/block', securityController.blockBot);

// 봇 차단 해제
router.post('/bots/:id/unblock', securityController.unblockBot);

// IP 수동 차단
router.post('/block-ip', securityController.blockIPManual);

// IP 수동 차단 해제
router.post('/unblock-ip', securityController.unblockIPManual);

// 보안 설정 조회
router.get('/settings', securityController.getSecuritySettings);

// 보안 설정 업데이트
router.put('/settings', securityController.updateSecuritySettings);

// 통계 API
router.get('/events/trend', securityController.getEventTrendData);
router.get('/events/distribution', securityController.getEventDistribution);
router.get('/events/hourly', securityController.getHourlyDistribution);
router.get('/events/top-ips', securityController.getTopAttackIPs);

// 메모리 관리 API
router.get('/memory/stats', securityController.getMemoryStats);
router.post('/memory/cleanup', securityController.forceMemoryCleanup);

module.exports = router;

