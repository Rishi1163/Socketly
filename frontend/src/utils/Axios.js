import axios from 'axios';
import { baseUrl } from '../common/summaryApi';

export const Axios = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // Send cookies (refreshToken/accessToken) with requests
});

const refreshAccessToken = async () => {
  try {
    const res = await Axios.post('/api/v1/user/refreshAccessToken');
    const newAccessToken = res.data.accessToken;

    if (newAccessToken) {
      console.log("Access token refreshed");
      // Set default Authorization header with new token
      Axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.log("Error in refreshAccessToken:", error);
    return null;
  }
};

// Request interceptor for debugging and injecting token if needed
Axios.interceptors.request.use(
  (config) => {
    console.log('Request sent to:', config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to retry request if access token expired
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return Axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);