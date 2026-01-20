const { query } = require('../config/database');
const claudeService = require('../services/claude.service');
const { asyncHandler } = require('../middleware/errorHandler');

// Generate itinerary
const generateItinerary = asyncHandler(async (req, res) => {
  const { destination, startDate, endDate, shows, budget } = req.body;

  // Validate required fields
  if (!destination || !startDate || !endDate || !shows || shows.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Destination, start date, end date, and shows are required',
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

  console.log('Generating itinerary with Claude Haiku...');

  // Generate itinerary using Claude
  const itinerary = await claudeService.generateItinerary({
    destination,
    startDate,
    endDate,
    shows,
    budget,
  });

  // Save itinerary to database
  const result = await query(
    `INSERT INTO itineraries (destination, start_date, end_date, itinerary_data)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [destination, startDate, endDate, JSON.stringify(itinerary)]
  );

  res.status(201).json({
    success: true,
    data: {
      id: result.rows[0].id,
      itinerary,
      createdAt: result.rows[0].created_at,
    },
  });
});

// Get all itineraries
const getItineraries = asyncHandler(async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  const result = await query(
    `SELECT * FROM itineraries
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [parseInt(limit), parseInt(offset)]
  );

  res.json({
    success: true,
    data: result.rows.map(row => ({
      id: row.id,
      destination: row.destination,
      startDate: row.start_date,
      endDate: row.end_date,
      itinerary: row.itinerary_data,
      createdAt: row.created_at,
    })),
  });
});

// Get itinerary by ID
const getItineraryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query('SELECT * FROM itineraries WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Itinerary not found',
    });
  }

  res.json({
    success: true,
    data: {
      id: result.rows[0].id,
      destination: result.rows[0].destination,
      startDate: result.rows[0].start_date,
      endDate: result.rows[0].end_date,
      itinerary: result.rows[0].itinerary_data,
      createdAt: result.rows[0].created_at,
    },
  });
});

// Delete itinerary
const deleteItinerary = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query('DELETE FROM itineraries WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Itinerary not found',
    });
  }

  res.json({
    success: true,
    message: 'Itinerary deleted successfully',
  });
});

module.exports = {
  generateItinerary,
  getItineraries,
  getItineraryById,
  deleteItinerary,
};
