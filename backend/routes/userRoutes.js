const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.showUsers);
router.post("/", userController.storeUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;