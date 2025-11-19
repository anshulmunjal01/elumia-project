const admin = require('firebase-admin');
const User = require('../models/User'); // Import your User model

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token using Firebase Admin SDK
            const decodedToken = await admin.auth().verifyIdToken(token);

            // Attach Firebase UID to the request
            req.firebaseUid = decodedToken.uid;

            // Fetch the corresponding user from your MongoDB (User model)
            // This is crucial for subsequent routes to know the user's role and other DB-specific data
            const user = await User.findOne({ firebaseUid: decodedToken.uid });

            if (!user) {
                // If a Firebase user exists but no corresponding MongoDB profile,
                // it means the /register-profile step might not have completed.
                // We still let the request proceed but without req.user,
                // allowing /register-profile to create the user.
                // For other protected routes, they should check for req.user if a DB profile is mandatory.
                console.warn(`MongoDB user profile not found for Firebase UID: ${decodedToken.uid}.`);
                // You might choose to return a 404 here if *every* protected route requires a MongoDB user profile.
                // For /api/auth/me, it explicitly checks for req.user, so this is fine.
            }
            req.user = user; // Attach the MongoDB user document to the request

            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            console.error('Error in auth middleware:', error.message);
            if (error.code === 'auth/id-token-expired') {
                return res.status(401).json({ msg: 'Not authorized, token expired.' });
            }
            if (error.code === 'auth/argument-error' || error.code === 'auth/invalid-id-token') {
                 return res.status(401).json({ msg: 'Not authorized, invalid token.' });
            }
            res.status(401).json({ msg: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token.' });
    }
};

module.exports = { protect };