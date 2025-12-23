import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Wallet = () => {
    const [wallet, setWallet] = useState({ balance: 0 });
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/v1/wallet/balance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Backend doğrudan objeyi mi yoksa data içinde mi dönüyor kontrolü
            const balanceData = res.data.balance !== undefined ? res.data : { balance: res.data };
            setWallet(balanceData);
        } catch (err) {
            console.error("Bakiye yüklenemedi:", err);
        }
    };

    const handleTopUp = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("Lütfen geçerli bir miktar giriniz.");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/v1/wallet/topup',
                { amount: parseFloat(amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success || res.status === 200) {
                alert("Bakiye başarıyla yüklendi!");
                setAmount('');
                fetchBalance();
            }
        } catch (err) {
            console.error("Yükleme hatası detayı:", err.response?.data);
            alert("Hata: " + (err.response?.data?.message || "Cüzdan kaydı bulunamadı veya sunucu hatası."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-10 max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cüzdanım</h2>
            <div className="bg-indigo-600 p-6 rounded-lg text-white mb-8 shadow-inner">
                <p className="text-indigo-100 text-sm mb-1 uppercase tracking-wider">Mevcut Bakiye</p>
                <p className="text-4xl font-black">
                    {typeof wallet.balance === 'number' ? wallet.balance.toFixed(2) : "0.00"} ₺
                </p>
            </div>
            <div className="space-y-4">
                <input
                    type="number"
                    placeholder="Yüklenecek miktar"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                />
                <button
                    onClick={handleTopUp}
                    disabled={loading}
                    className={`w-full ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-3 rounded-lg font-bold transition shadow-md`}
                >
                    {loading ? 'İşleniyor...' : 'Bakiye Yükle'}
                </button>
            </div>
        </div>
    );
};

export default Wallet;