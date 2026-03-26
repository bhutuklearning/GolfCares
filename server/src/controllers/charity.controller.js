import Charity from '../models/Charity.js'
import User from '../models/User.js'

export const getAllCharities = async (req, res, next) => {
  try {
    const { search } = req.query
    const query = { isActive: true }
    if (search) query.name = { $regex: search, $options: 'i' }
    const charities = await Charity.find(query).sort({ isFeatured: -1, name: 1 })
    return res.status(200).json({ success: true, charities })
  } catch (err) {
    next(err)
  }
}

export const getFeaturedCharities = async (req, res, next) => {
  try {
    const charities = await Charity.find({ isFeatured: true, isActive: true }).limit(3)
    return res.status(200).json({ success: true, charities })
  } catch (err) {
    next(err)
  }
}

export const getCharityById = async (req, res, next) => {
  try {
    const charity = await Charity.findById(req.params.id)
    if (!charity || !charity.isActive) {
      return res.status(404).json({ success: false, message: 'Charity not found' })
    }
    return res.status(200).json({ success: true, charity })
  } catch (err) {
    next(err)
  }
}

export const createCharity = async (req, res, next) => {
  try {
    let events = []
    if (req.body.events) {
      events = typeof req.body.events === 'string' ? JSON.parse(req.body.events) : req.body.events
    }
    const charity = await Charity.create({
      name: req.body.name,
      description: req.body.description,
      website: req.body.website || null,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      events,
      imageUrl: req.file?.path || null,
      createdBy: req.user._id
    })
    return res.status(201).json({ success: true, charity })
  } catch (err) {
    next(err)
  }
}

export const updateCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findById(req.params.id)
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found' })
    const fields = ['name', 'description', 'website', 'isFeatured', 'isActive']
    fields.forEach((f) => {
      if (req.body[f] !== undefined) charity[f] = req.body[f]
    })
    if (req.body.events) {
      charity.events = typeof req.body.events === 'string' ? JSON.parse(req.body.events) : req.body.events
    }
    if (req.file) charity.imageUrl = req.file.path
    await charity.save()
    return res.status(200).json({ success: true, charity })
  } catch (err) {
    next(err)
  }
}

export const deleteCharity = async (req, res, next) => {
  try {
    const charity = await Charity.findById(req.params.id)
    if (!charity) return res.status(404).json({ success: false, message: 'Charity not found' })
    charity.isActive = false
    await charity.save()
    return res.status(200).json({ success: true, message: 'Charity deactivated' })
  } catch (err) {
    next(err)
  }
}

export const updateUserCharity = async (req, res, next) => {
  try {
    const { charityId, charityContributionPercent } = req.body
    const pct = parseInt(charityContributionPercent)
    if (pct < 10 || pct > 100) {
      return res.status(400).json({ success: false, message: 'Contribution must be between 10% and 100%' })
    }
    if (charityId) {
      const charity = await Charity.findById(charityId)
      if (!charity) return res.status(404).json({ success: false, message: 'Charity not found' })
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { charityId: charityId || null, charityContributionPercent: pct },
      { new: true }
    ).populate('charityId')
    return res.status(200).json({ success: true, user })
  } catch (err) {
    next(err)
  }
}
