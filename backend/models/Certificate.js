import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  recipient: {
    name: String,
    email: String,
    walletAddress: String
  },
  issuer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  issuedAt: Date,
  blockchainTx: String,
  status: { type: String, default: 'issued' },
  metadata: Object
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
