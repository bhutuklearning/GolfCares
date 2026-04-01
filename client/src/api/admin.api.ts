// @ts-nocheck
import api from './axios'

export const adminApi = {
  getStats: () => api.get('/api/admin/stats').then(r => r.data),
  getAllUsers: (params?: any) => api.get('/api/admin/users', { params }).then(r => r.data),
  getUserById: (id: string) => api.get(`/api/admin/users/${id}`).then(r => r.data),
  toggleUserStatus: (id: string) => api.put(`/api/admin/users/${id}/status`).then(r => r.data),
  editUserScore: (userId: string, scoreId: string, data: any) => api.put(`/api/admin/users/${userId}/scores/${scoreId}`, data).then(r => r.data),
  // Draws (reuse drawApi internally)
  getAllDraws: () => api.get('/api/draws').then(r => r.data),
  createDraw: (data: any) => api.post('/api/draws', data).then(r => r.data),
  simulateDraw: (id: string) => api.post(`/api/draws/${id}/simulate`).then(r => r.data),
  publishDraw: (id: string) => api.post(`/api/draws/${id}/publish`).then(r => r.data),
  // Winners
  getAllWinners: (params?: any) => api.get('/api/winners', { params }).then(r => r.data),
  verifyWinner: (id: string, data: any) => api.put(`/api/winners/${id}/verify`, data).then(r => r.data),
  // Charities (admin create/update/delete)
  createCharity: (data: FormData) => api.post('/api/charities', data, { headers: { 'Content-Type': 'multipart/form-data' }}).then(r => r.data),
  updateCharity: (id: string, data: FormData) => api.put(`/api/charities/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' }}).then(r => r.data),
  deleteCharity: (id: string) => api.delete(`/api/charities/${id}`).then(r => r.data),
}
