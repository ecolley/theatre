const { query } = require('../config/database');
const matchingService = require('../services/matching.service');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all trips
const getTrips = asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT * FROM trips ORDER BY start_date DESC'
  );

  res.json({
    success: true,
    data: result.rows,
  });
});

// Get trip by ID
const getTripById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query('SELECT * FROM trips WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Trip not found',
    });
  }

  res.json({
    success: true,
    data: result.rows[0],
  });
});

// Create trip
const createTrip = asyncHandler(async (req, res) => {
  const { city, country, startDate, endDate, notes } = req.body;

  // Validate required fields
  if (!city || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      error: 'City, start date, and end date are required',
    });
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return res.status(400).json({
      success: false,
      error: 'Start date must be before end date',
    });
  }

  const result = await query(
    `INSERT INTO trips (city, country, start_date, end_date, notes)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [city, country || null, startDate, endDate, notes || null]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
  });
});

// Update trip
const updateTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { city, country, startDate, endDate, notes } = req.body;

  // Check if trip exists
  const existing = await query('SELECT * FROM trips WHERE id = $1', [id]);

  if (existing.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Trip not found',
    });
  }

  // Validate dates if provided
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        error: 'Start date must be before end date',
      });
    }
  }

  const result = await query(
    `UPDATE trips
     SET city = COALESCE($1, city),
         country = COALESCE($2, country),
         start_date = COALESCE($3, start_date),
         end_date = COALESCE($4, end_date),
         notes = COALESCE($5, notes)
     WHERE id = $6
     RETURNING *`,
    [city, country, startDate, endDate, notes, id]
  );

  res.json({
    success: true,
    data: result.rows[0],
  });
});

// Delete trip
const deleteTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query('DELETE FROM trips WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Trip not found',
    });
  }

  res.json({
    success: true,
    message: 'Trip deleted successfully',
    data: result.rows[0],
  });
});

// Get recommendations for a trip
const getTripRecommendations = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recommendations = await matchingService.getRecommendationsForTrip(parseInt(id));

  res.json({
    success: true,
    data: recommendations,
  });
});

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripRecommendations,
};
