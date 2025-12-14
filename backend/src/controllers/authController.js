const authService = require('../services/authService');
const { validationResult } = require('express-validator');

class AuthController {
    // Register
    async register(req, res) {
        try {
            // Validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const result = await authService.register(req.body);

            res.status(201).json({
                success: true,
                message: result.message,
                data: result.user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: {
                    code: 'REGISTRATION_ERROR',
                    message: error.message
                }
            });
        }
    }

    // Verify email
    async verifyEmail(req, res) {
        try {
            const { token } = req.params;

            const result = await authService.verifyEmail(token);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: {
                    code: 'VERIFICATION_ERROR',
                    message: error.message
                }
            });
        }
    }

    // Login
    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email, password } = req.body;
            const result = await authService.login(email, password);

            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    user: result.user,
                    tokens: result.tokens
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'LOGIN_ERROR',
                    message: error.message
                }
            });
        }
    }

    // Refresh token
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'MISSING_TOKEN',
                        message: 'Refresh token gerekli'
                    }
                });
            }

            const result = await authService.refreshToken(refreshToken);

            res.status(200).json({
                success: true,
                data: {
                    accessToken: result.accessToken
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                error: {
                    code: 'REFRESH_ERROR',
                    message: error.message
                }
            });
        }
    }

    // Logout
    async logout(req, res) {
        try {
            // In a production app, you'd invalidate the token here
            // For now, we'll just return success
            res.status(204).send();
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'LOGOUT_ERROR',
                    message: error.message
                }
            });
        }
    }

    // Forgot password
    async forgotPassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { email } = req.body;
            const result = await authService.forgotPassword(email);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'FORGOT_PASSWORD_ERROR',
                    message: error.message
                }
            });
        }
    }

    // Reset password
    async resetPassword(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { token } = req.params;
            const { newPassword } = req.body;

            const result = await authService.resetPassword(token, newPassword);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: {
                    code: 'RESET_PASSWORD_ERROR',
                    message: error.message
                }
            });
        }
    }
}

module.exports = new AuthController();