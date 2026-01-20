import { useState } from 'react';
import { authService } from '../services/auth.service';
import { LogOut, User, Calendar, MapPin, Plane } from 'lucide-react';
import TasteProfile from './Profile/TasteProfile';
import EventList from './Events/EventList';
import TripList from './Trips/TripList';
import ItineraryList from './Itinerary/ItineraryList';

const tabs = [
  { id: 'profile', name: 'Taste Profile', icon: User },
  { id: 'events', name: 'Discover Events', icon: MapPin },
  { id: 'trips', name: 'My Trips', icon: Calendar },
  { id: 'itineraries', name: 'Itineraries', icon: Plane },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    authService.logout();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <TasteProfile />;
      case 'events':
        return <EventList />;
      case 'trips':
        return <TripList />;
      case 'itineraries':
        return <ItineraryList />;
      default:
        return <TasteProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">
            My Theatre World
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/20"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-900'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
}
