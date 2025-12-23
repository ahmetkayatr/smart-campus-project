const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Veritabanı bağlantısı ve modeller
const db = require('./models');

// Rotaların İçe Aktarılması
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const walletRoutes = require('./routes/walletRoutes');
const mealRoutes = require('./routes/mealRoutes');
const schedulingRoutes = require('./routes/schedulingRoutes');
const eventRoutes = require('./routes/eventRoutes');

// DİKKAT: Hata bu satırdaydı, eğer dosyan yoksa geçici olarak yorum satırına alıyorum
// const enrollmentRoutes = require('./routes/enrollmentRoutes'); 

const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// --- Middleware Ayarları ---
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Ayarı
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// --- Ana Sayfa ve API Bilgisi ---
app.get('/', (req, res) => {
    res.json({
        message: 'Smart Campus API is Running! 🚀',
        version: '1.0.0',
        endpoints: {
            auth: '/api/v1/auth',
            users: '/api/v1/users',
            courses: '/api/v1/courses',
            attendance: '/api/v1/attendance',
            meals: '/api/v1/meals',
            wallet: '/api/v1/wallet',
            events: '/api/v1/events',
            scheduling: '/api/v1/scheduling'
        }
    });
});

// Sağlık Kontrolü
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        database: db.sequelize ? 'connected' : 'disconnected'
    });
});

// --- API Rotaları (Part 1-3 Entegrasyonu) ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/attendance', attendanceRoutes);

// Part 3 Rotaları
app.use('/api/v1/meals', mealRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/scheduling', schedulingRoutes);

// --- Hata Yönetimi ---
app.use(notFound);
app.use(errorHandler);

// --- Sunucu Başlatma ---
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Veritabanı bağlantısı başarılı!');

        // Part 3 için 'alter: true' kullanarak tabloları otomatik ekliyoruz
        if (process.env.NODE_ENV !== 'production') {
            await db.sequelize.sync({ alter: true });
            console.log('✅ Part 3 Tabloları başarıyla senkronize edildi.');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Sunucu http://localhost:${PORT} üzerinde çalışıyor...`);
        });
    } catch (error) {
        console.error('❌ Sunucu başlatılamadı:', error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;