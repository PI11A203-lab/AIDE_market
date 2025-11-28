const express = require("express");
const router = express.Router();
const orderCouponController = require("./orderCouponController");

// 전체 주문 쿠폰 목록 (페이징, order_id, user_id, coupon_id 필터링 지원)
router.get("/", orderCouponController.getAllOrderCoupons);

// 주문별 주문 쿠폰 목록
router.get("/orders/:orderId", orderCouponController.getOrderCouponsByOrderId);

// 사용자별 주문 쿠폰 목록
router.get("/users/:userId", orderCouponController.getOrderCouponsByUserId);

// 쿠폰별 주문 쿠폰 목록
router.get("/coupons/:couponId", orderCouponController.getOrderCouponsByCouponId);

// ID로 주문 쿠폰 조회
router.get("/:id", orderCouponController.getOrderCouponById);

// 주문 쿠폰 생성
router.post("/", orderCouponController.createOrderCoupon);

// 주문 쿠폰 업데이트
router.put("/:id", orderCouponController.updateOrderCoupon);

// 주문 쿠폰 삭제
router.delete("/:id", orderCouponController.deleteOrderCoupon);

module.exports = router;

