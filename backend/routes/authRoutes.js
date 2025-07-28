// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model
const generateToken = require('../utils/generateToken'); // Import the token utility
const protect = require('../middleware/authMiddleware'); // Import the protect middleware

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check if user exists by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password using the method defined in User model
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Respond with user data and a JWT token
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            preferredLanguage: user.preferredLanguage, // Include preferred language
            token: generateToken(user._id), // Generate JWT token
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/me
// @desc    Get authenticated user profile
// @access  Private (requires token)
router.get('/me', protect, async (req, res) => {
    try {
        // req.user is set by the protect middleware (it contains user ID)
        const user = await User.findById(req.user.id).select('-password'); // Fetch user data excluding password
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;