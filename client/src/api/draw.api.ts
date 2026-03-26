// @ts-nocheck
import api from './axios'

export const drawApi = {
  getPublishedDraws: () => api.get('/api/draws').then(r => r.data),
  getCurrentDraw: () => api.get('/api/draws/current').then(r => r.data),
  getDrawById: (id: string) => api.get(`/api/draws/${id}`).then(r => r.data),
  createDraw: (data: any) => api.post('/api/draws', data).then(r => r.data),
  simulateDraw: (id: string) => api.post(`/api/draws/${id}/simulate`).then(r => r.data),
  publishDraw: (id: string) => api.post(`/api/draws/${id}/publish`).then(r => r.data),
}
