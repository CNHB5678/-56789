import axios, { AxiosInstance, AxiosResponse } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const get = <T = any>(url: string, config?: any) =>
  api.get<T>(url, config).then((res) => res.data);

export const post = <T = any>(url: string, data?: any, config?: any) =>
  api.post<T>(url, data, config).then((res) => res.data);

export const put = <T = any>(url: string, data?: any, config?: any) =>
  api.put<T>(url, data, config).then((res) => res.data);

export const del = <T = any>(url: string, config?: any) =>
  api.delete<T>(url, config).then((res) => res.data);

export default api;
