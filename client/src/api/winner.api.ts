// @ts-nocheck
import api from './axios'
export const winnerApi = {
  getMyWinnings: () => api.get('/api/winners/me').then(r => r.data),
  uploadProof: (id: string, formData: FormData) =>
    api.post(`/api/winners/${id}/proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),
}
