const { sequelize } = require('../config/database');

// Import models
const User = require('./User')(sequelize);
const Department = require('./Department')(sequelize);
const Student = require('./Student')(sequelize);
const Faculty = require('./Faculty')(sequelize);

// Define associations
User.hasOne(Student, {
    foreignKey: 'user_id',
    as: 'student'
});
Student.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasOne(Faculty, {
    foreignKey: 'user_id',
    as: 'faculty'
});
Faculty.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Department.hasMany(Student, {
    foreignKey: 'department_id',
    as: 'students'
});
Student.belongsTo(Department, {
    foreignKey: 'department_id',
    as: 'department'
});

Department.hasMany(Faculty, {
    foreignKey: 'department_id',
    as: 'faculty'
});
Faculty.belongsTo(Department, {
    foreignKey: 'department_id',
    as: 'department'
});

Faculty.hasMany(Student, {
    foreignKey: 'advisor_id',
    as: 'advisees'
});
Student.belongsTo(Faculty, {
    foreignKey: 'advisor_id',
    as: 'advisor'
});

// Sync database
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized successfully.');
    } catch (error) {
        console.error('❌ Database sync error:', error);
    }
};

module.exports = {
    sequelize,
    User,
    Department,
    Student,
    Faculty,
    syncDatabase
};