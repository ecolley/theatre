const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const { asyncHandler } = require('../middleware/errorHandler');

// Hash the app password for comparison
const hashedPassword = bcrypt.hashSync(config.appPassword || 'default', 10);

// Login with password
const login = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Password is required',
    });
  }

  // Compare password
  const isValid = bcrypt.compareSync(password, hashedPassword);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      error: 'Invalid password',
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      authenticated: true,
      timestamp: Date.now(),
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );

  res.json({
    success: true,
    token,
    expiresIn: config.jwtExpiresIn,
  });
});

// Verify token endpoint (optional)
const verify = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    auth: req.auth,
  });
});

module.exports = {
  login,
  verify,
};
