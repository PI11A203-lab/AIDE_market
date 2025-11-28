const express = require("express");
const router = express.Router();
const paymentMethodController = require("./paymentMethodController");

// 사용자별 결제방법 목록 조회
router.get("/users/:userId", paymentMethodController.getByUserId);

// ID로 결제방법 조회
router.get("/:id", paymentMethodController.getById);

// 결제방법 생성
router.post("/", paymentMethodController.createPaymentMethod);

// 결제방법 업데이트
router.put("/:id", paymentMethodController.updatePaymentMethod);

// 결제방법 삭제
router.delete("/:id", paymentMethodController.deletePaymentMethod);

module.exports = router;

