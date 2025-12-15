import React, { useState, useEffect } from 'react';
// Axios yerine kendi oluşturduğumuz merkezi API servisini çağırıyoruz
import api from '../services/api';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    // 1. Backend'den Dersleri Çek
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // ARTIK UZUN LİNK YOK: api.js zaten başını (Render URL) ekliyor
                const response = await api.get('/courses');

                if (response.data.success) {
                    setCourses(response.data.data);
                }
            } catch (error) {
                console.error("Dersler yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // 2. GPS ile Yoklama Gönder
    const handleCheckIn = (courseId) => {
        setStatusMessage("Konum alınıyor...");

        if (!navigator.geolocation) {
            setStatusMessage("Tarayıcınız konum özelliğini desteklemiyor.");
            return;
        }

        // Konumu Al
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setStatusMessage("Konum alındı, sunucuya gönderiliyor...");

                try {
                    // DÜZELTME: localhost yerine api servisi kullanıldı
                    const response = await api.post('/attendance/checkin', {
                        sessionId: courseId,
                        studentLatitude: latitude,
                        studentLongitude: longitude
                    });

                    if (response.data.success) {
                        alert("✅ Yoklama Başarılı! \n" + response.data.message);
                        setStatusMessage("İşlem Başarılı.");
                    }
                } catch (error) {
                    console.error(error);
                    // Hata mesajını backend'den gelen detayla gösterelim
                    const errorMsg = error.response?.data?.message || "Sunucu hatası.";
                    alert("❌ Yoklama Başarısız: " + errorMsg);
                    setStatusMessage("Hata: " + errorMsg);
                }
            },
            (error) => {
                console.error(error);
                setStatusMessage("Konum izni verilmedi veya hata oluştu.");
                alert("Lütfen tarayıcıdan konum izni verin.");
            }
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Akademik Derslerim</h1>

            {statusMessage && (
                <div className={`p-3 rounded mb-4 ${statusMessage.includes("Hata") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                    {statusMessage}
                </div>
            )}

            {loading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-indigo-700">{course.code}</h2>
                                    <h3 className="text-lg font-bold mt-1">{course.name}</h3>
                                    <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Aktif Dönem
                                </span>
                            </div>

                            <div className="mt-6 border-t pt-4">
                                <button
                                    onClick={() => handleCheckIn(course.id)}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                                >
                                    📍 GPS ile Yoklama Ver
                                </button>
                            </div>
                        </div>
                    ))}

                    {courses.length === 0 && (
                        <p className="text-gray-500">Henüz atanmış bir dersiniz yok.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Courses;