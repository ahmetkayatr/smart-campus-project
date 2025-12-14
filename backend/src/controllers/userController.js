const { User, Student, Faculty, Department } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs').promises;

class UserController {
    async getProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                include: [
                    { model: Student, as: 'student', include: [{ model: Department, as: 'department' }] },
                    { model: Faculty, as: 'faculty', include: [{ model: Department, as: 'department' }] }
                ]
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'Kullanýcý bulunamadý'
                    }
                });
            }

            res.status(200).json({
                success: true,
                data: user.toJSON()
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: error.message
                }
            });
        }
    }

    async updateProfile(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const { full_name, phone } = req.body;
            const user = await User.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'Kullanýcý bulunamadý'
                    }
                });
            }

            if (full_name) user.full_name = full_name;
            if (phone) user.phone = phone;

            await user.save();

            res.status(200).json({
                success: true,
                message: 'Profil baþarýyla güncellendi',
                data: user.toJSON()
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'UPDATE_ERROR',
                    message: error.message
                }
            });
        }
    }

    async uploadProfilePicture(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'NO_FILE',
                        message: 'Lütfen bir dosya yükleyin'
                    }
                });
            }

            const user = await User.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'Kullanýcý bulunamadý'
                    }
                });
            }

            if (user.profile_picture_url) {
                const oldPath = path.join(__dirname, '../../', user.profile_picture_url);
                try {
                    await fs.unlink(oldPath);
                } catch (err) {
                    console.log('Old profile picture not found');
                }
            }

            user.profile_picture_url = `/uploads/profile-pictures/${req.file.filename}`;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Profil fotoðrafý baþarýyla yüklendi',
                data: {
                    profile_picture_url: user.profile_picture_url
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'UPLOAD_ERROR',
                    message: error.message
                }
            });
        }
    }

    async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 10, role, search } = req.query;

            const offset = (page - 1) * limit;
            const whereClause = {};

            if (role) {
                whereClause.role = role;
            }

            if (search) {
                whereClause[Op.or] = [
                    { full_name: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const { count, rows } = await User.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [
                    { model: Student, as: 'student', include: [{ model: Department, as: 'department' }] },
                    { model: Faculty, as: 'faculty', include: [{ model: Department, as: 'department' }] }
                ],
                order: [['created_at', 'DESC']]
            });

            res.status(200).json({
                success: true,
                data: {
                    users: rows.map(user => user.toJSON()),
                    pagination: {
                        total: count,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        totalPages: Math.ceil(count / limit)
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: error.message
                }
            });
        }
    }
}

module.exports = new UserController();