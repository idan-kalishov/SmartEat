import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_GW_URL;

const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout for all requests
});

// Add response interceptor for refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(`${BACKEND_URL}/auth/refresh`, null, {
                    withCredentials: true,
                });
                return api(originalRequest);
            } catch (refreshError) {
                console.error(refreshError);
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api; 