import { useState, useEffect } from 'react';
import { profileService } from '../../services/profile.service';
import { Plus, X, Save } from 'lucide-react';

export default function TasteProfile() {
  const [profile, setProfile] = useState({ artists: [], shows: [], festivals: [] });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [newArtist, setNewArtist] = useState('');
  const [newShow, setNewShow] = useState('');
  const [newFestival, setNewFestival] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileService.getProfile();
      if (response.success) {
        setProfile(response.data.profile);
        setNotes(response.data.notes || '');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      await profileService.updateProfile(profile, notes);
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addItem = (type, value) => {
    if (!value.trim()) return;
    setProfile(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }));

    if (type === 'artists') setNewArtist('');
    if (type === 'shows') setNewShow('');
    if (type === 'festivals') setNewFestival('');
  };

  const removeItem = (type, index) => {
    setProfile(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return <div className="text-white text-center">Loading profile...</div>;
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Build Your Taste Profile</h2>

      <div className="space-y-6">
        {/* Favorite Artists */}
        <div>
          <label className="block text-white font-medium mb-2">Favorite Artists/Companies</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('artists', newArtist)}
              placeholder="Enter artist name..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => addItem('artists', newArtist)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.artists.map((artist, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-full text-sm"
              >
                {artist}
                <button onClick={() => removeItem('artists', index)}>
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Favorite Shows */}
        <div>
          <label className="block text-white font-medium mb-2">Favorite Shows</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newShow}
              onChange={(e) => setNewShow(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('shows', newShow)}
              placeholder="Enter show name..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => addItem('shows', newShow)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.shows.map((show, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-full text-sm"
              >
                {show}
                <button onClick={() => removeItem('shows', index)}>
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Favorite Festivals */}
        <div>
          <label className="block text-white font-medium mb-2">Favorite Festivals</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newFestival}
              onChange={(e) => setNewFestival(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('festivals', newFestival)}
              placeholder="Enter festival name..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => addItem('festivals', newFestival)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.festivals.map((festival, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-full text-sm"
              >
                {festival}
                <button onClick={() => removeItem('festivals', index)}>
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-white font-medium mb-2">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other preferences..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>

          {message && (
            <span className={`text-sm ${message.includes('success') ? 'text-green-300' : 'text-red-300'}`}>
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
