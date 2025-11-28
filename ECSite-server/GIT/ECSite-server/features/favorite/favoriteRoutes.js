const express = require("express");
const router = express.Router();
const favoriteController = require("./favoriteController");

// 사용자별 즐겨찾기 목록
router.get("/users/:userId", favoriteController.getFavoritesByUserId);

// 특정 상품이 즐겨찾기에 있는지 확인
router.get("/users/:userId/products/:productId", favoriteController.checkFavorite);

// ID로 즐겨찾기 조회
router.get("/:id", favoriteController.getFavoriteById);

// 즐겨찾기 추가
router.post("/", favoriteController.createFavorite);

// 즐겨찾기 삭제
router.delete("/users/:userId/products/:productId", favoriteController.deleteFavorite);

module.exports = router;

