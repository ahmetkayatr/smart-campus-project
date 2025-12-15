'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

let sequelize;

// --- DİKKAT: BURASI GÜNCELLENDİ (HİBRİT AYAR) ---

const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL;

// 1. DURUM: Render'daysak (DATABASE_URL veya DB_URL varsa)
if (databaseUrl) {
    console.log("🌍 Render ortamı algılandı. Uzak veritabanına bağlanılıyor...");
    sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
}
// 2. DURUM: Bilgisayarındaysak (Local)
else {
    console.log("💻 Local ortam algılandı. Bilgisayarındaki config kullanılıyor...");
    // Config dosyasını dinamik bul
    const configPath = path.resolve(__dirname, '..', 'config', 'config.json');
    const config = require(configPath)[env];

    if (config.use_env_variable) {
        sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
        sequelize = new Sequelize(config.database, config.username, config.password, config);
    }
}

// --------------------------------------------------

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;