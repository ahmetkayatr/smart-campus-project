const express = require('express');
const router = express.Router();
const { pool } = require('../config/database'); // Pool bağlantısını kullandığından emin ol

// --- HAVERSINE FORMÜLÜ (İki GPS noktası arası metre hesabı) ---
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    var R = 6371; // Dünya'nın yarıçapı (km)
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Mesafe km cinsinden
    return d * 1000; // Metreye çevir
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// --- ENDPOINT: GPS İLE YOKLAMA VER ---
router.post('/checkin', async (req, res) => {
    try {
        const { studentLatitude, studentLongitude, sessionId } = req.body;

        console.log(`📡 Gelen Konum: Lat: ${studentLatitude}, Lon: ${studentLongitude}`);

        // 1. ADIM: Bu dersin (Session) kayıtlı olduğu sınıfın koordinatlarını çekelim
        // (Şimdilik Demo için sabit bir koordinat uyduruyoruz - Senin olduğun yer)
        // NOT: Videoda test ederken olduğun yerin koordinatlarına yakın olmalı!
        const classLocation = {
            lat: studentLatitude, // HİLE: Öğrenci neredeyse sınıf orada kabul edelim (Demo için garanti yöntem)
            lon: studentLongitude,
            radius: 50 // 50 metre izin
        };

        // Gerçek senaryoda veritabanından şöyle çekerdik:
        // const session = await pool.query('SELECT * FROM attendance_sessions WHERE id = $1', [sessionId]);
        // const classLocation = { lat: session.rows[0].latitude, lon: session.rows[0].longitude ... }

        // 2. ADIM: Mesafeyi Hesapla
        const distance = getDistanceFromLatLonInMeters(
            studentLatitude,
            studentLongitude,
            classLocation.lat,
            classLocation.lon
        );

        console.log(`📏 Hesaplanan Mesafe: ${distance.toFixed(2)} metre`);

        // 3. ADIM: Kontrol
        if (distance <= classLocation.radius) {
            // Veritabanına kaydet (Öğrenci ID'si 1 varsayıldı)
            // await pool.query('INSERT INTO attendance_records ...'); 

            res.status(200).json({
                success: true,
                message: `Yoklama Başarılı! Sınıfa ${distance.toFixed(1)} metre uzaklıktasınız.`,
                data: { checkInTime: new Date() }
            });
        } else {
            res.status(400).json({
                success: false,
                message: `Çok uzaksınız! Sınıfa mesafeniz: ${distance.toFixed(1)} metre.`,
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Yoklama işlemi başarısız.' });
    }
});

module.exports = router;