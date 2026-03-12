import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: 2000,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    conversation_id: {
      type: String,
      index: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: false }
);

messageSchema.index({ conversation_id: 1, timestamp: 1 });

messageSchema.statics.buildConversationId = function (idA, idB) {
  return [idA.toString(), idB.toString()].sort().join('_');
};

messageSchema.pre('save', async function () {
  if (!this.conversation_id) {
    this.conversation_id = [
      this.sender_id.toString(),
      this.receiver_id.toString(),
    ]
      .sort()
      .join('_');
  }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;