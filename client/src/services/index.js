import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const internshipService = {
  create: (data) => api.post('/internships', data),
  getAll: (params) => api.get('/internships', { params }),
  getOne: (id) => api.get(`/internships/${id}`),
  update: (id, data) => api.put(`/internships/${id}`, data),
  delete: (id) => api.delete(`/internships/${id}`),
  addTimelineNote: (id, note) => api.post(`/internships/${id}/timeline`, { note }),
  exportCSV: () => api.get('/internships/export/csv', { responseType: 'blob' }),
};

export const analyticsService = {
  getStats: () => api.get('/analytics/stats'),
};

export const reminderService = {
  create: (data) => api.post('/reminders', data),
  getAll: () => api.get('/reminders'),
  delete: (id) => api.delete(`/reminders/${id}`),
};

export const reportService = {
  create: (data) => api.post('/reports', data),
  getAll: () => api.get('/reports'),
  getOne: (id) => api.get(`/reports/${id}`),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
  analyze: (id) => api.post(`/reports/${id}/analyze`),
};
