import express from 'express'
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  editUserScore,
  toggleUserStatus
} from '../controllers/admin.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = express.Router()

router.use(protect, adminOnly)

router.get('/stats', getDashboardStats)
router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.put('/users/:userId/scores/:scoreId', editUserScore)
router.put('/users/:id/status', toggleUserStatus)

export default router
