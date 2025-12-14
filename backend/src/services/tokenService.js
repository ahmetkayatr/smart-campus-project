const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class TokenService {
    generateAccessToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m'
        });
    }

    generateRefreshToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            type: 'refresh'
        };

        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
        });
    }

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }

    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    generateVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    generateResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    generateTokenExpiry(hours = 24) {
        return new Date(Date.now() + hours * 60 * 60 * 1000);
    }
}

module.exports = new TokenService();