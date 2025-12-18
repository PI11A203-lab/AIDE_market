const express = require("express");
const router = express.Router();
const productActivationController = require("./productActivationController");
// const auth = require("../../middleware/auth"); // 인증 미들웨어 (필요시 활성화)

// 사용자 활성화 코드 목록 조회
router.get("/users/:userId", productActivationController.getUserActivations);

// 활성화 코드 재활성화
router.post("/:id/reactivate", productActivationController.reactivateActivation);

// 활성화 코드 검증
router.get("/verify/:code", productActivationController.verifyActivationCode);

module.exports = router;

