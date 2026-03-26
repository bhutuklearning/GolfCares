import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const { Schema } = mongoose

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    charityId: { type: Schema.Types.ObjectId, ref: 'Charity', default: null },
    charityContributionPercent: { type: Number, default: 10, min: 10, max: 100 },
    stripeCustomerId: { type: String, default: null },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', default: null }
  },
  { timestamps: true }
)

userSchema.pre('save', async function preSave() {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.generateJWT = function generateJWT() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

export default mongoose.model('User', userSchema)
