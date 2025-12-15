import axios from 'axios';

// 1. Base URL (Canlý ve Local Uyumlu)
const BASE_URL = process.env.REACT_APP_API_URL || 'https://smart-campus-backend-1aqy.onrender.com/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
});

// 2. Token Ekleme (Her istekte çalýþýr)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));


// --- SÝHÝRLÝ KISIM BURASI (ESKÝ KODLARI KURTARAN ADAPTÖRLER) ---

// AuthContext.js'in aradýðý 'authAPI'yi burada elle oluþturuyoruz
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
};

// Profile.js ve AuthContext.js'in aradýðý 'userAPI'yi oluþturuyoruz
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
};

// Varsayýlan olarak ham api'yi de dýþarý veriyoruz
export default api;