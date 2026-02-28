const express = require('express')
const router = express.Router()
const {signup, login} = require('../controllers/auth.controller')
const login_limiter = require('../middleware/ratelimit.middleware')
const jwt = require('jsonwebtoken')
const jwt_config = require('../config/jwt')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/signup', signup)

// Rate limited login
router.post('/login', login_limiter, login)

// Protected route
router.get('/profile', authMiddleware, (req, res) => {
    // res.json({ message: `Welcome user ${req.userId}` });
    res.json({ message: "Protected route access granted"})
})


router.post('/refresh', (req, res) => {
  // const { refreshToken } = req.body;

  const refreshToken = req.cookies.refreshToken

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token missing" });

  try {
    const decoded = jwt.verify(
      refreshToken,
      jwt_config.REFRESH_TOKEN_SECRET_KEY
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      jwt_config.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: jwt_config.ACCESS_TOKEN_EXPIRES_IN }
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'strict'
  })
  res.json({ message: "Logged out successfully" });
})

module.exports = router