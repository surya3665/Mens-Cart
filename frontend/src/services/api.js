import axios from 'axios'

// Create a configured axios instance
// baseURL points to our Express backend
const api = axios.create({
  baseURL: '/api',
})

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Automatically adds the JWT token to every request's Authorization header
// so we don't have to do it manually in each API call.
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

// ─── Auth API ────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
}

// ─── Products API ─────────────────────────────────────────────────────────────
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),   // params: page, limit, search
  getById: (id) => api.get(`/products/${id}`),
}

// ─── Cart API ─────────────────────────────────────────────────────────────────
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { productId, quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
}

// ─── Orders API ───────────────────────────────────────────────────────────────
export const orderAPI = {
  placeOrder: (shippingAddress) => api.post('/orders', { shippingAddress }),
  getMyOrders: () => api.get('/orders/my'),
}

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminAPI = {
  createProduct: (formData) =>
    api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProduct: (id, formData) =>
    api.put(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getAllUsers: () => api.get('/admin/users'),
  getAllOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}`, { status }),
}

export default api