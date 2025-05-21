import mongoose from 'mongoose';

const recipientSchema = new mongoose.Schema({
  name: String,
  email: String,
  walletAddress: String,
  group: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Recipient', recipientSchema);