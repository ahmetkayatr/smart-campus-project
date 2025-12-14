require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
// YENİ EKLENENLER (PART 2):
const courseRoutes = require('./routes/courseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart Campus API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// --- API ROUTES ---
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
// YENİ EKLENENLER (PART 2):
app.use(`/api/${API_VERSION}/courses`, courseRoutes);
app.use(`/api/${API_VERSION}/attendance`, attendanceRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        await testConnection();
        // await syncDatabase(); // Şimdilik sync'i kapattım, tabloları SQL ile elle oluşturduk.

        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║      🎓 SMART CAMPUS API SERVER                ║
║                                                ║
║      Environment: ${(process.env.NODE_ENV || 'DEVELOPMENT').toUpperCase().padEnd(10)}        ║
║      Port:        ${PORT}                          ║
║      API Version: ${API_VERSION}                          ║
║      Base URL:    http://localhost:${PORT}/api/${API_VERSION}  ║
║                                                ║
║      ✅ Server is running successfully!        ║
║                                                ║
╚════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});

startServer();

module.exports = app;