import mongoose from 'mongoose'

const { Schema } = mongoose

const winnerSchema = new Schema(
  {
    drawId: { type: Schema.Types.ObjectId, ref: 'Draw', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    matchType: { type: String, enum: ['5-match', '4-match', '3-match'], required: true },
    prizeAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'rejected'], default: 'pending' },
    proofImageUrl: { type: String, default: null },
    proofUploadedAt: Date,
    verifiedAt: Date,
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    adminNotes: { type: String, default: null }
  },
  { timestamps: true }
)

export default mongoose.model('Winner', winnerSchema)
