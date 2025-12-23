const QRCode = require('qrcode');

exports.generateQRCode = async (data) => {
    try {
        return await QRCode.toDataURL(data); // Frontend'de direkt <img> tag'inde kullanýlýr
    } catch (err) {
        console.error('QR Code error:', err);
        throw new Error('QR kod üretilemedi');
    }
};