import mongoose from 'mongoose'

const { Schema } = mongoose

const subscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripeSubscriptionId: { type: String, unique: true, sparse: true },
    stripeCustomerId: { type: String },
    plan: { type: String, enum: ['monthly', 'yearly'] },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due'],
      default: 'inactive'
    },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    amount: { type: Number },
    currency: { type: String, default: 'gbp' }
  },
  { timestamps: true }
)

export default mongoose.model('Subscription', subscriptionSchema)
