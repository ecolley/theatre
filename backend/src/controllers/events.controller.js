const matchingService = require('../services/matching.service');
const ticketmasterService = require('../services/ticketmaster.service');
const { asyncHandler } = require('../middleware/errorHandler');

// Discover events matching user's taste profile
const discoverEvents = asyncHandler(async (req, res) => {
  const { city, country, stateCode, startDate, endDate, useCache } = req.query;

  // Validate required parameters
  if (!city) {
    return res.status(400).json({
      success: false,
      error: 'City parameter is required',
    });
  }

  // Validate dates
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

  const results = await matchingService.discoverEvents({
    city,
    country,
    stateCode,
    startDate,
    endDate,
    useCache: useCache !== 'false', // Default to true
  });

  res.json({
    success: true,
    data: results,
  });
});

// Get event details by Ticketmaster ID
const getEventById = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await ticketmasterService.getEventById(eventId);

  res.json({
    success: true,
    data: event,
  });
});

// Save event
const saveEvent = asyncHandler(async (req, res) => {
  const { event } = req.body;

  if (!event || !event.ticketmasterId) {
    return res.status(400).json({
      success: false,
      error: 'Event data with ticketmasterId is required',
    });
  }

  const savedEvent = await matchingService.saveEvent(event);

  res.json({
    success: true,
    data: savedEvent,
  });
});

// Get saved events
const getSavedEvents = asyncHandler(async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  const savedEvents = await matchingService.getSavedEvents(
    parseInt(limit),
    parseInt(offset)
  );

  res.json({
    success: true,
    data: savedEvents,
  });
});

module.exports = {
  discoverEvents,
  getEventById,
  saveEvent,
  getSavedEvents,
};
