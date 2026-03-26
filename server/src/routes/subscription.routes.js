import express from 'express'
import {
  stripeWebhook,
  getMySubscription,
  cancelSubscription,
  createPortalSession
} from '../controllers/subscription.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook)
router.get('/me', protect, getMySubscription)
router.post('/cancel', protect, cancelSubscription)
router.post('/portal', protect, createPortalSession)

export default router
