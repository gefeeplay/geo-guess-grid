import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',  // поменяй на свой backend
});

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
