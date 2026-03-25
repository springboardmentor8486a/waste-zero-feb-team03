import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    metadata: {
        target_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        target_opportunity_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Opportunity',
        },
        details: {
            type: String,
        }
    }
}, {
    timestamps: true,
});

// Index AdminLogs by timestamp (createdAt)
adminLogSchema.index({ createdAt: -1 });

export default mongoose.model('AdminLog', adminLogSchema);
