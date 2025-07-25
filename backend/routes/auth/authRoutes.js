const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authController');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);

module.exports = router;

