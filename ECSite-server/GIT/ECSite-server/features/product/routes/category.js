const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// カテゴリ別代表商品取得 (メインページ用)
router.get("/featured/category/:categoryId", categoryController.getFeaturedProductsByCategory);

// カテゴリ別商品一覧
router.get("/category/:categoryId", categoryController.getProductsByCategory);

module.exports = router;
