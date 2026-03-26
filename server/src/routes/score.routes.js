import express from 'express'
import { getScores, addScore, editScore, deleteScore } from '../controllers/score.controller.js'
import { protect, requireActiveSubscription } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(protect, requireActiveSubscription)

router.get('/', getScores)
router.post('/', addScore)
router.put('/:scoreId', editScore)
router.delete('/:scoreId', deleteScore)

export default router
