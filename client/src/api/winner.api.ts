// @ts-nocheck
import api from './axios'

export const winnerApi = {
  getMyWinnings: () => api.get('/api/winners/me').then(r => r.data),
  uploadProof: (id: string, formData: FormData) => api.post(`/api/winners/${id}/proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data),
  getAllWinners: (params?: any) => api.get('/api/winners', { params }).then(r => r.data),
  verifyWinner: (id: string, data: any) => api.put(`/api/winners/${id}/verify`, data).then(r => r.data),
}
