const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Wallet', {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id', unique: true },
        balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
        isScholarship: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_scholarship' }
    }, { tableName: 'wallets', underscored: true });
};