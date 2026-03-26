// @ts-nocheck
import api from './axios'
export const scoreApi = {
  getScores: () => api.get('/api/scores').then(r => r.data),
  addScore: (data: any) => api.post('/api/scores', data).then(r => r.data),
  editScore: (id: string, data: any) => api.put(`/api/scores/${id}`, data).then(r => r.data),
  deleteScore: (id: string) => api.delete(`/api/scores/${id}`).then(r => r.data),
}
