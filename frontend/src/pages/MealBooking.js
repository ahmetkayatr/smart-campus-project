import React, { useState } from 'react';
import api from '../services/api';

const MealBooking = ({ menuId }) => {
    const [qr, setQr] = useState(null);

    const handleBook = async () => {
        try {
            const res = await api.post('/meals/book', { menuId });
            setQr(res.data.qrCode);
            alert("Rezervasyon baþarýlý!");
        } catch (err) {
            alert(err.response?.data?.message || "Hata oluþtu");
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <button onClick={handleBook} className="bg-green-600 text-white px-4 py-2 rounded">
                Yemek Rezerve Et (50 TL)
            </button>
            {qr && (
                <div className="mt-4">
                    <p className="font-bold">QR Kodunuz:</p>
                    <img src={qr} alt="Meal QR" className="w-48 h-48" />
                </div>
            )}
        </div>
    );
};