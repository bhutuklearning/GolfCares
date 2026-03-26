// @ts-nocheck
import api from './axios'

export const subscriptionApi = {
  getMySubscription: () => api.get('/api/subscription/me').then(r => r.data),
  cancelSubscription: () => api.post('/api/subscription/cancel').then(r => r.data),
  createPortalSession: () => api.post('/api/subscription/portal').then(r => r.data),
}
