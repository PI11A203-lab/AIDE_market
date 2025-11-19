const express = require("express");
const router = express.Router();
const productController = require("./productController");

// 상품 목록 (페이지네이션 + 필터)
router.get("/", productController.getProducts);

// 카테고리별 대표 상품 조회 (메인 페이지용)
router.get("/featured/category/:categoryId", productController.getFeaturedProductsByCategory);

// 카테고리별 상품 목록 (/:id 보다 먼저 정의해야 함)
router.get("/category/:categoryId", productController.getProductsByCategory);

// 태그별 상품 목록 (/:id 보다 먼저 정의해야 함)
router.get("/by-tag/:tagId", productController.getProductsByTag);

// 상품 통계 조회 (/:id 보다 먼저 정의해야 함)
router.get("/:id/stats", productController.getProductStats);

// 상품 시너지 조회 (/:id 보다 먼저 정의해야 함)
router.get("/:id/synergies", productController.getProductSynergies);

// 상품 상세 정보
router.get("/:id", productController.getProductById);

// 상품 생성
router.post("/", productController.createProduct);

// 상품 구매
router.post("/purchase/:id", productController.purchaseProduct);

module.exports = router;
