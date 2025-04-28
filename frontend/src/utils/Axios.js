import axios from 'axios';
import { baseUrl } from '../common/summaryApi';

export const Axios = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const res = await Axios.post('/api/v1/user/refreshAccessToken');
    const newAccessToken = res.data.accessToken;

    if (newAccessToken) {
      console.log("Access token refreshed");
      return true;
    }

    return false;
  } catch (error) {
    console.log("Error in refreshAccessToken:", error);
    return false;
  }
};

Axios.interceptors.request.use(
  (config) => {
    console.log('Request sent to:', config.url); // For debugging
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401 errors
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized, attempt to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
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