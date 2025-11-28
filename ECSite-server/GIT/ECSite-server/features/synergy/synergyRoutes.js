const express = require("express");
const router = express.Router();
const synergyController = require("./synergyController");

// 상품별 시너지 목록
router.get("/products/:productId", synergyController.getSynergiesByProductId);

// ID로 시너지 조회
router.get("/:id", synergyController.getSynergyById);

// 시너지 생성
router.post("/", synergyController.createSynergy);

// 시너지 업데이트
router.put("/:id", synergyController.updateSynergy);

// 시너지 삭제
router.delete("/:id", synergyController.deleteSynergy);

module.exports = router;

