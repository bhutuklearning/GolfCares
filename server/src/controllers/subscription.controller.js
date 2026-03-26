import stripe from '../services/stripe.service.js'
import emailService from '../services/email.service.js'
import Subscription from '../models/Subscription.js'
import User from '../models/User.js'

export const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature']
    let event
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error('Webhook signature failed:', err.message)
      return res.status(400).json({ error: `Webhook Error: ${err.message}` })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const { userId, plan } = session.metadata
        const stripeSub = await stripe.subscriptions.retrieve(session.subscription)
        const newSub = await Subscription.create({
          userId,
          stripeSubscriptionId: stripeSub.id,
          stripeCustomerId: session.customer,
          plan,
          status: 'active',
          currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          amount: stripeSub.items.data[0].price.unit_amount,
          currency: stripeSub.currency
        })
        await User.findByIdAndUpdate(userId, { subscriptionId: newSub._id })
        const newUser = await User.findById(userId)
        if (newUser) await emailService.sendWelcomeEmail(newUser)
        break
      }

      case 'customer.subscription.updated': {
        const updatedSub = event.data.object
        const statusMap = {
          active: 'active',
          past_due: 'past_due',
          canceled: 'cancelled',
          unpaid: 'past_due'
        }
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: updatedSub.id },
          {
            status: statusMap[updatedSub.status] || updatedSub.status,
            currentPeriodStart: new Date(updatedSub.current_period_start * 1000),
            currentPeriodEnd: new Date(updatedSub.current_period_end * 1000),
            cancelAtPeriodEnd: updatedSub.cancel_at_period_end
          }
        )
        break
      }

      case 'customer.subscription.deleted': {
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: event.data.object.id },
          { status: 'cancelled' }
        )
        break
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object
        const failedSub = await Subscription.findOneAndUpdate(
          { stripeCustomerId: failedInvoice.customer },
          { status: 'past_due' },
          { new: true }
        )
        if (failedSub) {
          const failedUser = await User.findById(failedSub.userId)
          if (failedUser) await emailService.sendPaymentFailedEmail(failedUser)
        }
        break
      }
      default:
        break
    }

    return res.json({ received: true })
  } catch (error) {
    console.error('stripeWebhook error:', error.message)
    return res.status(500).json({ received: false })
  }
}

export const getMySubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id })
    return res.status(200).json({ success: true, subscription })
  } catch (err) {
    next(err)
  }
}

export const cancelSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({ userId: req.user._id })
    if (!sub) return res.status(404).json({ success: false, message: 'No subscription found' })
    await stripe.subscriptions.update(sub.stripeSubscriptionId, { cancel_at_period_end: true })
    sub.cancelAtPeriodEnd = true
    await sub.save()
    return res.status(200).json({ success: true, message: 'Subscription will cancel at period end' })
  } catch (err) {
    next(err)
  }
}

export const createPortalSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user.stripeCustomerId) {
      return res.status(400).json({ success: false, message: 'No Stripe customer found' })
    }
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/dashboard`
    })
    return res.status(200).json({ success: true, url: portalSession.url })
  } catch (err) {
    next(err)
  }
}
