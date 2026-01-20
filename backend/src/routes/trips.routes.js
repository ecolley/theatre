const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripRecommendations,
} = require('../controllers/trips.controller');
const { authenticate } = require('../middleware/auth');

// All trip routes require authentication
router.use(authenticate);

// GET /api/v1/trips - Get all trips
router.get('/', getTrips);

// POST /api/v1/trips - Create trip
router.post('/', createTrip);

// GET /api/v1/trips/:id - Get trip by ID
router.get('/:id', getTripById);

// PUT /api/v1/trips/:id - Update trip
router.put('/:id', updateTrip);

// DELETE /api/v1/trips/:id - Delete trip
router.delete('/:id', deleteTrip);

// GET /api/v1/trips/:id/recommendations - Get show recommendations for trip
router.get('/:id/recommendations', getTripRecommendations);

module.exports = router;
