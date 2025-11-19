const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model
const { protect } = require('../middleware/authMiddleware'); // Import the updated Firebase protect middleware

// NOTE: The traditional /api/auth/login endpoint is removed as Firebase handles login directly.
// The frontend will use Firebase's signInWithEmailAndPassword and then fetch user details via /api/auth/me.

// @route   POST /api/auth/register-profile
// @desc    Register user profile in MongoDB after Firebase authentication
// @access  Private (requires Firebase ID token)
router.post('/register-profile', protect, async (req, res) => {
    // req.firebaseUid is set by the 'protect' middleware after verifying Firebase ID token
    const { email } = req.body; // userType and otherUserType are no longer expected from frontend
    const firebaseUid = req.firebaseUid; // Get Firebase UID from middleware

    if (!firebaseUid || !email) {
        return res.status(400).json({ msg: 'Missing required fields: firebaseUid, email' });
    }

    try {
        // Check if a user profile already exists for this Firebase UID
        let userProfile = await User.findOne({ firebaseUid });
        if (userProfile) {
            // If a profile exists, check if it's the same email or if an update is needed
            // The userType will now be defaulted by the User model if not present, or remain as is.
            if (userProfile.email === email) {
                 return res.status(200).json({ msg: 'User profile already exists and is up-to-date.', userProfile });
            } else {
                // If profile exists but email is different, update it
                userProfile.email = email;
                await userProfile.save();
                return res.status(200).json({ msg: 'User profile updated successfully.', userProfile });
            }
        }

        // Create a new user profile in MongoDB
        // userType will be 'patient' by default as per User model schema
        userProfile = new User({
            firebaseUid,
            email,
            username: email.split('@')[0] // Basic default username from email
        });

        await userProfile.save();

        res.status(201).json({
            _id: userProfile._id,
            firebaseUid: userProfile.firebaseUid,
            email: userProfile.email,
            userType: userProfile.userType, // Will be 'patient' by default
            msg: 'User profile registered successfully.'
        });

    } catch (err) {
        console.error('Error registering user profile:', err.message);
        // Handle duplicate email error specifically if email is also unique in MongoDB
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(400).json({ msg: 'A user with this email already has a profile.' });
        }
        res.status(500).send('Server Error during profile registration');
    }
});

// @route   POST /api/auth/login
// @desc    Login user (Firebase handles authentication, this route might be for session management or just a placeholder)
// @access  Public
// Note: Similar to /register, Firebase login happens on the frontend.
// This route could be used for creating a session token on the backend if not using Firebase ID tokens directly for every request.
router.post('/login', async (req, res) => {
    res.status(200).json({ msg: 'Firebase login handled on frontend.' });
});

// @route   GET /api/auth/me
// @desc    Get authenticated user's profile from MongoDB
// @access  Private (requires Firebase ID token)
router.get('/me', protect, async (req, res) => {
    try {
        // req.user is set by the 'protect' middleware and contains the MongoDB user document
        const user = req.user;

        if (!user) {
            return res.status(404).json({ msg: 'User profile not found.' });
        }

        // Return the user profile including userType
        res.json({
            _id: user._id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            username: user.username,
            userType: user.userType,
            otherUserType: user.otherUserType,
            preferredLanguage: user.preferredLanguage,
            // Add any other profile fields you want to return
        });
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(500).send('Server Error');
    }
});

// You can add other authentication-related routes here, e.g., password reset requests (handled by Firebase)

module.exports = router;