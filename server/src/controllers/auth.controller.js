import stripe from '../services/stripe.service.js'
import emailService from '../services/email.service.js'
import User from '../models/User.js'
import Subscription from '../models/Subscription.js'

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, plan, charityId, charityContributionPercent } =
      req.body

    if (!firstName || !lastName || !email || !password || !plan) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' })

    const customer = await stripe.customers.create({ email, name: `${firstName} ${lastName}` })

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      stripeCustomerId: customer.id,
      charityId: charityId || null,
      charityContributionPercent: charityContributionPercent || 10
    })

    const priceId =
      plan === 'yearly' ? process.env.STRIPE_YEARLY_PRICE_ID : process.env.STRIPE_MONTHLY_PRICE_ID

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard?session=success`,
      cancel_url: `${process.env.CLIENT_URL}/register`,
      metadata: { userId: user._id.toString(), plan }
    })

    return res.status(201).json({ success: true, checkoutUrl: session.url })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' })
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
    const subscription = await Subscription.findOne({ userId: user._id })
    const token = user.generateJWT()
    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        charityId: user.charityId,
        charityContributionPercent: user.charityContributionPercent
      },
      subscription: subscription || null
    })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('charityId subscriptionId')
    return res.status(200).json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')
    const isMatch = await user.comparePassword(oldPassword)
    if (!isMatch) return res.status(400).json({ success: false, message: 'Old password is incorrect' })
    user.password = newPassword
    await user.save()
    return res.status(200).json({ success: true, message: 'Password updated successfully' })
  } catch (err) {
    next(err)
  }
}
