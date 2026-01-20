import { useState, useEffect } from 'react';
import { itineraryService } from '../../services/itinerary.service';
import { Plane, Calendar, DollarSign } from 'lucide-react';

export default function ItineraryList() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      const response = await itineraryService.getItineraries();
      if (response.success) {
        setItineraries(response.data);
      }
    } catch (error) {
      console.error('Failed to load itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading itineraries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6">Suggested Itineraries</h2>

        {itineraries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70 mb-4">No itineraries yet.</p>
            <p className="text-white/50 text-sm">
              Generate itineraries by selecting shows from your trips and using the "Generate Itinerary" feature.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {itineraries.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 rounded-lg p-6 border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-white font-bold text-xl mb-2">
                      <Plane className="w-6 h-6" />
                      {item.destination}
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  {item.itinerary?.totalCost && (
                    <div className="flex items-center gap-2 text-white bg-green-500/20 px-3 py-1 rounded-lg">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{item.itinerary.totalCost}</span>
                    </div>
                  )}
                </div>

                {item.itinerary?.whyWorthIt && (
                  <p className="text-white/80 text-sm mb-4 italic border-l-4 border-purple-500 pl-4">
                    {item.itinerary.whyWorthIt}
                  </p>
                )}

                {item.itinerary?.flightInfo && (
                  <div className="mb-4 bg-white/5 rounded p-3">
                    <h4 className="text-white font-semibold mb-2">Flight Information</h4>
                    <p className="text-white/70 text-sm">{item.itinerary.flightInfo.suggestions}</p>
                    {item.itinerary.flightInfo.estimatedCost && (
                      <p className="text-white/60 text-sm mt-1">
                        Estimated: {item.itinerary.flightInfo.estimatedCost}
                      </p>
                    )}
                  </div>
                )}

                {item.itinerary?.accommodation && (
                  <div className="mb-4 bg-white/5 rounded p-3">
                    <h4 className="text-white font-semibold mb-2">Accommodation</h4>
                    <p className="text-white/70 text-sm">{item.itinerary.accommodation.suggestions}</p>
                    {item.itinerary.accommodation.estimatedCost && (
                      <p className="text-white/60 text-sm mt-1">
                        Estimated: {item.itinerary.accommodation.estimatedCost}
                      </p>
                    )}
                  </div>
                )}

                {item.itinerary?.schedule && item.itinerary.schedule.length > 0 && (
                  <div className="bg-white/5 rounded p-3">
                    <h4 className="text-white font-semibold mb-2">Daily Schedule</h4>
                    <div className="space-y-2">
                      {item.itinerary.schedule.map((day, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="text-white font-medium">Day {day.day} - {day.date}</p>
                          <ul className="text-white/70 list-disc list-inside ml-2">
                            {day.activities.map((activity, actIdx) => (
                              <li key={actIdx}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
