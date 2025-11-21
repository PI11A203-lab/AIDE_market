const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");

// タグ別商品一覧
router.get("/by-tag/:tagId", tagController.getProductsByTag);

module.exports = router;
