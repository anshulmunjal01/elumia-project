// C:\Users\AA\Desktop\elumia-project\backend\server.js (or app.js)

// --- START CHANGE ---
// This line MUST be at the very top, before any other imports or code that needs .env variables.
require('dotenv').config();
// --- END CHANGE ---

const express = require('express');
const cors = require('cors'); // Assuming you use cors
const connectDB = require('./config/db'); // Import your database connection function
const aiRoutes = require('./routes/aiRoutes'); // Path to your aiRoutes.js
const journalRoutes = require('./routes/journalRoutes'); // Import your journal routes
const userRoutes = require('./routes/userRoutes'); // Assuming you have user routes for auth
const authRoutes = require('./routes/authRoutes'); // Assuming you have auth routes for login/register
const upliftmentRoutes = require('./routes/upliftmentRoutes'); // NEW: Import upliftment routes
const professionalRoutes = require('./routes/professionalRoutes'); // NEW: Import professional routes
const appointmentRoutes = require('./routes/appointmentRoutes'); // NEW: Import appointment routes
const admin = require('firebase-admin'); // NEW: Import Firebase Admin SDK

const app = express();

// --- NEW: Initialize Firebase Admin SDK ---
// Make sure serviceAccountKey.json is in backend/config/
try {
    const serviceAccount = require('./config/serviceAccountKey.json'); // Path to your downloaded key
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error.message);
    console.error('Please ensure backend/config/serviceAccountKey.json exists and is valid.');
    // Exit process or handle error appropriately if Firebase is critical
}
// --- END NEW: Initialize Firebase Admin SDK ---


// Connect Database
connectDB(); // Call the function to connect to MongoDB

// Middleware
app.use(cors()); // Enable CORS for your frontend
// Increase limit for parsing JSON, especially for base64 image data from drawings
app.use(express.json({ limit: '50mb' })); // Enable parsing of JSON request bodies with increased limit

// --- START UPLIFTMENT TOOLS MOCK DATA & API ENDPOINTS (These are now handled in upliftmentController.js) ---
// The mock data and API endpoints logic has been moved to backend/controllers/upliftmentController.js
// and backend/routes/upliftmentRoutes.js for better organization.
// This section is kept as a comment to indicate where the previous mock data was.
/*
const picsumImageUrls = [ ... ];
const mockBaseContent = { ... };
const mockUniverseMessages = [ ... ];
const generateMoreContent = (type, currentCount = 0, count = 4) => { ... };
app.get('/api/upliftment/content', (req, res) => { ... });
app.get('/api/upliftment/load-more', (req, res) => { ... });
app.get('/api/upliftment/message', (req, res) => { ... });
*/
// --- END UPLIFTMENT TOOLS MOCK DATA & API ENDPOINTS ---


// Mount your routes
app.use('/api', aiRoutes); // Existing AI routes
app.use('/api/journal', journalRoutes); // NEW: Mount your journal routes
app.use('/api/users', userRoutes); // NEW: Assuming you'll have user management routes
app.use('/api/auth', authRoutes); // NEW: Mount your authentication routes (login/register)
app.use('/api/upliftment', upliftmentRoutes); // NEW: Mount upliftment routes here
app.use('/api/professionals', professionalRoutes); // NEW: Mount professional routes here
app.use('/api/appointments', appointmentRoutes); // NEW: Mount appointment routes here

// Basic route for testing server status
app.get('/', (req, res) => {
    res.send('Elumia Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    // --- START VERIFICATION LOG ---
    // Add this line to confirm API key is loaded
    console.log(`Gemini API Key loaded: ${!!process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
    // NEW: Add checks for Spotify and YouTube API keys
    console.log(`Spotify Client ID loaded: ${!!process.env.SPOTIFY_CLIENT_ID ? 'Yes' : 'No'}`);
    console.log(`Spotify Client Secret loaded: ${!!process.env.SPOTIFY_CLIENT_SECRET ? 'Yes' : 'No'}`);
    console.log(`YouTube API Key loaded: ${!!process.env.YOUTUBE_API_KEY ? 'Yes' : 'No'}`);
    // --- END VERIFICATION LOG ---
});
