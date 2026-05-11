const Internship = require('../models/Internship');

// GET /api/analytics/stats
const getStats = async (req, res) => {
  const userId = req.user._id;

  const statusCounts = await Internship.aggregate([
    { $match: { userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const monthlyApps = await Internship.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: { year: { $year: '$applicationDate' }, month: { $month: '$applicationDate' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const total = await Internship.countDocuments({ userId });
  const accepted = await Internship.countDocuments({ userId, status: { $in: ['Accepted', 'Offer Received'] } });
  const upcoming = await Internship.countDocuments({
    userId,
    interviewDate: { $gte: new Date() },
    status: 'Interview Scheduled',
  });
  const deadlineSoon = await Internship.find({
    userId,
    deadline: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  }).select('companyName role deadline');

  res.json({
    total,
    accepted,
    acceptanceRate: total ? ((accepted / total) * 100).toFixed(1) : 0,
    upcomingInterviews: upcoming,
    statusCounts,
    monthlyApps,
    deadlineSoon,
  });
};

module.exports = { getStats };
