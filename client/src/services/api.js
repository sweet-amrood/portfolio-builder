import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  google: (credential) => api.post('/auth/google', { credential }),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

export const profileAPI = {
  get: () => api.get('/profile'),
  update: (profile) => api.put('/profile', { profile }),
  parseResume: (formData) =>
    api.post('/profile/resume/parse', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const portfolioAPI = {
  checkSlug: (slug) => api.get(`/portfolio/slug/check/${encodeURIComponent(slug)}`),
  getSuggestions: (base) => api.get('/portfolio/slug/suggestions', { params: { base } }),
  getMine: () => api.get('/portfolio/me'),
  publish: (payload) => api.post('/portfolio/publish', payload),
  unpublish: () => api.post('/portfolio/unpublish'),
  getPublic: (slug) => api.get(`/portfolio/public/${encodeURIComponent(slug)}`),
};

export const messagesAPI = {
  getStats: () => api.get('/messages/stats'),
  list: () => api.get('/messages'),
  getConversation: (conversationId) => api.get(`/messages/${conversationId}`),
  reply: (conversationId, message) => api.post(`/messages/${conversationId}/reply`, { message }),
  sendPublic: (slug, payload) => api.post(`/messages/public/${encodeURIComponent(slug)}`, payload),
  getVisitorThread: (visitorToken) =>
    api.get('/messages/public/thread', { params: { visitorToken } }),
  replyPublic: (payload) => api.post('/messages/public/reply', payload),
  resumePublic: (payload) => api.post('/messages/public/resume', payload),
};

export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
  getEvents: (page = 1, limit = 25) =>
    api.get('/analytics/events', { params: { page, limit } }),
  track: (slug, payload) => api.post(`/analytics/track/${encodeURIComponent(slug)}`, payload),
};

export default api;
