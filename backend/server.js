// server.js

// ------------------------------------
// 1. CONFIGURATION & INITIALIZATION
// ------------------------------------

// This line MUST be at the very top, before any other imports that use env variables.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import your database connection function
const admin = require('firebase-admin'); // Import the firebase-admin library

const app = express();

// --- CRITICAL: Initialize Firebase Admin SDK ---
// This logic must execute *before* the Express routes are loaded.
if (!admin.apps.length) {
    try {
        // The service account JSON is loaded directly from your environment variable
        const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT
        );

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
        // If this error persists, there is still an issue with the FIREBASE_SERVICE_ACCOUNT string in your .env
        console.error('Failed to initialize Firebase Admin SDK:', error.message);
        console.error('Please ensure FIREBASE_SERVICE_ACCOUNT is set correctly in .env.');
    }
}

// Connect Database (can happen before or after Firebase init)
connectDB();

// ------------------------------------
// 2. MIDDLEWARE & ROUTES
// ------------------------------------

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Import routes *AFTER* all initialization (Firebase, DB) is complete
const aiRoutes = require('./routes/aiRoutes');
const journalRoutes = require('./routes/journalRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const upliftmentRoutes = require('./routes/upliftmentRoutes');
const professionalRoutes = require('./routes/professionalRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Mount your routes
app.use('/api', aiRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); // <-- Auth middleware is now safe to run!
app.use('/api/upliftment', upliftmentRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/appointments', appointmentRoutes);

// Basic route for testing server status
app.get('/', (req, res) => {
    res.send('Elumia Backend is running!');
});

// ------------------------------------
// 3. SERVER START
// ------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    // --- VERIFICATION LOG ---
    console.log(`Gemini API Key loaded: ${!!process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
    console.log(`Spotify Client ID loaded: ${!!process.env.SPOTIFY_CLIENT_ID ? 'Yes' : 'No'}`);
    console.log(`Spotify Client Secret loaded: ${!!process.env.SPOTIFY_CLIENT_SECRET ? 'Yes' : 'No'}`);
    console.log(`YouTube API Key loaded: ${!!process.env.YOUTUBE_API_KEY ? 'Yes' : 'No'}`);
});