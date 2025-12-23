const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Model Fonksiyonlarını İçe Aktar (Functional Factory Pattern)
const UserModel = require('./User');
const DepartmentModel = require('./Department');
const StudentModel = require('./Student');
const FacultyModel = require('./Faculty');
const WalletModel = require('./Wallet');             // Part 3
const EventModel = require('./Event');               // Part 3
const MealMenuModel = require('./MealMenu');         // Part 3 - Hata buradaydı, Model olarak güncellendi
const MealReservationModel = require('./MealReservation'); // Part 3
const ScheduleModel = require('./Schedule');         // Part 3

// Modelleri Initialize Et (sequelize nesnesini enjekte ediyoruz)
const User = UserModel(sequelize);
const Department = DepartmentModel(sequelize);
const Student = StudentModel(sequelize);
const Faculty = FacultyModel(sequelize);
const Wallet = WalletModel(sequelize);
const Event = EventModel(sequelize);
const MealMenu = MealMenuModel(sequelize);
const MealReservation = MealReservationModel(sequelize);
const Schedule = ScheduleModel(sequelize);

// ==========================================
// ASSOCIATIONS (İLİŞKİLER)
// ==========================================

// --- Part 1 & 2 İlişkiler ---
User.hasOne(Student, { foreignKey: 'user_id', as: 'student', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Faculty, { foreignKey: 'user_id', as: 'faculty', onDelete: 'CASCADE' });
Faculty.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Department.hasMany(Student, { foreignKey: 'department_id', as: 'students' });
Student.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

Department.hasMany(Faculty, { foreignKey: 'department_id', as: 'faculty_members' });
Faculty.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });

User.hasMany(Student, { foreignKey: 'advisor_id', as: 'advisees' });
Student.belongsTo(User, { foreignKey: 'advisor_id', as: 'advisor' });

// --- Part 3 Yeni İlişkiler ---

// Wallet & User (One-to-One)
User.hasOne(Wallet, { foreignKey: 'user_id', as: 'wallet', onDelete: 'CASCADE' });
Wallet.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// MealReservation & Menu İlişkileri
User.hasMany(MealReservation, { foreignKey: 'user_id', as: 'meal_reservations' });
MealReservation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

MealMenu.hasMany(MealReservation, { foreignKey: 'menu_id', as: 'reservations' });
MealReservation.belongsTo(MealMenu, { foreignKey: 'menu_id', as: 'menu' });

// Event & User (Many-to-Many Kayıt Sistemi)
User.belongsToMany(Event, { through: 'event_registrations', as: 'registered_events', foreignKey: 'user_id' });
Event.belongsToMany(User, { through: 'event_registrations', as: 'attendees', foreignKey: 'event_id' });

// Schedule (Ders Programı) İlişkileri
User.hasMany(Schedule, { foreignKey: 'instructor_id', as: 'teaching_schedule' });
Schedule.belongsTo(User, { foreignKey: 'instructor_id', as: 'instructor' });

// ==========================================
// DATABASE SYNC & EXPORT
// ==========================================

const syncDatabase = async () => {
    try {
        // alter: true, tabloları silmeden yeni sütunları/tabloları ekler
        await sequelize.sync({ alter: true });
        console.log('✅ Veritabanı başarıyla senkronize edildi ve Part 3 tabloları eklendi.');
    } catch (error) {
        console.error('❌ Database sync error:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    Op,
    User,
    Department,
    Student,
    Faculty,
    Wallet,
    Event,
    MealMenu,
    MealReservation,
    Schedule,
    syncDatabase
};