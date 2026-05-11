const express = require('express');
const router = express.Router();
const {
  createReport, getReports, getReport, updateReport, deleteReport, analyzeReportAI,
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').post(createReport).get(getReports);
router.route('/:id').get(getReport).put(updateReport).delete(deleteReport);
router.post('/:id/analyze', analyzeReportAI);

module.exports = router;
