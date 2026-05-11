const Reminder = require('../models/Reminder');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// POST /api/reminders
const createReminder = async (req, res) => {
  const reminder = await Reminder.create({ ...req.body, userId: req.user._id });
  res.status(201).json(reminder);
};

// GET /api/reminders
const getReminders = async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user._id })
    .populate('internshipId', 'companyName role')
    .sort('reminderDate');
  res.json(reminders);
};

// DELETE /api/reminders/:id
const deleteReminder = async (req, res) => {
  await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ message: 'Reminder deleted' });
};

// Send email reminder (called by cron or manually)
const sendEmailReminder = async (email, message) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Internship Tracker Reminder',
    text: message,
  });
};

module.exports = { createReminder, getReminders, deleteReminder, sendEmailReminder };
