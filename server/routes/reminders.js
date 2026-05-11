const express = require('express');
const router = express.Router();
const { createReminder, getReminders, deleteReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').post(createReminder).get(getReminders);
router.delete('/:id', deleteReminder);

module.exports = router;
