const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Schedule', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        sectionId: { type: DataTypes.UUID, allowNull: false, field: 'section_id' },
        classroomId: { type: DataTypes.UUID, allowNull: false, field: 'classroom_id' },
        instructorId: { type: DataTypes.UUID, allowNull: false, field: 'instructor_id' },
        dayOfWeek: { type: DataTypes.INTEGER, allowNull: false, field: 'day_of_week' },
        startTime: { type: DataTypes.TIME, allowNull: false, field: 'start_time' },
        endTime: { type: DataTypes.TIME, allowNull: false, field: 'end_time' }
    }, { tableName: 'schedules', underscored: true });
};