const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/auth');

// Events
router.get('/', authenticate, eventController.getEvents);
router.get('/:id', authenticate, eventController.getEvent);
router.post('/', authenticate, eventController.createEvent);
router.put('/:id', authenticate, eventController.updateEvent);
router.delete('/:id', authenticate, eventController.deleteEvent);

// Registrations
router.post('/:id/register', authenticate, eventController.registerForEvent);
router.delete('/:eventId/registrations/:registrationId', authenticate, eventController.cancelRegistration);
router.get('/registrations/my', authenticate, eventController.getMyRegistrations);
router.get('/:id/registrations', authenticate, eventController.getEventRegistrations);

// Check-in
router.post('/checkin', authenticate, eventController.checkIn);

module.exports = router;