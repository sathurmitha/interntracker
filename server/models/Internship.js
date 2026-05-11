const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  location: { type: String, default: '' },
  internshipType: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
    default: 'Remote',
  },
  applicationDate: { type: Date, default: Date.now },
  deadline: { type: Date },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Interview Scheduled', 'Rejected', 'Accepted', 'Offer Received'],
    default: 'Applied',
  },
  stipend: { type: String, default: '' },
  notes: { type: String, default: '' },
  resumeURL: { type: String, default: '' },
  interviewDate: { type: Date },
  offerDeadline: { type: Date },
  timeline: [
    {
      status: { type: String },
      note: { type: String, default: '' },
      date: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Internship', internshipSchema);
