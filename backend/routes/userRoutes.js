const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model
// const generateToken = require('../utils/generateToken'); // Not directly used in this updated file

// NOTE: The traditional /api/users/register endpoint is commented out.
// User registration is now handled by Firebase Authentication on the frontend,
// followed by a call to /api/auth/register-profile to save the user's role in MongoDB.

// @route   POST /api/users/register
// @desc    Register a new user (This route is now redundant if Firebase is primary auth)
// @access  Public
/*
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check if user already exists by email
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ msg: 'User already exists with this email' });
        }

        // Check if username is already taken
        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ msg: 'Username already taken' });
        }

        const user = new User({
            username,
            email,
            password, // Password will be hashed by the pre-save hook in User model
        });

        await user.save(); // Save the new user to the database

        // Respond with user data and a JWT token
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id), // Generate JWT token
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
*/

// You can add other user-related routes here that operate on the User model,
// e.g., updating user profile, fetching a list of professionals (if needed).
// Make sure to use the 'protect' middleware for authenticated routes.

module.exports = router;