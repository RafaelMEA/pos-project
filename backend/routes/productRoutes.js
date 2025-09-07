const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get('/', productController.getProducts);
router.post('/', productController.storeProduct);
router.put('/:id', productController.updateProduct);

module.exports = router;

<CardFooter>
  <Eye
    className="h-5 w-5 cursor-pointer"
    onClick={() => navigate(`/products/${product.product_id}`, { state: { product, categories } })}
  />
  <Pencil
    className="h-5 w-5 cursor-pointer"
    onClick={() => setEditProduct(product)}
  />
</CardFooter>