const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config/config');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: config.anthropic.apiKey,
    });
    this.model = config.anthropic.model;
    this.maxTokens = config.anthropic.maxTokens;
  }

  // Match events to user's taste profile
  async matchEventsToProfile(events, tasteProfile) {
    if (!events || events.length === 0) {
      return [];
    }

    const { artists = [], shows = [], festivals = [] } = tasteProfile;

    // Build user preferences summary
    const preferencesSummary = this.buildPreferencesSummary(artists, shows, festivals);

    // Build events summary for matching
    const eventsSummary = events.map((event, index) => ({
      index,
      name: event.name,
      venue: event.venue.name,
      city: event.venue.city,
      genre: event.classification?.genre || 'Theatre',
      type: event.classification?.type || '',
    }));

    const prompt = `You are a theatre recommendation expert. Rate how well each event matches the user's taste profile.

User's Taste Profile:
${preferencesSummary}

Events to Rate:
${eventsSummary.map((e, i) => `${i + 1}. ${e.name} - ${e.genre}${e.type ? ` (${e.type})` : ''} at ${e.venue} in ${e.city}`).join('\n')}

For each event, provide:
1. A match score from 0.0 to 1.0 (where 1.0 is a perfect match)
2. A brief reason explaining why it matches or doesn't match

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
[
  {
    "index": 0,
    "score": 0.85,
    "reason": "Matches interest in modern dance"
  }
]`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0].text;
      console.log('Claude response:', content);

      // Parse JSON response
      const matches = this.parseJSONResponse(content);

      // Combine events with their match scores
      const scoredEvents = events.map((event, index) => {
        const match = matches.find(m => m.index === index);
        return {
          ...event,
          matchScore: match?.score || 0,
          matchReason: match?.reason || 'No specific match found',
        };
      });

      // Sort by match score descending
      return scoredEvents.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`Failed to match events: ${error.message}`);
    }
  }

  // Generate trip itinerary
  async generateItinerary({ destination, startDate, endDate, shows, budget }) {
    const prompt = `Create a detailed trip itinerary for a theatre lover visiting ${destination}.

Trip Details:
- Destination: ${destination}
- Dates: ${startDate} to ${endDate}
- Shows to attend: ${shows.map(s => s.name).join(', ')}
${budget ? `- Budget: ${budget}` : ''}

Include:
1. Flight recommendations (departure city: Dublin)
2. Accommodation suggestions
3. Daily schedule including show times
4. Dining recommendations near theatres
5. Total estimated cost
6. Why this trip is worthwhile

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "destination": "${destination}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "shows": [],
  "flightInfo": {
    "from": "Dublin",
    "to": "${destination}",
    "estimatedCost": "€XXX - €XXX",
    "suggestions": "Flight details..."
  },
  "accommodation": {
    "suggestions": "Hotel recommendations...",
    "estimatedCost": "€XXX per night"
  },
  "schedule": [
    {
      "day": 1,
      "date": "${startDate}",
      "activities": ["Activity 1", "Show at 8PM"]
    }
  ],
  "dining": ["Restaurant 1", "Restaurant 2"],
  "totalCost": "€XXXX - €XXXX",
  "whyWorthIt": "Explanation..."
}`;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0].text;
      return this.parseJSONResponse(content);
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`Failed to generate itinerary: ${error.message}`);
    }
  }

  // Helper: Build preferences summary
  buildPreferencesSummary(artists, shows, festivals) {
    const parts = [];

    if (artists.length > 0) {
      parts.push(`Favorite Artists/Companies: ${artists.join(', ')}`);
    }

    if (shows.length > 0) {
      parts.push(`Favorite Shows: ${shows.join(', ')}`);
    }

    if (festivals.length > 0) {
      parts.push(`Favorite Festivals: ${festivals.join(', ')}`);
    }

    return parts.length > 0 ? parts.join('\n') : 'No specific preferences provided';
  }

  // Helper: Parse JSON response (handles markdown code blocks)
  parseJSONResponse(content) {
    try {
      // Remove markdown code blocks if present
      let cleaned = content.trim();

      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/```\n?/g, '');
      }

      // Find JSON content between first { or [ and last } or ]
      const startChar = cleaned.includes('[') && cleaned.indexOf('[') < cleaned.indexOf('{') ? '[' : '{';
      const endChar = startChar === '[' ? ']' : '}';
      const start = cleaned.indexOf(startChar);
      const end = cleaned.lastIndexOf(endChar);

      if (start === -1 || end === -1) {
        throw new Error('No valid JSON found in response');
      }

      cleaned = cleaned.substring(start, end + 1);

      // Remove trailing commas
      cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Failed to parse JSON:', content);
      throw new Error(`Failed to parse Claude response: ${error.message}`);
    }
  }
}

// Export singleton instance
module.exports = new ClaudeService();
