import mongoose from 'mongoose'

const { Schema } = mongoose

const charitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: null },
    website: { type: String, default: null },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    events: [
      {
        title: String,
        date: Date,
        description: String,
        location: String
      }
    ],
    totalReceived: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

export default mongoose.model('Charity', charitySchema)
