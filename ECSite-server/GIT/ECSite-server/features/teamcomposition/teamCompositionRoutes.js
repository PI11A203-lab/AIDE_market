const express = require("express");
const router = express.Router();
const teamCompositionController = require("./teamCompositionController");

// 사용자별 팀 구성 목록
router.get("/users/:userId", teamCompositionController.getTeamCompositionsByUserId);

// 전체 팀 구성 목록 (관리자용)
router.get("/", teamCompositionController.getAllTeamCompositions);

// ID로 팀 구성 조회
router.get("/:id", teamCompositionController.getTeamCompositionById);

// 팀 구성 생성
router.post("/", teamCompositionController.createTeamComposition);

// 팀 구성 업데이트
router.put("/:id", teamCompositionController.updateTeamComposition);

// 팀 구성 삭제
router.delete("/:id", teamCompositionController.deleteTeamComposition);

module.exports = router;

