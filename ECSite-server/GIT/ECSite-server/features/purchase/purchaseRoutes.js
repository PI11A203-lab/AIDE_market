const express = require("express");
const router = express.Router();
const purchaseController = require("./purchaseController");

router.post("/:id", purchaseController.purchaseProduct);

module.exports = router;
