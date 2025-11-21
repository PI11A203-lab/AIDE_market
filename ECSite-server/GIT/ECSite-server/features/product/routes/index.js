const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const categoryRoutes = require("./category");
const tagRoutes = require("./tag");
const detailRoutes = require("./detail");

// 商品一覧 (ページネーション + フィルタ)
router.get("/", productController.getProducts);

// 商品作成
router.post("/", productController.createProduct);

// カテゴリ関連ルート
router.use("/", categoryRoutes);

// タグ関連ルート
router.use("/", tagRoutes);

// 商品詳細関連ルート (最後に配置)
router.use("/", detailRoutes);

module.exports = router;
