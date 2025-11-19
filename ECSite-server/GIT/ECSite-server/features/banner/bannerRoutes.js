const express = require("express");
const router = express.Router();
const bannerController = require("./bannerController");

router.get("/", bannerController.getBanners);
router.post("/", bannerController.createBanner);

module.exports = router;
