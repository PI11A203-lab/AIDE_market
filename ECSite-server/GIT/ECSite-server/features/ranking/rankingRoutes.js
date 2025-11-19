const express = require("express");
const router = express.Router();
const rankingController = require("./rankingController");

router.get("/monthly", rankingController.getMonthlyRankings);

module.exports = router;

