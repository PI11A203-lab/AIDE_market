const express = require("express");
const router = express.Router();
const userMailSettingController = require("./userMailSettingController");

// 사용자별 메일 설정 조회
router.get("/users/:userId", userMailSettingController.getMailSettingByUserId);

// 전체 메일 설정 목록 (관리자용)
router.get("/", userMailSettingController.getAllMailSettings);

// ID로 메일 설정 조회
router.get("/:id", userMailSettingController.getMailSettingById);

// 메일 설정 생성 또는 업데이트 (upsert)
router.post("/", userMailSettingController.upsertMailSetting);

// 메일 설정 업데이트
router.put("/:id", userMailSettingController.updateMailSetting);

// 메일 설정 삭제 (ID로)
router.delete("/:id", userMailSettingController.deleteMailSetting);

// 메일 설정 삭제 (user_id로)
router.delete("/users/:userId", userMailSettingController.deleteMailSettingByUserId);

module.exports = router;

