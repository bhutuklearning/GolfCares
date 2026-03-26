import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Subscription from '../models/Subscription.js'

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : null

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Not authorized' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  next()
}

export const requireActiveSubscription = async (req, res, next) => {
  const sub = await Subscription.findOne({ userId: req.user._id, status: 'active' })
  if (!sub) {
    return res.status(403).json({ success: false, message: 'Active subscription required' })
  }
  next()
}
