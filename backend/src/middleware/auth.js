const tokenService = require('../services/tokenService');
const { User } = require('../models');

// Authenticate JWT token
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'NO_TOKEN',
                    message: 'Yetkilendirme token\'ý bulunamadý'
                }
            });
        }

        const token = authHeader.substring(7);
        const decoded = tokenService.verifyAccessToken(token);

        const user = await User.findByPk(decoded.id);

        if (!user || !user.is_active) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_USER',
                    message: 'Geçersiz kullanýcý veya hesap aktif deðil'
                }
            });
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            full_name: user.full_name
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'AUTHENTICATION_FAILED',
                message: 'Geçersiz veya süresi dolmuþ token'
            }
        });
    }
};

// Authorize specific roles
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'NOT_AUTHENTICATED',
                    message: 'Lütfen önce giriþ yapýn'
                }
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: 'Bu iþlem için yetkiniz yok'
                }
            });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize
};