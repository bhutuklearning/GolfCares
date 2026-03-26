import mongoose from 'mongoose'

const { Schema } = mongoose

const drawSchema = new Schema(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'simulated', 'published'], default: 'pending' },
    drawType: { type: String, enum: ['random', 'algorithmic'], default: 'random' },
    winningNumbers: [Number],
    prizePool: {
      total: { type: Number, default: 0 },
      fiveMatch: { type: Number, default: 0 },
      fourMatch: { type: Number, default: 0 },
      threeMatch: { type: Number, default: 0 }
    },
    jackpotRolledOver: { type: Number, default: 0 },
    jackpotRollover: { type: Boolean, default: false },
    simulationResult: { type: mongoose.Schema.Types.Mixed, default: null },
    publishedAt: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

drawSchema.index({ month: 1, year: 1 }, { unique: true })

export default mongoose.model('Draw', drawSchema)
