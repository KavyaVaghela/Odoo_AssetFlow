const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Authentication routes mapped under /api/admin/auth/
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
