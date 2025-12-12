const express = require("express");
const router = express.Router();
const cartController = require("./cartController");

// 사용자별 장바구니 조회
router.get("/users/:userId", cartController.getCartByUserId);

// 장바구니에 상품 추가
router.post("/", cartController.addToCart);

// 장바구니에서 상품 제거
router.delete("/users/:userId/products/:productId", cartController.removeFromCart);

// 장바구니 아이템 수량 변경
router.put("/quantity", cartController.updateCartItemQuantity);

// 장바구니 비우기
router.delete("/users/:userId", cartController.clearCart);

module.exports = router;

