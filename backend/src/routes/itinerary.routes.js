const express = require('express');
const router = express.Router();
const {
  generateItinerary,
  getItineraries,
  getItineraryById,
  deleteItinerary,
} = require('../controllers/itinerary.controller');
const { authenticate } = require('../middleware/auth');

// All itinerary routes require authentication
router.use(authenticate);

// POST /api/v1/itineraries/generate - Generate new itinerary
router.post('/generate', generateItinerary);

// GET /api/v1/itineraries - Get all itineraries
router.get('/', getItineraries);

// GET /api/v1/itineraries/:id - Get itinerary by ID
router.get('/:id', getItineraryById);

// DELETE /api/v1/itineraries/:id - Delete itinerary
router.delete('/:id', deleteItinerary);

module.exports = router;
