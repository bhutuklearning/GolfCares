import Draw from '../models/Draw.js'
import Winner from '../models/Winner.js'
import * as drawService from '../services/draw.service.js'

export const createDraw = async (req, res, next) => {
  try {
    const { month, year, drawType } = req.body
    const existing = await Draw.findOne({ month: parseInt(month), year: parseInt(year) })
    if (existing) return res.status(400).json({ success: false, message: 'Draw already exists for this month' })
    const prizePool = await drawService.calculatePrizePool(parseInt(month), parseInt(year))
    const draw = await Draw.create({
      month: parseInt(month),
      year: parseInt(year),
      drawType: drawType || 'random',
      prizePool,
      jackpotRolledOver: prizePool.jackpotRolledOver,
      createdBy: req.user._id
    })
    return res.status(201).json({ success: true, draw })
  } catch (err) {
    next(err)
  }
}

export const simulateDraw = async (req, res, next) => {
  try {
    const result = await drawService.runDraw(req.params.id, false)
    return res
      .status(200)
      .json({ success: true, simulation: result.draw.simulationResult, draw: result.draw })
  } catch (err) {
    next(err)
  }
}

export const publishDraw = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.id)
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' })
    if (draw.status === 'published') {
      return res.status(400).json({ success: false, message: 'Draw already published' })
    }
    const result = await drawService.runDraw(req.params.id, true)
    return res.status(200).json({ success: true, draw: result.draw })
  } catch (err) {
    next(err)
  }
}

export const getPublishedDraws = async (req, res, next) => {
  try {
    const draws = await Draw.find({ status: 'published' }).sort({ year: -1, month: -1 })
    return res.status(200).json({ success: true, draws })
  } catch (err) {
    next(err)
  }
}

export const getDrawById = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.id).populate('createdBy', 'firstName lastName')
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' })
    const winners = await Winner.find({ drawId: draw._id }).populate('userId', 'firstName lastName email')
    return res.status(200).json({ success: true, draw, winners })
  } catch (err) {
    next(err)
  }
}

export const getCurrentMonthDraw = async (req, res, next) => {
  try {
    const now = new Date()
    const draw = await Draw.findOne({ month: now.getMonth() + 1, year: now.getFullYear() })
    return res.status(200).json({ success: true, draw: draw || null })
  } catch (err) {
    next(err)
  }
}
