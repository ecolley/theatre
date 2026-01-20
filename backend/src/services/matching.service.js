const ticketmasterService = require('./ticketmaster.service');
const claudeService = require('./claude.service');
const cacheService = require('./cache.service');
const { query } = require('../config/database');

class MatchingService {
  // Discover events matching user's taste profile
  async discoverEvents({ city, country, stateCode, startDate, endDate, useCache = true }) {
    try {
      // Build cache key parameters
      const cacheParams = { city, country, stateCode, startDate, endDate };

      // Try to get from cache first
      if (useCache) {
        const cachedResults = await cacheService.getCachedEventSearch(cacheParams);
        if (cachedResults) {
          console.log('Returning cached event search results');
          return cachedResults;
        }
      }

      // Get user's taste profile from database
      const profileResult = await query('SELECT profile_data FROM taste_profile ORDER BY id LIMIT 1');

      if (profileResult.rows.length === 0) {
        throw new Error('Taste profile not found');
      }

      const tasteProfile = profileResult.rows[0].profile_data;

      // Search events using Ticketmaster
      console.log('Searching events via Ticketmaster...');
      const searchResults = await ticketmasterService.searchEvents({
        city,
        country,
        stateCode,
        startDate,
        endDate,
        classificationName: 'Arts & Theatre',
        size: 50,
      });

      if (searchResults.events.length === 0) {
        return {
          events: [],
          message: 'No events found',
        };
      }

      console.log(`Found ${searchResults.events.length} events, matching to profile...`);

      // Match events to user's taste profile using Claude
      const matchedEvents = await claudeService.matchEventsToProfile(
        searchResults.events,
        tasteProfile
      );

      // Filter events with match score > 0.3
      const relevantEvents = matchedEvents.filter(event => event.matchScore > 0.3);

      const result = {
        events: relevantEvents,
        totalFound: searchResults.events.length,
        matchedCount: relevantEvents.length,
        pagination: searchResults.pagination,
      };

      // Cache the results
      if (useCache) {
        await cacheService.cacheEventSearch(cacheParams, result);
      }

      return result;
    } catch (error) {
      console.error('Error discovering events:', error);
      throw error;
    }
  }

  // Get recommendations for a specific trip
  async getRecommendationsForTrip(tripId) {
    try {
      // Get trip details
      const tripResult = await query('SELECT * FROM trips WHERE id = $1', [tripId]);

      if (tripResult.rows.length === 0) {
        throw new Error('Trip not found');
      }

      const trip = tripResult.rows[0];

      // Try cache first
      const cacheParams = {
        city: trip.city,
        country: trip.country,
        startDate: trip.start_date,
        endDate: trip.end_date,
      };

      const cachedResults = await cacheService.getCachedRecommendations(cacheParams);
      if (cachedResults) {
        console.log('Returning cached trip recommendations');
        return cachedResults;
      }

      // Discover events for the trip location and dates
      const results = await this.discoverEvents({
        city: trip.city,
        country: trip.country,
        startDate: trip.start_date,
        endDate: trip.end_date,
        useCache: true,
      });

      // Cache recommendations
      await cacheService.cacheRecommendations(cacheParams, results);

      return results;
    } catch (error) {
      console.error('Error getting trip recommendations:', error);
      throw error;
    }
  }

  // Save event to database
  async saveEvent(event) {
    try {
      const result = await query(
        `INSERT INTO saved_events (ticketmaster_id, event_data, match_reason, match_score)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (ticketmaster_id)
         DO UPDATE SET
           event_data = $2,
           match_reason = $3,
           match_score = $4,
           saved_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [
          event.ticketmasterId,
          JSON.stringify(event),
          event.matchReason || null,
          event.matchScore || null,
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error saving event:', error);
      throw error;
    }
  }

  // Get saved events
  async getSavedEvents(limit = 50, offset = 0) {
    try {
      const result = await query(
        `SELECT * FROM saved_events
         ORDER BY match_score DESC, saved_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      return result.rows.map(row => ({
        id: row.id,
        event: row.event_data,
        matchReason: row.match_reason,
        matchScore: row.match_score,
        savedAt: row.saved_at,
      }));
    } catch (error) {
      console.error('Error getting saved events:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new MatchingService();
