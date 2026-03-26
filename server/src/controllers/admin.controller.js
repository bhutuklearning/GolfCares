import User from '../models/User.js'
import Subscription from '../models/Subscription.js'
import Draw from '../models/Draw.js'
import Winner from '../models/Winner.js'
import Charity from '../models/Charity.js'
import Score from '../models/Score.js'

export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalUsers,
      activeSubscribers,
      totalDraws,
      pendingVerifications,
      paidOutResult,
      newUsersThisMonth,
      recentDraws,
      charityLeaderboard,
      subscriptionBreakdown
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Subscription.countDocuments({ status: 'active' }),
      Draw.countDocuments({ status: 'published' }),
      Winner.countDocuments({ paymentStatus: 'pending' }),
      Winner.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$prizeAmount' } } }]),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
      Draw.find({ status: 'published' }).sort({ year: -1, month: -1 }).limit(3),
      Charity.find({ isActive: true }).sort({ totalReceived: -1 }).limit(5),
      Subscription.aggregate([{ $match: { status: 'active' } }, { $group: { _id: '$plan', count: { $sum: 1 } } }])
    ])

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeSubscribers,
        totalDraws,
        pendingVerifications,
        totalPaidOut: paidOutResult[0]?.total || 0,
        newUsersThisMonth,
        recentDraws,
        charityLeaderboard,
        subscriptionBreakdown
      }
    })
  } catch (err) {
    next(err)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit
    const query = { role: 'user' }
    if (req.query.search) {
      const regex = { $regex: req.query.search, $options: 'i' }
      query.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }]
    }
    const [users, total] = await Promise.all([
      User.find(query)
        .populate('subscriptionId')
        .populate('charityId', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query)
    ])
    return res
      .status(200)
      .json({ success: true, users, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('subscriptionId')
      .populate('charityId', 'name')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    const [scores, winnings] = await Promise.all([
      Score.findOne({ userId: user._id }),
      Winner.find({ userId: user._id }).populate('drawId', 'month year')
    ])
    return res.status(200).json({ success: true, user, scores: scores?.scores || [], winnings })
  } catch (err) {
    next(err)
  }
}

export const editUserScore = async (req, res, next) => {
  try {
    const { value, date } = req.body
    const doc = await Score.findOne({ userId: req.params.userId })
    if (!doc) return res.status(404).json({ success: false, message: 'No scores found for this user' })
    const scoreItem = doc.scores.id(req.params.scoreId)
    if (!scoreItem) return res.status(404).json({ success: false, message: 'Score not found' })
    scoreItem.value = parseInt(value)
    scoreItem.date = new Date(date)
    doc.scores.sort((a, b) => new Date(b.date) - new Date(a.date))
    await doc.save()
    return res.status(200).json({ success: true, scores: doc.scores })
  } catch (err) {
    next(err)
  }
}

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    user.isActive = !user.isActive
    await user.save()
    return res.status(200).json({
      success: true,
      isActive: user.isActive,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`
    })
  } catch (err) {
    next(err)
  }
}

