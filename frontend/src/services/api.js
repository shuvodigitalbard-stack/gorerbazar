import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (slug) => API.get(`/products/${slug}`);
export const getFeaturedProducts = () => API.get('/products/featured');
export const getBestSellingProducts = () => API.get('/products/bestselling');
export const createProduct = (data) => API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Categories
export const getCategories = () => API.get('/categories');
export const getCategory = (slug) => API.get(`/categories/${slug}`);
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getOrders = (params) => API.get('/orders', { params });
export const getOrderStats = () => API.get('/orders/stats');
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);

// Banners
export const getBanners = (params) => API.get('/banners', { params });
export const createBanner = (data) => API.post('/banners', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBanner = (id, data) => API.put(`/banners/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBanner = (id) => API.delete(`/banners/${id}`);

// Reviews
export const getReviews = (params) => API.get('/reviews', { params });
export const createReview = (data) => API.post('/reviews', data);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
