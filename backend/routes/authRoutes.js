const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model
// The protect middleware is crucial: it verifies the Firebase ID token and fetches the MongoDB user profile.
const { protect } = require('../middleware/authMiddleware'); 

// @route   POST /api/auth/register-profile
// @desc    Create user profile in MongoDB after successful Firebase Sign-Up (or Sign-In).
// @access  Private (requires Firebase ID token)
// NOTE: This endpoint is called from the frontend *after* Firebase creates the user.
router.post('/register-profile', protect, async (req, res) => {
    // req.firebaseUid is set by the 'protect' middleware after verifying Firebase ID token
    const { email } = req.body;
    const firebaseUid = req.firebaseUid; // Get Firebase UID from middleware

    // The 'protect' middleware ensures we have a valid firebaseUid
    if (!firebaseUid || !email) {
        // This should theoretically not happen if the frontend sends the token and email correctly
        return res.status(400).json({ msg: 'Missing required fields: firebaseUid, email' });
    }

    try {
        // 1. Check if a user profile already exists for this Firebase UID
        // The protect middleware already checks this, but we'll re-check and use it
        let userProfile = await User.findOne({ firebaseUid });
        
        if (userProfile) {
            // User profile already exists. Check if email needs an update (e.g., if user changed it in Firebase).
            if (userProfile.email !== email) {
                userProfile.email = email;
                await userProfile.save();
                return res.status(200).json({ msg: 'User profile email updated successfully.', userProfile });
            }
            // Profile exists and is up-to-date
            return res.status(200).json({ msg: 'User profile already exists.', userProfile });
        }

        // 2. Create a new user profile in MongoDB
        // We can optionally fetch the username from Firebase here if needed, 
        // but defaulting from email is fine if the client doesn't send it.
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
        // Handle common MongoDB error (e.g., if you enforce unique email on the User model)
        if (err.code === 11000) { 
            return res.status(400).json({ msg: 'A MongoDB profile already exists for this unique field (e.g., email).' });
        }
        res.status(500).send('Server Error during profile registration');
    }
});


// @route   GET /api/auth/me
// @desc    Get authenticated user's profile from MongoDB
// @access  Private (requires Firebase ID token)
router.get('/me', protect, async (req, res) => {
    try {
        // req.user is set by the 'protect' middleware and contains the MongoDB user document
        const user = req.user;

        if (!user) {
            // This case handles a valid Firebase user who hasn't completed the /register-profile step yet.
            return res.status(404).json({ msg: 'User profile not found in MongoDB. Please call /register-profile first.' });
        }

        // Return the user profile
        res.json({
            _id: user._id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            username: user.username,
            userType: user.userType,
            otherUserType: user.otherUserType,
            preferredLanguage: user.preferredLanguage,
            // Only return necessary profile fields
        });
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(500).send('Server Error');
    }
});

// REMOVED: router.post('/login', ...) as Firebase handles login directly.

module.exports = router;