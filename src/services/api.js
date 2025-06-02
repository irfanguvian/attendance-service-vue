import { API_BASE_URL } from '@/config/api';
import axios from 'axios';
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Adjustable base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle token expiration and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Redirect to login or handle as appropriate
          // For now, just reject
          return Promise.reject(error);
        }
        const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/exchange-token`, {
          refresh_token: refreshToken,
        });
        localStorage.setItem('accessToken', data.data.access_token);
        localStorage.setItem('refreshToken', data.data.refresh_token);
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.data.access_token;
        originalRequest.headers['Authorization'] = 'Bearer ' + data.data.access_token;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Optionally, redirect to login page
        // window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
