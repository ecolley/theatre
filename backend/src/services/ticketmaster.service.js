const axios = require('axios');
const config = require('../config/config');

class TicketmasterService {
  constructor() {
    this.baseUrl = config.ticketmaster.baseUrl;
    this.apiKey = config.ticketmaster.apiKey;
    this.requestQueue = [];
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000 / config.ticketmaster.rateLimit.requestsPerSecond; // 200ms for 5 req/sec
  }

  // Rate limiter - ensures we don't exceed 5 requests per second
  async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  // Search for events with filters
  async searchEvents({
    city,
    country,
    stateCode,
    startDate,
    endDate,
    classificationName = 'Arts & Theatre',
    size = 50,
    page = 0,
  }) {
    await this.rateLimit();

    try {
      const params = {
        apikey: this.apiKey,
        classificationName,
        size,
        page,
      };

      // Add location filters
      if (city) params.city = city;
      if (country) params.countryCode = country;
      if (stateCode) params.stateCode = stateCode;

      // Add date filters
      if (startDate) {
        params.startDateTime = new Date(startDate).toISOString();
      }
      if (endDate) {
        params.endDateTime = new Date(endDate).toISOString();
      }

      console.log('Ticketmaster API request:', params);

      const response = await axios.get(`${this.baseUrl}/events.json`, {
        params,
        timeout: 10000,
      });

      const events = response.data._embedded?.events || [];
      const totalElements = response.data.page?.totalElements || 0;
      const totalPages = response.data.page?.totalPages || 0;

      console.log(`Found ${totalElements} events, page ${page + 1}/${totalPages}`);

      return {
        events: events.map(event => this.mapEvent(event)),
        pagination: {
          totalElements,
          totalPages,
          currentPage: page,
          size,
        },
      };
    } catch (error) {
      console.error('Ticketmaster API error:', error.message);

      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded for Ticketmaster API');
      }

      if (error.response?.status === 401) {
        throw new Error('Invalid Ticketmaster API key');
      }

      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  // Get event details by ID
  async getEventById(eventId) {
    await this.rateLimit();

    try {
      const response = await axios.get(`${this.baseUrl}/events/${eventId}.json`, {
        params: { apikey: this.apiKey },
        timeout: 10000,
      });

      return this.mapEvent(response.data);
    } catch (error) {
      console.error('Ticketmaster API error:', error.message);
      throw new Error(`Failed to fetch event details: ${error.message}`);
    }
  }

  // Map Ticketmaster event to our format
  mapEvent(event) {
    const venue = event._embedded?.venues?.[0];
    const priceRange = event.priceRanges?.[0];
    const classification = event.classifications?.[0];

    return {
      ticketmasterId: event.id,
      name: event.name,
      url: event.url,
      image: event.images?.[0]?.url || null,

      // Date and time
      startDate: event.dates?.start?.localDate || null,
      startTime: event.dates?.start?.localTime || null,
      timezone: event.dates?.timezone || null,

      // Venue information
      venue: {
        name: venue?.name || 'Unknown Venue',
        city: venue?.city?.name || null,
        state: venue?.state?.name || venue?.state?.stateCode || null,
        country: venue?.country?.name || venue?.country?.countryCode || null,
        address: venue?.address?.line1 || null,
        location: venue?.location || null,
      },

      // Pricing
      priceRange: priceRange ? {
        min: priceRange.min,
        max: priceRange.max,
        currency: priceRange.currency,
      } : null,

      // Classification
      classification: {
        segment: classification?.segment?.name || null,
        genre: classification?.genre?.name || null,
        subGenre: classification?.subGenre?.name || null,
        type: classification?.type?.name || null,
      },

      // Additional info
      info: event.info || null,
      pleaseNote: event.pleaseNote || null,
      status: event.dates?.status?.code || null,
    };
  }

  // Search for theatre events in multiple cities
  async searchTheatreInMultipleCities(cities, startDate, endDate) {
    const results = [];

    for (const { city, country, stateCode } of cities) {
      try {
        const response = await this.searchEvents({
          city,
          country,
          stateCode,
          startDate,
          endDate,
          classificationName: 'Arts & Theatre',
        });

        results.push({
          city,
          country,
          events: response.events,
        });
      } catch (error) {
        console.error(`Failed to search events in ${city}:`, error.message);
        results.push({
          city,
          country,
          events: [],
          error: error.message,
        });
      }
    }

    return results;
  }
}

// Export singleton instance
module.exports = new TicketmasterService();
