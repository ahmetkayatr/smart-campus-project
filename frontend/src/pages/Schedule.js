import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Schedule = () => {
    const [schedule, setSchedule] = useState([]);
    const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/v1/scheduling/my-schedule', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSchedule(res.data.data || []);
            } catch (err) {
                console.error("Program yüklenemedi", err);
            }
        };
        fetchSchedule();
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-indigo-800">Haftalık Ders Programım</h2>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-indigo-600 text-white">
                            <th className="p-4 border border-indigo-500">Gün / Saat</th>
                            <th className="p-4 border border-indigo-500">09:00 - 11:00</th>
                            <th className="p-4 border border-indigo-500">11:00 - 13:00</th>
                            <th className="p-4 border border-indigo-500">13:00 - 15:00</th>
                            <th className="p-4 border border-indigo-500">15:00 - 17:00</th>
                        </tr>
                    </thead>
                    <tbody>
                        {days.map((dayName, dayIdx) => (
                            <tr key={dayIdx} className="hover:bg-indigo-50 transition-colors">
                                <td className="p-4 border font-bold bg-gray-50 text-gray-700">{dayName}</td>
                                {['09:00', '11:00', '13:00', '15:00'].map(time => {
                                    const lesson = schedule.find(s => s.day_of_week === (dayIdx + 1) && s.start_time === time);
                                    return (
                                        <td key={time} className="p-4 border text-sm min-h-[80px]">
                                            {lesson ? (
                                                <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-indigo-500">
                                                    <p className="font-bold text-indigo-900">{lesson.CourseSection?.Course?.name || 'Ders'}</p>
                                                    <p className="text-xs text-gray-500 mt-1">📍 {lesson.Classroom?.building} - {lesson.Classroom?.room_number}</p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 italic">Boş</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Schedule;