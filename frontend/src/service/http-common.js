import axios from "axios";

const httpCommon = axios.create({
    baseURL: 'http://localhost:8083/api/relief-hub',
    headers: {
        'Content-Type': 'application/json',
    }
});

httpCommon.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

httpCommon.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 403 || error.response?.status === 401) {
            console.error('Authentication failed - redirecting to landing page');

            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('user');

            window.location.href = '/';
        }

        return Promise.reject(error);
    }
);

export default httpCommon;