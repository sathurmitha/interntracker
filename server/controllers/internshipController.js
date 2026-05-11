const Internship = require('../models/Internship');

const DATE_FIELDS = ['applicationDate', 'deadline', 'interviewDate', 'offerDeadline'];

// Safely parse date strings — returns undefined if empty/invalid
const parseDates = (body) => {
  const cleaned = { ...body };
  DATE_FIELDS.forEach((field) => {
    if (cleaned[field] === '' || cleaned[field] === 'undefined') {
      delete cleaned[field];
    } else if (cleaned[field]) {
      const d = new Date(cleaned[field]);
      if (isNaN(d.getTime())) delete cleaned[field];
      else cleaned[field] = d;
    }
  });
  return cleaned;
};

// POST /api/internships
const createInternship = async (req, res) => {
  try {
    const data = { ...parseDates(req.body), userId: req.user._id };
    if (req.file) data.resumeURL = req.file.path;
    const internship = await Internship.create(data);
    res.status(201).json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/internships
const getInternships = async (req, res) => {
  const { status, search, sort = '-createdAt', page = 1, limit = 10 } = req.query;
  const query = { userId: req.user._id };

  if (status) query.status = status;
  if (search) {
    query.$or = [
      { companyName: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Internship.countDocuments(query);
  const internships = await Internship.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ internships, total, page: Number(page), pages: Math.ceil(total / limit) });
};

// GET /api/internships/:id
const getInternship = async (req, res) => {
  const internship = await Internship.findOne({ _id: req.params.id, userId: req.user._id });
  if (!internship) return res.status(404).json({ message: 'Internship not found' });
  res.json(internship);
};

// PUT /api/internships/:id
const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findOne({ _id: req.params.id, userId: req.user._id });
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    if (req.file) req.body.resumeURL = req.file.path;

    const { timelineNote, ...rest } = parseDates(req.body);

    if (rest.status && rest.status !== internship.status) {
      internship.timeline.push({ status: rest.status, note: timelineNote || '' });
    }

    Object.assign(internship, rest);
    const updated = await internship.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/internships/:id/timeline
const addTimelineNote = async (req, res) => {
  const internship = await Internship.findOne({ _id: req.params.id, userId: req.user._id });
  if (!internship) return res.status(404).json({ message: 'Internship not found' });
  internship.timeline.push({ status: internship.status, note: req.body.note });
  await internship.save();
  res.json(internship.timeline);
};

// GET /api/internships/export/csv
const exportCSV = async (req, res) => {
  const internships = await Internship.find({ userId: req.user._id }).sort('-createdAt');
  const headers = ['Company,Role,Location,Type,Status,Applied,Deadline,Stipend,Interview,Notes'];
  const rows = internships.map((i) =>
    [
      i.companyName, i.role, i.location, i.internshipType, i.status,
      i.applicationDate?.toISOString().split('T')[0] || '',
      i.deadline?.toISOString().split('T')[0] || '',
      i.stipend, i.interviewDate?.toISOString().split('T')[0] || '',
      `"${(i.notes || '').replace(/"/g, '""')}"`,
    ].join(',')
  );
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=internships.csv');
  res.send([...headers, ...rows].join('\n'));
};

// DELETE /api/internships/:id
const deleteInternship = async (req, res) => {
  const internship = await Internship.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!internship) return res.status(404).json({ message: 'Internship not found' });
  res.json({ message: 'Deleted successfully' });
};

module.exports = { createInternship, getInternships, getInternship, updateInternship, deleteInternship, addTimelineNote, exportCSV };
