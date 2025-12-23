const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Authenticate middleware
exports.authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Token bulunamadý'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Kullanýcý bulunamadý'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Geçersiz token'
        });
    }
};

// Authorize middleware (role-based)
exports.authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Kimlik doðrulama gerekli'
            });
        }

        if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Bu iþlem için yetkiniz yok'
            });
        }

        next();
    };
};