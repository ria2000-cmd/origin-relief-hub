// utils/auth.js
import axios from "axios";

export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const getStoredToken = () => {
    const tokenData = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (tokenData) {
        const { token, expiresAt } = JSON.parse(tokenData);
        if (Date.now() < expiresAt) {
            return token;
        } else {
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
        }
    }
    return null;
};

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    setAuthToken(null);
};