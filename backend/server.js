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

const app = express();

// Connect Database
connectDB(); // Call the function to connect to MongoDB

// Middleware
app.use(cors()); // Enable CORS for your frontend
// Increase limit for parsing JSON, especially for base64 image data from drawings
app.use(express.json({ limit: '50mb' })); // Enable parsing of JSON request bodies with increased limit

// Mount your routes
app.use('/api', aiRoutes); // Existing AI routes
app.use('/api/journal', journalRoutes); // NEW: Mount your journal routes
app.use('/api/users', userRoutes); // NEW: Assuming you'll have user management routes
app.use('/api/auth', authRoutes); // NEW: Assuming you'll have authentication routes (login/register)

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
    // --- END VERIFICATION LOG ---
});