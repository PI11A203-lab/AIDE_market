const express = require("express");
const router = express.Router();
const orderItemController = require("./orderItemController");

// 전체 주문 아이템 목록 (페이징, order_id, product_id 필터링 지원)
router.get("/", orderItemController.getAllOrderItems);

// 주문별 주문 아이템 목록
router.get("/orders/:orderId", orderItemController.getOrderItemsByOrderId);

// 주문별 주문 아이템 총합 계산
router.get("/orders/:orderId/total", orderItemController.getOrderItemsTotal);

// 상품별 주문 아이템 목록
router.get("/products/:productId", orderItemController.getOrderItemsByProductId);

// ID로 주문 아이템 조회
router.get("/:id", orderItemController.getOrderItemById);

// 주문 아이템 생성
router.post("/", orderItemController.createOrderItem);

// 주문 아이템 업데이트
router.put("/:id", orderItemController.updateOrderItem);

// 주문 아이템 삭제
router.delete("/:id", orderItemController.deleteOrderItem);

module.exports = router;

