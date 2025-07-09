const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get('/', categoryController.showCategories);
router.post('/', categoryController.storeCategories);
router.put('/:id', categoryController.updateCategory);

module.exports = router;