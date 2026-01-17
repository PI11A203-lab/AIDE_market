const express = require("express");
const router = express.Router();
const templateController = require("./templateController");

router.get("/", templateController.getTemplates);
router.get("/by-product/:productId", templateController.getTemplatesByProduct);
router.get("/:id", templateController.getTemplateById);

module.exports = router;
