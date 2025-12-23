import axios from 'axios';

// 1. Base URL (Canlý ve Local Uyumlu)
const BASE_URL = 'http://localhost:5000/api/v1';
const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));



export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
};

export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
};

export default api;