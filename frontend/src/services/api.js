import axios from 'axios';

// 1. Base URL Ayarý
// Vercel'deki ayarý alýr, yoksa doðrudan Render linkini kullanýr.
const BASE_URL = process.env.REACT_APP_API_URL || 'https://smart-campus-backend-1aqy.onrender.com/api/v1';

// 2. Axios Instance Oluþturma
const api = axios.create({
    baseURL: BASE_URL,
});

// 3. Otomatik Token Ekleme (Interceptor)
// Her istekten önce LocalStorage'a bakar, token varsa ekler.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 4. TEK VE SON EXPORT (Hatanýn sebebi çift export olmasýydý)
export default api;