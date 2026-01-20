import { useState } from 'react';
import { eventsService } from '../../services/events.service';
import { Search } from 'lucide-react';
import EventCard from './EventCard';

export default function EventList() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setEvents([]);

    try {
      const response = await eventsService.discoverEvents({
        city,
        country,
        startDate,
        endDate,
      });

      if (response.success) {
        setEvents(response.data.events || []);
        if (response.data.events.length === 0) {
          setMessage('No events found matching your criteria');
        } else {
          setMessage(`Found ${response.data.matchedCount} matching events out of ${response.data.totalFound} total`);
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to discover events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Discover Theatre Events</h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., London, New York, Paris"
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Country Code</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., GB, US, FR"
                maxLength={2}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
            {loading ? 'Searching...' : 'Discover Events'}
          </button>

          {message && (
            <p className={`text-sm ${message.includes('Failed') ? 'text-red-300' : 'text-white/70'}`}>
              {message}
            </p>
          )}
        </form>
      </div>

      {events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event, index) => (
            <EventCard key={event.ticketmasterId || index} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
