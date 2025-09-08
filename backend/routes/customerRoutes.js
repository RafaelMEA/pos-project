const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/", customerController.showCustomers);
router.post("/", customerController.storeCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;