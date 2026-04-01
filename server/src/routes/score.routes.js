import express from 'express'
import { getScores, addScore, editScore, deleteScore } from '../controllers/score.controller.js'
import { protect, requireActiveSubscription, adminOnly } from '../middleware/auth.middleware.js'

const router = express.Router()

// All routes require authentication
router.use(protect)

// Admins bypass subscription check; regular users must have active subscription
const subscriptionOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin') return next()
  return requireActiveSubscription(req, res, next)
}

router.get('/', subscriptionOrAdmin, getScores)
router.post('/', subscriptionOrAdmin, addScore)
router.put('/:scoreId', subscriptionOrAdmin, editScore)
router.delete('/:scoreId', subscriptionOrAdmin, deleteScore)

export default router
