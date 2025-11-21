const express = require("express");
const router = express.Router();
const detailController = require("../controllers/detailController");

// 商品統計取得 (/:id より先に定義)
router.get("/:id/stats", detailController.getProductStats);

// 商品シナジー取得 (/:id より先に定義)
router.get("/:id/synergies", detailController.getProductSynergies);

// 商品詳細情報
router.get("/:id", detailController.getProductById);

// 商品購入
router.post("/purchase/:id", detailController.purchaseProduct);

module.exports = router;
