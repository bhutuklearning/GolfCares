import Score from '../models/Score.js'

export const getScores = async (req, res, next) => {
  try {
    const doc = await Score.findOne({ userId: req.user._id })
    return res.status(200).json({ success: true, scores: doc ? doc.scores : [] })
  } catch (err) {
    next(err)
  }
}

export const addScore = async (req, res, next) => {
  try {
    const { value, date } = req.body
    const numValue = parseInt(value)
    if (!numValue || numValue < 1 || numValue > 45) {
      return res.status(400).json({ success: false, message: 'Score must be between 1 and 45' })
    }
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' })
    }
    const scoreDate = new Date(date)
    if (scoreDate > new Date()) {
      return res.status(400).json({ success: false, message: 'Score date cannot be in the future' })
    }
    const updated = await Score.addScore(req.user._id, numValue, scoreDate)
    return res.status(201).json({ success: true, scores: updated.scores })
  } catch (err) {
    next(err)
  }
}

export const editScore = async (req, res, next) => {
  try {
    const { value, date } = req.body
    const numValue = parseInt(value)
    if (!numValue || numValue < 1 || numValue > 45) {
      return res.status(400).json({ success: false, message: 'Score must be between 1 and 45' })
    }
    const doc = await Score.findOne({ userId: req.user._id })
    if (!doc) return res.status(404).json({ success: false, message: 'No scores found' })
    const scoreItem = doc.scores.id(req.params.scoreId)
    if (!scoreItem) return res.status(404).json({ success: false, message: 'Score not found' })
    scoreItem.value = numValue
    scoreItem.date = new Date(date)
    doc.scores.sort((a, b) => new Date(b.date) - new Date(a.date))
    await doc.save()
    return res.status(200).json({ success: true, scores: doc.scores })
  } catch (err) {
    next(err)
  }
}

export const deleteScore = async (req, res, next) => {
  try {
    const doc = await Score.findOne({ userId: req.user._id })
    if (!doc) return res.status(404).json({ success: false, message: 'No scores found' })
    doc.scores.pull({ _id: req.params.scoreId })
    await doc.save()
    return res.status(200).json({ success: true, scores: doc.scores })
  } catch (err) {
    next(err)
  }
}
