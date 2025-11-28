const express = require("express");
const router = express.Router();
const reviewController = require("./reviewController");

// 상품별 리뷰 목록
router.get("/products/:productId", reviewController.getReviewsByProductId);

// 사용자별 리뷰 목록
router.get("/users/:userId", reviewController.getReviewsByUserId);

// ID로 리뷰 조회
router.get("/:id", reviewController.getReviewById);

// 리뷰 생성
router.post("/", reviewController.createReview);

// 리뷰 업데이트
router.put("/:id", reviewController.updateReview);

// 리뷰 삭제
router.delete("/:id", reviewController.deleteReview);

module.exports = router;

