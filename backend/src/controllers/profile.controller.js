const { query } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

// Get taste profile
const getProfile = asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM taste_profile ORDER BY id LIMIT 1');

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Profile not found',
    });
  }

  res.json({
    success: true,
    data: {
      id: result.rows[0].id,
      profile: result.rows[0].profile_data,
      notes: result.rows[0].notes,
      updatedAt: result.rows[0].updated_at,
    },
  });
});

// Update taste profile
const updateProfile = asyncHandler(async (req, res) => {
  const { profile, notes } = req.body;

  if (!profile) {
    return res.status(400).json({
      success: false,
      error: 'Profile data is required',
    });
  }

  // Validate profile structure
  if (!profile.artists || !profile.shows || !profile.festivals) {
    return res.status(400).json({
      success: false,
      error: 'Profile must contain artists, shows, and festivals arrays',
    });
  }

  // Update or insert profile (there should only be one)
  const result = await query(
    `INSERT INTO taste_profile (id, profile_data, notes)
     VALUES (1, $1, $2)
     ON CONFLICT (id)
     DO UPDATE SET
       profile_data = $1,
       notes = $2,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [JSON.stringify(profile), notes || null]
  );

  res.json({
    success: true,
    data: {
      id: result.rows[0].id,
      profile: result.rows[0].profile_data,
      notes: result.rows[0].notes,
      updatedAt: result.rows[0].updated_at,
    },
  });
});

module.exports = {
  getProfile,
  updateProfile,
};
