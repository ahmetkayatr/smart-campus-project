const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('MealMenu', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        cafeteriaId: { type: DataTypes.UUID, allowNull: false, field: 'cafeteria_id' },
        date: { type: DataTypes.DATEONLY, allowNull: false },
        mealType: { type: DataTypes.ENUM('lunch', 'dinner'), allowNull: false, field: 'meal_type' },
        items: { type: DataTypes.JSONB, allowNull: false },
        nutrition: { type: DataTypes.JSONB },
        isPublished: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_published' }
    }, { tableName: 'meal_menus', underscored: true });
};