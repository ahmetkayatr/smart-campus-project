const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation
} = require('../utils/validators');

// POST /api/v1/auth/register
router.post('/register', registerValidation, authController.register);

// GET /api/v1/auth/verify-email/:token
router.get('/verify-email/:token', authController.verifyEmail);

// POST /api/v1/auth/login
router.post('/login', loginValidation, authController.login);

// POST /api/v1/auth/refresh
router.post('/refresh', authController.refreshToken);

// POST /api/v1/auth/logout
router.post('/logout', authController.logout);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);

// POST /api/v1/auth/reset-password/:token
router.post('/reset-password/:token', resetPasswordValidation, authController.resetPassword);

module.exports = router;