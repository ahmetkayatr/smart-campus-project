const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cafeteria = sequelize.define('Cafeteria', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'cafeterias',
    underscored: true
});

module.exports = Cafeteria;