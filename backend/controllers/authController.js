const admin = require('../firebase'); // Initialized Firebase Admin
const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ msg: 'Please provide all required fields.' });
        }

        // Create Firebase Auth user
        const firebaseUser = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        // Create MongoDB user profile
        const user = await User.create({
            firebaseUid: firebaseUser.uid,
            email,
            name,
        });

        // Optional: create a custom token to send to frontend for login
        const token = await admin.auth().createCustomToken(firebaseUser.uid);

        res.status(201).json({
            msg: 'User registered successfully',
            user,
            token,
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ msg: 'Email already in use.' });
        }
        res.status(500).json({ msg: 'Server error during registration.' });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Please provide email and password.' });
        }

        // Firebase Admin cannot directly verify password, so you typically:
        // 1. Let frontend use Firebase client SDK to sign in.
        // 2. Receive the ID token from frontend.
        // 3. Verify the token on backend (your protect middleware handles this).

        // For demonstration, we can return a custom token
        const userRecord = await admin.auth().getUserByEmail(email);

        const token = await admin.auth().createCustomToken(userRecord.uid);

        res.status(200).json({
            msg: 'Login successful. Send this token to frontend for authentication.',
            token,
        });
    } catch (error) {
        console.error('Error logging in user:', error.message);
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ msg: 'User not found.' });
        }
        res.status(500).json({ msg: 'Server error during login.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
