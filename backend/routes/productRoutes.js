const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get('/', productController.getProducts);
router.post('/', productController.storeProduct);

module.exports = router;