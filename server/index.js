require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');

connectDB();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:3000'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api', limiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/reports', require('./routes/reports'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/', (req, res) => {
  res.send('InternTracker Backend Running Successfully');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});