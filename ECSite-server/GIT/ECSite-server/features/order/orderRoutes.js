const express = require("express");
const router = express.Router();
const orderController = require("./orderController");

// 전체 주문 목록 (페이징, user_id, status 필터링 지원)
router.get("/", orderController.getAllOrders);

// 사용자별 주문 목록
router.get("/users/:userId", orderController.getOrdersByUserId);

// 주문 번호로 주문 조회
router.get("/order-number/:orderNumber", orderController.getOrderByOrderNumber);

// ID로 주문 조회
router.get("/:id", orderController.getOrderById);

// 주문 생성
router.post("/", orderController.createOrder);

// 주문 업데이트
router.put("/:id", orderController.updateOrder);

// 주문 삭제
router.delete("/:id", orderController.deleteOrder);

module.exports = router;

