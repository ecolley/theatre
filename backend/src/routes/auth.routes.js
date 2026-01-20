const express = require('express');
const router = express.Router();
const { login, verify } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /api/v1/auth/login - Login with password
router.post('/login', authLimiter, login);

// GET /api/v1/auth/verify - Verify token
router.get('/verify', authenticate, verify);

module.exports = router;
