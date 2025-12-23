const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('MealReservation', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
        menuId: { type: DataTypes.UUID, allowNull: false, field: 'menu_id' },
        qrCode: { type: DataTypes.TEXT, field: 'qr_code' }, // Base64 için TEXT daha güvenli
        status: { type: DataTypes.ENUM('reserved', 'used', 'cancelled'), defaultValue: 'reserved' },
        usedAt: { type: DataTypes.DATE, field: 'used_at' }
    }, { tableName: 'meal_reservations', underscored: true });
};