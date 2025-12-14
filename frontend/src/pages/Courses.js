import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState("");

    // 1. Backend'den Dersleri Çek
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Token varsa header'a eklemek gerekir, şimdilik düz çekiyoruz
                const response = await axios.get('http://localhost:5000/api/v1/courses');
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
                    // Backend'e POST isteği at
                    const response = await axios.post('http://localhost:5000/api/v1/attendance/checkin', {
                        sessionId: courseId, // Şimdilik ders ID'sini session ID gibi kullanıyoruz
                        studentLatitude: latitude,
                        studentLongitude: longitude
                    });

                    if (response.data.success) {
                        alert("✅ Yoklama Başarılı! \n" + response.data.message);
                        setStatusMessage("İşlem Başarili.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("❌ Yoklama Başarısız: Sunucu hatasi.");
                    setStatusMessage("Hata oluştu.");
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
                <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">
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