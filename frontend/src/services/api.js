import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hotel_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response unwrapping and auth handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 unauthorized
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('hotel_jwt_token');
        localStorage.removeItem('hotel_user');
      }
    }
    return Promise.reject(error.response?.data || error.message || 'Unknown network error');
  }
);

// API Service Methods
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const roomApi = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  search: (params) => api.post('/rooms/search', params),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  updateStatus: (id, status) => api.patch(`/rooms/${id}/status?status=${status}`),
  delete: (id) => api.delete(`/rooms/${id}`),
};

export const roomTypeApi = {
  getAll: () => api.get('/room-types'),
  getById: (id) => api.get(`/room-types/${id}`),
  create: (data) => api.post('/room-types', data),
  update: (id, data) => api.put(`/room-types/${id}`, data),
  delete: (id) => api.delete(`/room-types/${id}`),
};

export const reservationApi = {
  create: (data) => api.post('/reservations', data),
  getMy: () => api.get('/reservations/my'),
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  getByRef: (ref) => api.get(`/reservations/ref/${ref}`),
  cancel: (id) => api.put(`/reservations/${id}/cancel`),
  updateStatus: (id, status) => api.patch(`/reservations/${id}/status?status=${status}`),
};

export const paymentApi = {
  simulate: (data) => api.post('/payments/simulate', data),
  getByReservation: (resId) => api.get(`/payments/reservation/${resId}`),
  getAll: () => api.get('/payments'),
};

export const inventoryApi = {
  getAll: () => api.get('/inventory'),
  getLowStock: () => api.get('/inventory/low-stock'),
  getById: (id) => api.get(`/inventory/${id}`),
  getBySku: (sku) => api.get(`/inventory/sku/${sku}`),
  getByCategory: (catId) => api.get(`/inventory/category/${catId}`),
  getByWarehouse: (whId) => api.get(`/inventory/warehouse/${whId}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const warehouseApi = {
  getAll: () => api.get('/warehouses'),
  getById: (id) => api.get(`/warehouses/${id}`),
  create: (data) => api.post('/warehouses', data),
  update: (id, data) => api.put(`/warehouses/${id}`, data),
  delete: (id) => api.delete(`/warehouses/${id}`),
};

export const warehouseLocationApi = {
  getAll: () => api.get('/warehouse-locations'),
  getByWarehouse: (whId) => api.get(`/warehouse-locations/warehouse/${whId}`),
  getById: (id) => api.get(`/warehouse-locations/${id}`),
  create: (data) => api.post('/warehouse-locations', data),
  update: (id, data) => api.put(`/warehouse-locations/${id}`, data),
  delete: (id) => api.delete(`/warehouse-locations/${id}`),
};

export const supplierApi = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

export const stockApi = {
  stockIn: (data) => api.post('/stock/in', data),
  stockOut: (data) => api.post('/stock/out', data),
  transfer: (data) => api.post('/stock/transfer', data),
  adjustment: (data) => api.post('/stock/adjustment', data),
  getTransactions: () => api.get('/stock/transactions'),
  getRecent: () => api.get('/stock/transactions/recent'),
  getByItem: (itemId) => api.get(`/stock/transactions/item/${itemId}`),
};

export const housekeepingApi = {
  prepareRoom: (data) => api.post('/housekeeping/prepare-room', data),
};

export const dashboardApi = {
  getStats: () => api.get('/admin/dashboard/stats'),
};

export const userApi = {
  getAll: () => api.get('/admin/users'),
  getById: (id) => api.get(`/admin/users/${id}`),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  delete: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
