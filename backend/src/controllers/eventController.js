const { Event, EventRegistration, User } = require('../models');
const EventService = require('../services/eventService'); // ✅ FIX

const getEvents = async (req, res) => {
    try {
        const { category, date, status = 'published' } = req.query;
        const where = { status };

        if (category) where.category = category;
        if (date) where.date = date;

        const events = await Event.findAll({
            where,
            order: [['date', 'ASC'], ['startTime', 'ASC']]
        });

        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ success: false, error: 'Etkinlik bulunamadı' });
        }

        res.json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const organizerId = req.user.id;
        const eventData = { ...req.body, organizerId };

        const event = await Event.create(eventData);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Etkinlik bulunamadı' });
        }

        await event.update(updates);
        res.json({ success: true, data: event });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({ success: false, error: 'Etkinlik bulunamadı' });
        }

        event.status = 'cancelled';
        await event.save();
        res.json({ success: true, message: 'Etkinlik iptal edildi' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const registerForEvent = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { customFields } = req.body;

        const result = await EventService.registerForEvent({
            userId,
            eventId: id,
            customFields
        });

        res.status(201).json({
            success: true,
            data: result.registration,
            qrCode: result.qrCodeImage
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const cancelRegistration = async (req, res) => {
    try {
        const userId = req.user.id;
        const { registrationId } = req.params;

        const registration = await EventService.cancelRegistration(registrationId, userId);

        res.json({ success: true, data: registration });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const getMyRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;

        const registrations = await EventRegistration.findAll({
            where: { userId },
            include: [Event],
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getEventRegistrations = async (req, res) => {
    try {
        const { id } = req.params;

        const registrations = await EventRegistration.findAll({
            where: { eventId: id },
            include: [{ model: User, attributes: ['id', 'fullName', 'email'] }],
            order: [['createdAt', 'ASC']]
        });

        res.json({ success: true, data: registrations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const checkIn = async (req, res) => {
    try {
        const { qrCode } = req.body;

        const registration = await EventService.checkIn(qrCode);

        res.json({
            success: true,
            message: 'Giriş başarılı',
            data: registration
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    getMyRegistrations,
    getEventRegistrations,
    checkIn
};