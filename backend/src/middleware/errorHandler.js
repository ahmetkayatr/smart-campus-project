// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Veri doğrulama hatası',
                details: err.errors.map(e => ({
                    field: e.path,
                    message: e.message
                }))
            }
        });
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            error: {
                code: 'DUPLICATE_ENTRY',
                message: 'Bu değer zaten kayıtlı',
                details: err.errors.map(e => ({
                    field: e.path,
                    message: `${e.path} zaten kullanılıyor`
                }))
            }
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Geçersiz token'
            }
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: {
                code: 'TOKEN_EXPIRED',
                message: 'Token süresi dolmuş'
            }
        });
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'FILE_TOO_LARGE',
                    message: 'Dosya boyutu çok büyük (max 5MB)'
                }
            });
        }
        return res.status(400).json({
            success: false,
            error: {
                code: 'FILE_UPLOAD_ERROR',
                message: err.message
            }
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        error: {
            code: err.code || 'SERVER_ERROR',
            message: err.message || 'Sunucu hatası oluştu'
        }
    });
};

// 404 handler
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route bulunamadı: ${req.method} ${req.path}`
        }
    });
};

module.exports = {
    errorHandler,
    notFound
};