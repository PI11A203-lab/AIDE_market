const express = require("express");
const router = express.Router();
const couponController = require("./couponController");

// 전체 쿠폰 목록 (페이징 지원, activeOnly 필터 옵션)
router.get("/", couponController.getAllCoupons);

// 쿠폰 코드로 조회
router.get("/code/:code", couponController.getCouponByCode);

// ID로 쿠폰 조회
router.get("/:id", couponController.getCouponById);

// 쿠폰 유효성 검사 및 할인 계산
router.post("/validate", couponController.validateCoupon);

// 쿠폰 생성
router.post("/", couponController.createCoupon);

// 쿠폰 업데이트
router.put("/:id", couponController.updateCoupon);

// 쿠폰 삭제
router.delete("/:id", couponController.deleteCoupon);

module.exports = router;

