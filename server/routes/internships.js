const express = require('express');
const router = express.Router();
const {
  createInternship, getInternships, getInternship, updateInternship, deleteInternship, addTimelineNote, exportCSV,
} = require('../controllers/internshipController');
const { protect } = require('../middleware/auth');

const withResume = (req, res, next) => {
  try {
    const { uploadResume } = require('../config/cloudinary');
    uploadResume.single('resume')(req, res, next);
  } catch {
    next();
  }
};

router.use(protect);
router.get('/export/csv', exportCSV);
router.route('/').post(withResume, createInternship).get(getInternships);
router.route('/:id').get(getInternship).put(withResume, updateInternship).delete(deleteInternship);
router.post('/:id/timeline', addTimelineNote);

module.exports = router;
