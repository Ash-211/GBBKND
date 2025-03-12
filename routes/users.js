const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');

// POST /api/users/register - Register a new user
router.post('/register', userController.registerUser);

// POST /api/users/login - User login
router.post('/login', userController.loginUser);

// GET /api/users/verify-email - Verify user's email with a token (e.g., ?token=xyz)
router.get('/verify-email', userController.verifyEmail);

// POST /api/users/resend-verification - Resend email verification link
router.post('/resend-verification', userController.resendVerificationEmail);

module.exports = router;
