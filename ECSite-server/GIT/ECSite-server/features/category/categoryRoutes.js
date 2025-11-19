const express = require("express");
const router = express.Router();
const categoryController = require("./categoryController");

router.get("/", categoryController.getCategories);
router.get("/with-products", categoryController.getCategoriesWithFeaturedProducts);
router.get("/:id/subcategories", categoryController.getSubcategories);
router.post("/", categoryController.createCategory);

module.exports = router;

