import mongoose from 'mongoose'

const { Schema } = mongoose

const scoreSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    scores: [
      {
        value: { type: Number, min: 1, max: 45, required: true },
        date: { type: Date, required: true }
      }
    ]
  },
  { timestamps: true }
)

scoreSchema.statics.addScore = async function addScore(userId, value, date) {
  let doc = await this.findOne({ userId })
  if (!doc) doc = new this({ userId, scores: [] })

  if (doc.scores.length >= 5) {
    doc.scores.sort((a, b) => new Date(a.date) - new Date(b.date))
    doc.scores.shift()
  }

  doc.scores.push({ value, date })
  doc.scores.sort((a, b) => new Date(b.date) - new Date(a.date))
  await doc.save()
  return doc
}

export default mongoose.model('Score', scoreSchema)
