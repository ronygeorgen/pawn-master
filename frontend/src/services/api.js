import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('access');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.refreshToken();
            if (newAccessToken) {
              localStorage.setItem('access', newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.client(originalRequest); // Retry original request
            }
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            window.location.href = '/admin/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async refreshToken() {
    const refresh = localStorage.getItem('refresh');

    if (!refresh) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/core/token/refresh/`, {
        refresh,
      });

      return response.data.access; // expected { access: 'new_token' }
    } catch (error) {
      throw error;
    }
  }

  async get(url, config) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data, config) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete(url, config) {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();