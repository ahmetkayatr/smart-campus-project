import axios from 'axios';

// 1. Base URL Ayarý
const BASE_URL = process.env.REACT_APP_API_URL || 'https://smart-campus-backend-1aqy.onrender.com/api/v1';

// 2. Axios Instance Oluþturma
const api = axios.create({
    baseURL: BASE_URL,
});

// 3. Otomatik Token Ekleme (Interceptor)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- SÝHÝRLÝ DOKUNUÞ BURADA ---
// Hem 'api' diyeni, hem 'userAPI' diyeni mutlu ediyoruz.
export const userAPI = api;
export default api;