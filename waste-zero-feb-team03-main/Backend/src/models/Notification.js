import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['newMessage', 'newMatch', 'applicationUpdate', 'system'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    ref_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    ref_type: {
      type: String,
      enum: ['Opportunity', 'Message', 'Application'],
    },
    read: {
      type: Boolean,
      default: false,
    },
    sent_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Fast unread query per user
notificationSchema.index({ user_id: 1, read: 1, sent_at: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;