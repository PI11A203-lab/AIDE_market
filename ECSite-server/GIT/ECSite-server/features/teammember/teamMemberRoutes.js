const express = require("express");
const router = express.Router();
const teamMemberController = require("./teamMemberController");

// 팀별 멤버 목록
router.get("/teams/:teamId", teamMemberController.getTeamMembersByTeamId);

// ID로 팀 멤버 조회
router.get("/:id", teamMemberController.getTeamMemberById);

// 팀 멤버 추가
router.post("/", teamMemberController.addTeamMember);

// 팀 멤버 업데이트
router.put("/:id", teamMemberController.updateTeamMember);

// 팀 멤버 삭제 (ID로)
router.delete("/:id", teamMemberController.removeTeamMember);

// 팀 멤버 삭제 (team_id와 product_id로)
router.delete("/teams/:teamId/products/:productId", teamMemberController.removeTeamMemberByTeamAndProduct);

module.exports = router;

