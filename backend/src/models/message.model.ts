import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    message: { type: String, required: true },
    status: { type: String, default: 'delivered' },
  },
  { timestamps: true }
)

const Message = mongoose.model('Message', messageSchema)

export default Message