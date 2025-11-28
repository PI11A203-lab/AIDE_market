const express = require("express");
const router = express.Router();
const detailController = require("../controllers/detailController");
const productController = require("../controllers/productController");
const statsController = require("../../stats/statsController");

// 商品統計取得 (/:id より先に定義)
router.get("/:id/stats", detailController.getProductStats);

// 商品統計作成/更新 (upsert)
router.post("/:id/stats", statsController.upsertStatsByProductId);
router.put("/:id/stats", statsController.upsertStatsByProductId);

// 商品シナジー取得 (/:id より先に定義)
router.get("/:id/synergies", detailController.getProductSynergies);

// 商品詳細情報
router.get("/:id", detailController.getProductById);

// 상품 업데이트
router.put("/:id", productController.updateProduct);

// 상품 삭제
router.delete("/:id", productController.deleteProduct);

// 商品購入
router.post("/purchase/:id", detailController.purchaseProduct);

module.exports = router;
