'use client';

import { create } from 'zustand';
import { post } from './api';

export interface User {
  id: string;
  phone: string;
  nickname?: string;
  avatar?: string;
  is_admin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { phone: string; code?: string; password?: string }) => Promise<void>;
  register: (data: { phone: string; code: string; password: string; nickname?: string }) => Promise<void>;
  logout: () => void;
  initialize: () => void;
  setAuth: (user: User, token: string, refreshToken?: string) => void;
}

const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const clearCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          setCookie('token', token);
          set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          clearCookie('token');
          clearCookie('refreshToken');
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  setAuth: (user: User, token: string, refreshToken?: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      setCookie('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        setCookie('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true });
  },

  login: async (data) => {
    const endpoint = data.code ? '/auth/login-phone' : '/auth/login-password';
    const response = await post<{ access_token: string; refresh_token: string; user: User }>(endpoint, data);
    const { access_token: token, refresh_token: refreshToken, user } = response;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      setCookie('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        setCookie('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true });
  },

  register: async (data) => {
    const response = await post<{ access_token: string; refresh_token: string; user: User }>('/auth/register', data);
    const { access_token: token, refresh_token: refreshToken, user } = response;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      setCookie('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        setCookie('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      clearCookie('token');
      clearCookie('refreshToken');
    }
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },
}));
