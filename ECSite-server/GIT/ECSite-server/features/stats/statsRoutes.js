const express = require("express");
const router = express.Router();
const statsController = require("./statsController");

// 마켓플레이스 전체 통계
router.get("/overview", statsController.getOverview);

// Stats CRUD API
router.get("/", statsController.getAllStats); // 전체 목록
router.get("/:id", statsController.getStatsById); // ID로 조회
router.post("/", statsController.createStats); // 생성
router.put("/:id", statsController.updateStats); // 업데이트
router.delete("/:id", statsController.deleteStats); // 삭제

module.exports = router;

