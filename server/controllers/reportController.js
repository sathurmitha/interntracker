const Report = require('../models/Report');

// ── Rule-based AI engine ──────────────────────────────────────────────────────

const analyzeReport = (title, content, weekNumber) => {
  const text = content.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 2);
  const lower = text.toLowerCase();

  // 1. SUMMARY — extract first 2 meaningful sentences + stats
  const topSentences = sentences.slice(0, 2).map((s) => s.trim()).join('. ');
  const summary = `Week ${weekNumber} report "${title}" contains ${wordCount} words across ${sentences.length} sentences. ${topSentences ? topSentences + '.' : ''}`;

  // 2. INCOMPLETE DETECTION
  const issues = [];

  if (wordCount < 50)
    issues.push('Report is too short (under 50 words). A good weekly report should be at least 150 words.');

  if (!lower.match(/\b(task|work|complet|develop|build|implement|creat|design|test|fix|learn)\b/))
    issues.push('No tasks or work activities mentioned. Describe what you worked on this week.');

  if (!lower.match(/\b(learn|skill|knowledge|understand|discover|figur|realiz|found out)\b/))
    issues.push('No learning outcomes detected. Include what new skills or knowledge you gained.');

  if (!lower.match(/\b(challeng|problem|issue|difficult|obstacle|stuck|error|bug|trouble)\b/))
    issues.push('No challenges mentioned. Describing difficulties shows self-awareness and growth.');

  if (!lower.match(/\b(next|plan|goal|upcoming|will|going to|intend|aim|week|tomorrow)\b/))
    issues.push('No future plans mentioned. Add what you plan to do next week.');

  if (!lower.match(/\b(team|mentor|manager|colleague|supervisor|meeting|discuss|collaborat)\b/))
    issues.push('No team interaction mentioned. Include any meetings, collaborations, or mentor feedback.');

  if (wordCount > 20 && sentences.length < 3)
    issues.push('Report lacks sentence variety. Break your content into clear, complete sentences.');

  // 3. FEEDBACK SUGGESTIONS
  const feedback = [];

  if (wordCount >= 50 && wordCount < 150)
    feedback.push('Good start! Try to expand to at least 150 words for a comprehensive report.');

  if (wordCount >= 150)
    feedback.push('Great length! Your report is detailed and thorough.');

  if (lower.match(/\b(complet|finish|done|achiev|accomplish)\b/))
    feedback.push('You highlighted completed tasks — great for showing progress to your supervisor.');

  if (lower.match(/\b(learn|skill|knowledge)\b/))
    feedback.push('Mentioning learning outcomes strengthens your report. Keep including these.');

  if (lower.match(/\b(challeng|problem|difficult)\b/) && lower.match(/\b(solv|fix|resolv|overcam|handled)\b/))
    feedback.push('Excellent — you described a challenge AND how you solved it. This shows problem-solving ability.');
  else if (lower.match(/\b(challeng|problem|difficult)\b/))
    feedback.push('You mentioned challenges — consider also describing how you addressed or plan to address them.');

  if (lower.match(/\b(feedback|review|approv|suggest)\b/))
    feedback.push('Including feedback received from mentors/managers adds credibility to your report.');

  if (sentences.length >= 5)
    feedback.push('Well-structured report with multiple points covered.');

  if (feedback.length === 0)
    feedback.push('Add specific details about your daily tasks, tools used, and outcomes achieved to make this report stand out.');

  return { summary, issues, feedback };
};

// POST /api/reports
const createReport = async (req, res) => {
  try {
    const { title, content, weekNumber, internshipId } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
    const data = { userId: req.user._id, title, content, weekNumber };
    if (internshipId) data.internshipId = internshipId;
    const report = await Report.create(data);
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .populate('internshipId', 'companyName role')
      .sort('-createdAt');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/:id
const getReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('internshipId', 'companyName role');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/reports/:id
const updateReport = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    const { internshipId, ...rest } = req.body;
    Object.assign(report, rest);
    if (internshipId) report.internshipId = internshipId;
    else report.internshipId = undefined;
    if (req.body.content) {
      report.aiSummary = '';
      report.aiIssues = [];
      report.aiFeedback = [];
      report.analyzedAt = null;
    }
    const updated = await report.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/reports/:id
const deleteReport = async (req, res) => {
  try {
    await Report.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/reports/:id/analyze
const analyzeReportAI = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const { summary, issues, feedback } = analyzeReport(report.title, report.content, report.weekNumber);

    report.aiSummary = summary;
    report.aiIssues = issues;
    report.aiFeedback = feedback;
    report.analyzedAt = new Date();
    await report.save();

    res.json({ summary, issues, feedback, analyzedAt: report.analyzedAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createReport, getReports, getReport, updateReport, deleteReport, analyzeReportAI };
