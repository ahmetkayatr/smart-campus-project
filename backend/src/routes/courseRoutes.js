const express = require('express');
const router = express.Router();
const { Client } = require('pg'); // Postgres istemcisini doğrudan çağırıyoruz

// Bu fonksiyon her istek geldiğinde veritabanına taze bir bağlantı açar
const getDbClient = () => {
    return new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'smart_campus_db',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });
};

router.get('/', async (req, res) => {
    let client;
    try {
        // 1. Bağlantıyı oluştur ve aç
        client = getDbClient();
        await client.connect();

        // 2. Sorguyu at
        const result = await client.query('SELECT * FROM courses');

        // 3. Sonucu gönder
        console.log("✅ Dersler başarıyla çekildi:", result.rows.length, "adet");
        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (err) {
        console.error("❌ Dersleri çekerken hata oldu:", err);
        // Hata olsa bile çökmemesi için boş array dönüyoruz ama konsola hatayı basıyoruz
        res.status(500).json({ success: false, message: 'Veritabanı hatası', error: err.message });
    } finally {
        // 4. Bağlantıyı mutlaka kapat (Yoksa sunucu şişer)
        if (client) {
            await client.end();
        }
    }
});

module.exports = router;