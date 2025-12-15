/// <reference types="vite/client" />
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    dateOfBirth: string;
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  getMe: () => api.get('/auth/me'),

  updateProfile: (data: any) => api.put('/auth/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/auth/change-password', data),
};

// Lotto API
export const lottoAPI = {
  getJackpots: () => api.get('/lotto/jackpots'),

  getGameRules: () => api.get('/lotto/games'),

  createOrder: (data: { tickets: any[]; location?: any }) =>
    api.post('/lotto/orders', data),

  getUserOrders: () => api.get('/lotto/orders'),

  getOrder: (id: string) => api.get(`/lotto/orders/${id}`),

  cancelOrder: (id: string) => api.put(`/lotto/orders/${id}/cancel`),

  getUserTickets: () => api.get('/lotto/tickets'),

  getTicket: (id: string) => api.get(`/lotto/tickets/${id}`),

  quickPick: (gameType: string) =>
    api.post('/lotto/quick-pick', { gameType }),

  getDrawHistory: (params?: { gameType?: string; limit?: number }) =>
    api.get('/lotto/draws/history', { params }),

  getDrawResult: (gameType: string, date: string) =>
    api.get(`/lotto/draws/${gameType}/${date}`),
};

// Payment API
export const paymentAPI = {
  createIntent: (data: {
    orderId: string;
    orderType: string;
    paymentMethod: string;
  }) => api.post('/payments/create-intent', data),

  confirmPayment: (data: { paymentId: string; paymentIntentId: string }) =>
    api.post('/payments/confirm', data),

  generatePromptPayQR: (data: { orderId: string; orderType: string }) =>
    api.post('/payments/promptpay', data),

  getPaymentStatus: (id: string) => api.get(`/payments/${id}/status`),
};

export default api;
