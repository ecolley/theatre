const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profile.controller');
const { authenticate } = require('../middleware/auth');

// All profile routes require authentication
router.use(authenticate);

// GET /api/v1/profile - Get taste profile
router.get('/', getProfile);

// PUT /api/v1/profile - Update taste profile
router.put('/', updateProfile);

module.exports = router;
