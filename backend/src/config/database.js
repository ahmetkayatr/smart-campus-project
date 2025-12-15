const { Sequelize } = require('sequelize');
require('dotenv').config();

// Render'da tanımladığımız DB_URL değişkenini alıyoruz
const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ HATA: DB_URL bulunamadı! Render Environment Variables ayarlarını kontrol et.');
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false // Render için bu ayar ŞART!
    }
  },
  logging: false // Konsolu kirletmemesi için logları kapatıyoruz
});

module.exports = sequelize;