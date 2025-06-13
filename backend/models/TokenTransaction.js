import mongoose from 'mongoose';

const tokenTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  tokenAmount: { type: Number, required: true },
  transactionHash: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'failed', 'completed'],
    default: 'pending'
  },
  type: { 
    type: String, 
    enum: ['task_access', 'task_completion'],
    required: true
  },
  metadata: {
    videoProgress: { type: Number, default: 0 },
    assignmentSubmission: { type: String },
    completionDate: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('TokenTransaction', tokenTransactionSchema); 