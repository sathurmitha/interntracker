const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  weekNumber: { type: Number, default: 1 },
  aiSummary: { type: String, default: '' },
  aiIssues: [{ type: String }],
  aiFeedback: [{ type: String }],
  analyzedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
