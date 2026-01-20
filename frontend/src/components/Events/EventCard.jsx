import { MapPin, Calendar, ExternalLink } from 'lucide-react';

export default function EventCard({ event }) {
  const matchPercentage = Math.round(event.matchScore * 100);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
          <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
            <MapPin className="w-4 h-4" />
            <span>{event.venue.name}, {event.venue.city}</span>
          </div>
          {event.startDate && (
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{new Date(event.startDate).toLocaleDateString()}</span>
              {event.startTime && <span>at {event.startTime}</span>}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            matchPercentage >= 80 ? 'bg-green-500/20 text-green-300' :
            matchPercentage >= 60 ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-orange-500/20 text-orange-300'
          }`}>
            {matchPercentage}% Match
          </div>
        </div>
      </div>

      {event.classification && (
        <div className="flex gap-2 mb-3">
          {event.classification.genre && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-xs">
              {event.classification.genre}
            </span>
          )}
          {event.classification.type && (
            <span className="px-2 py-1 bg-pink-500/20 text-pink-200 rounded text-xs">
              {event.classification.type}
            </span>
          )}
        </div>
      )}

      {event.matchReason && (
        <p className="text-white/80 text-sm mb-4 italic">
          {event.matchReason}
        </p>
      )}

      {event.priceRange && (
        <p className="text-white/70 text-sm mb-4">
          Price: {event.priceRange.currency} {event.priceRange.min} - {event.priceRange.max}
        </p>
      )}

      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          View Tickets
        </a>
      )}
    </div>
  );
}
