// @ts-nocheck
import api from './axios'

export const scoreApi = {
  getScores: () => api.get('/api/scores').then(r => r.data),
  addScore: (data: any) => api.post('/api/scores', data).then(r => r.data),
  editScore: (scoreId: string, data: any) => api.put(`/api/scores/${scoreId}`, data).then(r => r.data),
  deleteScore: (scoreId: string) => api.delete(`/api/scores/${scoreId}`).then(r => r.data),
}
