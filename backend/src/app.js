const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Veritabanı bağlantısı
const db = require('./models');

// Rotalar
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// --- DÜZELTME BURADA YAPILDI ---
// Senin gönderdiğin dosya bir obje döndürüyor { errorHandler, notFound }
// O yüzden süslü parantez ile (destructuring) alıyoruz.
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// --- Middleware Ayarları ---
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Ayarı
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Rotalar ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/attendance', attendanceRoutes);

// Sağlık Kontrolü
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Ana Sayfa
app.get('/', (req, res) => {
    res.send('Smart Campus API is Running! 🚀');
});

// --- HATA YÖNETİMİ (SIRASI ÖNEMLİ) ---

// 1. Önce: Hiçbir rota bulunamazsa 404 handler çalışsın
app.use(notFound);

// 2. Sonra: Diğer tüm hatalar için senin yazdığın kapsamlı error handler çalışsın
app.use(errorHandler);

// --- Sunucuyu Başlatma ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Veritabanı bağlantısı başarılı!');

        await db.sequelize.sync({ force: false });
        console.log('✅ Tablolar senkronize edildi.');

        app.listen(PORT, () => {
            console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
            console.log(`📡 URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Sunucu başlatılamadı:', error.message);
        process.exit(1);
    }
};

startServer();