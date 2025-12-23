import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MealMenu = () => {
    const [menus, setMenus] = useState([]);
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/v1/meals/menus', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Backend bazen { data: [...] } bazen doğrudan [...] dönebilir
            const menuData = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setMenus(menuData);
        } catch (err) {
            console.error("Menü yüklenirken hata oluştu:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = async (menuId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/v1/meals/book',
                { menuId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.qrCode) {
                setQrCode(res.data.qrCode);
                alert("Yemek başarıyla rezerve edildi!");
            }
        } catch (err) {
            console.error("Rezervasyon hatası:", err.response?.data);
            alert(err.response?.data?.message || "Rezervasyon başarısız. Bakiyenizi kontrol edin.");
        }
    };

    if (loading) return <div className="text-center mt-10 font-bold text-indigo-600">Menüler yükleniyor...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Yemek Menüsü ve Rezervasyon</h2>

            {menus.length === 0 ? (
                <div className="bg-yellow-50 p-6 rounded-xl text-yellow-700 text-center border border-yellow-100 shadow-sm">
                    <span className="text-4xl mb-2 block">🍽️</span>
                    Henüz yayınlanmış bir yemek menüsü bulunamadı.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menus.map((menu) => (
                        <div key={menu.id} className="border border-indigo-100 p-5 rounded-xl shadow-sm hover:shadow-md transition bg-white">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-indigo-800">
                                        {/* Tarih hatasını önlemek için güvenli çevrim */}
                                        {menu.date ? new Date(menu.date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }) : "Tarih Belirtilmedi"}
                                    </h3>
                                    <span className="text-sm text-gray-500 uppercase font-medium">
                                        {menu.mealType === 'lunch' ? 'Öğle Yemeği' : 'Akşam Yemeği'}
                                    </span>
                                </div>
                                <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">20 ₺</span>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <ul className="text-gray-700 space-y-1">
                                    {menu.items && typeof menu.items === 'object' ? (
                                        Object.values(menu.items).map((item, i) => (
                                            <li key={i} className="flex items-center">
                                                <span className="mr-2 text-indigo-400">•</span> {item}
                                            </li>
                                        ))
                                    ) : (
                                        <li>Menü içeriği mevcut değil</li>
                                    )}
                                </ul>
                            </div>

                            <button
                                onClick={() => handleReserve(menu.id)}
                                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-sm"
                            >
                                Rezerve Et
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* QR Kod Pop-up */}
            {qrCode && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">Rezervasyon Hazır!</h3>
                        <p className="text-gray-500 text-sm mb-6">Yemekhanede bu QR kodu okutarak yemeğinizi alabilirsiniz.</p>
                        <div className="bg-gray-100 p-4 rounded-xl inline-block mb-6 shadow-inner">
                            <img src={qrCode} alt="Rezervasyon QR Kod" className="w-48 h-48 mx-auto" />
                        </div>
                        <button
                            onClick={() => setQrCode(null)}
                            className="w-full py-2 bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 rounded-lg transition"
                        >
                            Anladım, Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealMenu;