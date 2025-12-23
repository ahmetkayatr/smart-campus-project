const express = require('express');
const router = express.Router();

const {
    generateSchedule,
    getMySchedule,
    getAllSchedules,
    exportICalendar
} = require('../controllers/schedulingController');

const { authenticate } = require('../middleware/auth');

// 🔒 AUTH DÜZGÜN ŞEKİLDE KULLANILIYOR
router.post('/generate', authenticate, generateSchedule);
router.get('/my-schedule', authenticate, getMySchedule);
router.get('/all', authenticate, getAllSchedules);
router.get('/export-ical', authenticate, exportICalendar);

module.exports = router;
