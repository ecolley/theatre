const express = require('express');
const router = express.Router();
const {
  discoverEvents,
  getEventById,
  saveEvent,
  getSavedEvents,
} = require('../controllers/events.controller');
const { authenticate } = require('../middleware/auth');
const { discoveryLimiter } = require('../middleware/rateLimiter');

// All event routes require authentication
router.use(authenticate);

// GET /api/v1/events/discover - Discover events matching profile
router.get('/discover', discoveryLimiter, discoverEvents);

// GET /api/v1/events/saved - Get saved events
router.get('/saved', getSavedEvents);

// GET /api/v1/events/:eventId - Get event details
router.get('/:eventId', getEventById);

// POST /api/v1/events/save - Save an event
router.post('/save', saveEvent);

module.exports = router;
