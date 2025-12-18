const express = require("express");
const router = express.Router();
const subscriptionController = require("./subscriptionController");
// const auth = require("../../middleware/auth"); // 인증 미들웨어 (필요시 활성화)

// 구독 생성
router.post("/", subscriptionController.createSubscription);

// 사용자 구독 목록 조회
router.get("/users/:userId", subscriptionController.getSubscriptionsByUser);

// 구독 상세 조회
router.get("/:id", subscriptionController.getSubscriptionById);

// 토큰으로 구독 정보 조회 (이메일 링크용)
router.get("/reminder/:token", subscriptionController.getSubscriptionByToken);

// 결제 수단 변경
router.put("/:id/payment-method", subscriptionController.updatePaymentMethod);

// 쿠폰 변경
router.put("/:id/coupon", subscriptionController.updateCoupon);

// 언어 설정 변경
router.put("/:id/language", subscriptionController.updateLanguage);

// 구독 취소
router.post("/:id/cancel", subscriptionController.cancelSubscription);

module.exports = router;

