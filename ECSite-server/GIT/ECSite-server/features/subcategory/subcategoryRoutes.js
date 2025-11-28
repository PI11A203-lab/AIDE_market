const express = require("express");
const router = express.Router();
const subcategoryController = require("./subcategoryController");

// 전체 서브카테고리 목록 (페이징 지원, category_id 필터링 옵션)
router.get("/", subcategoryController.getAllSubCategories);

// 카테고리별 서브카테고리 목록
router.get("/category/:categoryId", subcategoryController.getSubCategoriesByCategoryId);

// ID로 서브카테고리 조회
router.get("/:id", subcategoryController.getSubCategoryById);

// 서브카테고리 생성
router.post("/", subcategoryController.createSubCategory);

// 서브카테고리 업데이트
router.put("/:id", subcategoryController.updateSubCategory);

// 서브카테고리 삭제
router.delete("/:id", subcategoryController.deleteSubCategory);

module.exports = router;

