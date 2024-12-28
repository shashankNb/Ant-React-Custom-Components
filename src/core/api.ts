import axiosInstance from "axios";
import {message} from "../bundles/AntD.tsx";

export const BaseUrl = 'http://localhost:8000/api';
export const FrontendUrl = 'http://localhost:5174';

const axios = axiosInstance;
axios.defaults.baseURL = BaseUrl;

const refreshToken = async () => {
    try {
        const response: any = await axios.post('/auth/refresh-token', {});
        return response.token;
    } catch (error) {
        console.log(error);
        message.error("Failed to reauthenticate. Please contact support");
        localStorage.removeItem("token");
        window.location.reload();
        throw new Error('Token Refresh Failed');
    }
};

axios.interceptors.request.use(async (config) => {
    const url = new URL(config.url, axios.defaults.baseURL);
    const appId = localStorage.getItem('appId');
    if (localStorage.getItem('appId') == null) {
        localStorage.removeItem("token");
    } else {
        url.searchParams.set('appId', appId);
    }
    if (!(config.url === '/auth/authenticate'
        || config.url === '/auth/register'
        || config.url === '/auth/forgot-password'
        || config.url === '/auth/verify-email'
        || config.url === '/client-enquiry'
        || config.url === '/auth/reset-password')) {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error('Token Not Found');
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.url = url.toString().replace(url.origin, '');
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    return response.data;
}, async (error) => {
    const originalRequest = error.config;
    if (error && error.response && error.response.status === 401
        && !originalRequest._retry
        && error.response.data
        && error.response.data.name === 'TokenExpiredException') {
        originalRequest._retry = true;
        try {
            // Refresh token
            const newToken = await refreshToken();
            localStorage.setItem("token", newToken);
            originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
            return axios(originalRequest);
        } catch (refreshError) {
            console.error(refreshError);
            throw refreshError;
        }
    }
    return Promise.reject(error);
});

export default axios;
