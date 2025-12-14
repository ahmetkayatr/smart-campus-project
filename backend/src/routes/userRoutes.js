const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { updateProfileValidation } = require('../utils/validators');

// All routes require authentication
router.use(authenticate);

// GET /api/v1/users/me
router.get('/me', userController.getProfile);

// PUT /api/v1/users/me
router.put('/me', updateProfileValidation, userController.updateProfile);

// POST /api/v1/users/me/profile-picture
router.post('/me/profile-picture', upload.single('profilePicture'), userController.uploadProfilePicture);

// GET /api/v1/users
router.get('/', authorize('admin'), userController.getAllUsers);

module.exports = router;