import express from 'express'
import { getMyWinnings, uploadProof, getAllWinners, verifyWinner } from '../controllers/winner.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import { uploadProof as uploadProofMiddleware } from '../config/cloudinary.js'

const router = express.Router()

router.get('/me', protect, getMyWinnings)
router.post('/:id/proof', protect, uploadProofMiddleware.single('proof'), uploadProof)
router.get('/', protect, adminOnly, getAllWinners)
router.put('/:id/verify', protect, adminOnly, verifyWinner)

export default router
