import express from 'express'
import {
  getAllCharities,
  getFeaturedCharities,
  getCharityById,
  createCharity,
  updateCharity,
  deleteCharity,
  updateUserCharity
} from '../controllers/charity.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

router.get('/', getAllCharities)
router.get('/featured', getFeaturedCharities)
router.get('/:id', getCharityById)

router.post('/', protect, adminOnly, upload.single('image'), createCharity)

// MUST be before /:id to avoid conflict
router.put('/user/charity', protect, updateUserCharity)

router.put('/:id', protect, adminOnly, upload.single('image'), updateCharity)
router.delete('/:id', protect, adminOnly, deleteCharity)

export default router
