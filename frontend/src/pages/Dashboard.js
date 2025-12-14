import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    const isInstructor = user?.role === 'admin' || user?.role === 'faculty';

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* 1. ÜST BAŞLIK */}
            <div className="bg-indigo-600 rounded-xl p-8 text-white shadow-lg mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Hoş Geldin, {user?.full_name || 'Kullanıcı'}! 👋</h1>
                        <p className="opacity-90 text-indigo-100">
                            {isInstructor 
                                ? "Akademik yönetim paneline hoş geldiniz." 
                                : "Derslerini ve yoklamalarını buradan takip edebilirsin."}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                        <span className="bg-white/20 px-3 py-1 rounded text-sm font-mono">
                            Rol: {user?.role?.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. KARTLAR GRID YAPISI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* KART 1: AKADEMİK (Dersler) */}
                <Link to="/courses" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-indigo-500">
                    <div className="flex flex-col items-center">
                        <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                            <span className="text-3xl group-hover:text-white transition-colors">📚</span>
                        </div>
                        {/* Hoca ise 'Verilen Ders', Öğrenci ise 'Derslerim' */}
                        <h3 className="font-bold text-gray-800 text-lg">
                            {isInstructor ? "Verilen Dersler" : "Derslerim"}
                        </h3>
                        <p className="text-4xl font-extrabold text-indigo-600 my-2">1</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {isInstructor ? "Yönetilen Ders" : "Kayıtlı Ders"}
                        </p>
                    </div>
                </Link>

                {/* KART 2: YOKLAMA (ARTIK AKTİF!) */}
                <Link to="/courses" className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-green-500">
                    <div className="flex flex-col items-center">
                        <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-600 transition-colors duration-300">
                            <span className="text-3xl group-hover:text-white transition-colors">✅</span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">
                            {isInstructor ? "Yoklama Yönetimi" : "Yoklama"}
                        </h3>
                        <p className="text-4xl font-bold text-green-600 my-2">
                            {isInstructor ? "Aktif" : "%100"}
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {isInstructor ? "Oturum Aç/Kapat" : "Devam Oranı"}
                        </p>
                    </div>
                </Link>

                {/* KART 3: YEMEK (Part 3 - Pasif) */}
                <div className="bg-white p-6 rounded-xl shadow-md opacity-60 cursor-not-allowed relative grayscale hover:grayscale-0 transition-all">
                    <div className="flex flex-col items-center">
                        <div className="bg-yellow-100 p-4 rounded-full mb-4">
                            <span className="text-3xl">🍽️</span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Yemek</h3>
                        <p className="text-xs text-gray-400 mt-2">Part 3 ile gelecek</p>
                    </div>
                    <span className="absolute top-3 right-3 bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full">YAKINDA</span>
                </div>

                {/* KART 4: ETKİNLİK (Part 3 - Pasif) */}
                <div className="bg-white p-6 rounded-xl shadow-md opacity-60 cursor-not-allowed relative grayscale hover:grayscale-0 transition-all">
                    <div className="flex flex-col items-center">
                        <div className="bg-purple-100 p-4 rounded-full mb-4">
                            <span className="text-3xl">📅</span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Etkinlik</h3>
                        <p className="text-xs text-gray-400 mt-2">Part 3 ile gelecek</p>
                    </div>
                    <span className="absolute top-3 right-3 bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full">YAKINDA</span>
                </div>
            </div>

            {/* KULLANICI BİLGİLERİ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Hesap Detayları</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <span className="text-gray-500 text-sm">Email</span>
                        <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Yetki Seviyesi</span>
                        <p className="font-medium capitalize text-indigo-600">{user?.role}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm">Sistem Durumu</span>
                        <p className="font-medium text-green-600">Online</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;