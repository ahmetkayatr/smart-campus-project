const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbUrl = process.env.DB_URL;

let sequelize;

if (dbUrl) {
    console.log("🌍 Database: Render (Uzak Sunucu) modunda bağlanılıyor...");
    sequelize = new Sequelize(dbUrl, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false 
            }
        },
        logging: false
    });
} else {
    console.log("💻 Database: Local modunda (config.json) çalışılıyor...");

    const env = process.env.NODE_ENV || 'development';
    const config = require('./config.json')[env];

    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

module.exports = sequelize;