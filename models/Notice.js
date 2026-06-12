import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  file: { type: String }, // URL to PDF
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
