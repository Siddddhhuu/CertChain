import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: String,
  description: String,
  fields: [String],
  fileUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Template', templateSchema);
