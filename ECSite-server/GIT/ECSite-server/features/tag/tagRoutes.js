const express = require("express");
const router = express.Router();
const tagController = require("./tagController");

router.get("/", tagController.getTags);
router.post("/", tagController.createTag);

module.exports = router;

