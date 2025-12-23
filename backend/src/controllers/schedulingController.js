const { Schedule, Classroom, CourseSection, Course, Enrollment, sequelize } = require('../models');
const SchedulingService = require('../services/schedulingService');

const generateSchedule = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { semester, year } = req.body;

        const sections = await CourseSection.findAll({
            where: { semester, year, status: 'pending' },
            include: [Course]
        });

        if (sections.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ success: false, error: 'Ders bulunamadý' });
        }

        // Servis fonksiyon ismi generateSchedule olarak güncellendi
        const schedulesData = await SchedulingService.generateSchedule(sections);

        await Schedule.destroy({ where: {}, transaction });
        const createdSchedules = await Schedule.bulkCreate(schedulesData, { transaction });

        await transaction.commit();
        res.json({ success: true, message: 'Program oluþturuldu', data: createdSchedules });
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(400).json({ success: false, error: error.message });
    }
};

const getMySchedule = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        let schedules = [];

        if (userRole === 'student') {
            const enrollments = await Enrollment.findAll({
                where: { user_id: userId },
                include: [{
                    model: CourseSection,
                    include: [Course, { model: Schedule, include: [Classroom] }]
                }]
            });
            enrollments.forEach(e => {
                if (e.CourseSection?.Schedules) schedules.push(...e.CourseSection.Schedules);
            });
        } else if (userRole === 'faculty') {
            schedules = await Schedule.findAll({
                where: { instructor_id: userId },
                include: [Classroom, { model: CourseSection, include: [Course] }]
            });
        }
        res.json({ success: true, data: schedules });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: [{ model: CourseSection, include: [Course] }, Classroom],
            order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
        });
        res.json({ success: true, data: schedules });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const exportICalendar = async (req, res) => {
    res.send("Ýþlem Baþarýlý");
};

module.exports = {
    generateSchedule,
    getMySchedule,
    getAllSchedules,
    exportICalendar
};