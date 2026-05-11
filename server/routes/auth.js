const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Only load multer/cloudinary for profile update route
router.put('/profile', protect, (req, res, next) => {
  try {
    const { uploadProfile } = require('../config/cloudinary');
    uploadProfile.single('profileImage')(req, res, next);
  } catch {
    next(); // if cloudinary not configured, skip file upload
  }
}, updateProfile);

module.exports = router;
