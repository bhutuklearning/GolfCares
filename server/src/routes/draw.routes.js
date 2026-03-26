import express from 'express'
import {
  getPublishedDraws,
  getCurrentMonthDraw,
  getDrawById,
  createDraw,
  simulateDraw,
  publishDraw
} from '../controllers/draw.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', getPublishedDraws)
router.get('/current', protect, getCurrentMonthDraw)
router.get('/:id', getDrawById)

router.post('/', protect, adminOnly, createDraw)
router.post('/:id/simulate', protect, adminOnly, simulateDraw)
router.post('/:id/publish', protect, adminOnly, publishDraw)

export default router
