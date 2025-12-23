const express = require('express');
const router = express.Router();
// Controller ismin farklýysa burayý kontrol et
const enrollmentController = require('../controllers/enrollmentController'); 
const auth = require('../middleware/auth');

// Part 2 Kayýt Rotalarý
router.post('/', auth, enrollmentController.enrollCourse); 
router.get('/my-courses', auth, enrollmentController.getMyCourses);
router.delete('/:id', auth, enrollmentController.dropCourse);

module.exports = router;