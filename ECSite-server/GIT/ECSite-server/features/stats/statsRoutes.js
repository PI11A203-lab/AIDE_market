const express = require("express");
const router = express.Router();
const statsController = require("./statsController");

router.get("/overview", statsController.getOverview);

module.exports = router;

