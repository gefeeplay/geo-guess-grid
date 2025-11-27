import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',  // поменяй на свой backend
});

// Добавляем интерцептор для автоматической подстановки токена
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// REGISTER
export function registerUser(email, password) {
    return api.post('/auth/register', {
        email,
        password
    });
}

// LOGIN
export function loginUser(email, password) {
    return api.post('/auth/login', {
        email,
        password
    });
}

export function getUserInfo() {
    return api.get('/auth/me');
}