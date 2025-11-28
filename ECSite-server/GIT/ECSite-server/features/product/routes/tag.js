const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

// タグ別商品一覧
router.get("/by-tag/:tagId", tagController.getProductsByTag);

// 상품의 태그 목록
router.get("/:productId/tags", tagController.getTagsByProductId);

// 상품에 태그 추가
router.post("/:productId/tags", tagController.addTagToProduct);

// 상품에서 태그 제거
router.delete("/:productId/tags/:tagId", tagController.removeTagFromProduct);

module.exports = router;
