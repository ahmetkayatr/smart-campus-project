const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Event', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        date: { type: DataTypes.DATEONLY, allowNull: false },
        startTime: { type: DataTypes.TIME, field: 'start_time' },
        capacity: { type: DataTypes.INTEGER, allowNull: false },
        registeredCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'registered_count' },
        price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }
    }, { tableName: 'events', underscored: true });
};