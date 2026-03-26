// @ts-nocheck
import api from './axios'
export const authApi = {
  login: (data: any) => api.post('/api/auth/login', data).then(r => r.data),
  register: (data: any) => api.post('/api/auth/register', data).then(r => r.data),
  getMe: () => api.get('/api/auth/me').then(r => r.data),
  changePassword: (data: any) => api.put('/api/auth/change-password', data).then(r => r.data),
}
