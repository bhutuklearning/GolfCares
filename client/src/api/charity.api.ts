// @ts-nocheck
import api from './axios'
export const charityApi = {
  getCharities: (params?: any) => api.get('/api/charities', { params }).then(r => r.data),
  getFeatured: () => api.get('/api/charities/featured').then(r => r.data),
  getCharityById: (id: string) => api.get(`/api/charities/${id}`).then(r => r.data),
  updateUserCharity: (data: any) => api.put('/api/charities/user/charity', data).then(r => r.data),
}
