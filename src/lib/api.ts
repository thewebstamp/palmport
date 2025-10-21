import axios from 'axios';

// Hardcoded API URL
const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available - UPDATED to check for admin token first
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Check for admin token first, then regular user token
    const adminToken = localStorage.getItem('palmport-admin-token');
    const userToken = localStorage.getItem('palmport-token');
    
    // Use admin token if available, otherwise use user token
    const token = adminToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) => 
    api.post('/auth/register', { name, email, password }),
  
  verify: () => api.get('/auth/verify'),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  
  addToCart: (productId: number, quantity: number) => 
    api.post('/cart/add', { productId, quantity }),
  
  removeFromCart: (productId: number) => 
    api.delete(`/cart/remove/${productId}`),
};

// Products API
export const productsAPI = {
  getProducts: () => api.get('/products'),
  getProduct: (id: number) => api.get(`/products/${id}`),
};

// Batches API
export const batchesAPI = {
  getBatches: () => api.get('/batches'),
  getBatch: (batchId: string) => api.get(`/batches/${batchId}`),
  createBatch: (data: any) => api.post('/batches', data),
  updateBatch: (batchId: string, data: any) => api.put(`/batches/${batchId}`, data),
  deleteBatch: (batchId: string) => api.delete(`/batches/${batchId}`),
};

// Orders API
export const ordersAPI = {
  getOrders: () => api.get('/orders'),
  createOrder: (data: any) => api.post('/orders', data),
  getOrder: (id: number) => api.get(`/orders/${id}`),
};

// Subscribe API
export const subscribeAPI = {
  subscribe: (email: string) => api.post('/subscribe', { email }),
};

export default api;