import Winner from '../models/Winner.js'
import User from '../models/User.js'
import emailService from '../services/email.service.js'

export const getMyWinnings = async (req, res, next) => {
  try {
    const winnings = await Winner.find({ userId: req.user._id })
      .populate('drawId', 'month year winningNumbers')
      .sort({ createdAt: -1 })
    return res.status(200).json({ success: true, winnings })
  } catch (err) {
    next(err)
  }
}

export const uploadProof = async (req, res, next) => {
  try {
    const winner = await Winner.findById(req.params.id)
    if (!winner) return res.status(404).json({ success: false, message: 'Winner record not found' })
    if (winner.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload an image' })
    winner.proofImageUrl = req.file.path
    winner.proofUploadedAt = new Date()
    await winner.save()
    const admins = await User.find({ role: 'admin' })
    for (const admin of admins) {
      await emailService.sendProofSubmittedEmail(admin.email, winner._id)
    }
    return res.status(200).json({ success: true, winner })
  } catch (err) {
    next(err)
  }
}

export const getAllWinners = async (req, res, next) => {
  try {
    const query = {}
    if (req.query.paymentStatus) query.paymentStatus = req.query.paymentStatus
    const winners = await Winner.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('drawId', 'month year')
      .sort({ createdAt: -1 })
    return res.status(200).json({ success: true, winners })
  } catch (err) {
    next(err)
  }
}

export const verifyWinner = async (req, res, next) => {
  try {
    const { action, adminNotes } = req.body
    const winner = await Winner.findById(req.params.id).populate('userId')
    if (!winner) return res.status(404).json({ success: false, message: 'Winner not found' })
    if (action === 'approve') {
      winner.paymentStatus = 'paid'
      winner.verifiedAt = new Date()
      winner.verifiedBy = req.user._id
      await emailService.sendPayoutConfirmationEmail(winner.userId, winner.prizeAmount)
    } else if (action === 'reject') {
      winner.paymentStatus = 'rejected'
      winner.adminNotes = adminNotes || 'Proof rejected by admin'
    } else {
      return res.status(400).json({ success: false, message: 'Action must be approve or reject' })
    }
    await winner.save()
    return res.status(200).json({ success: true, winner })
  } catch (err) {
    next(err)
  }
}
