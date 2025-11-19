const admin = require('firebase-admin');
require('dotenv').config(); // Ensure env variables are loaded if this file is run standalone

// This is the check to prevent the app from crashing if it tries to initialize twice
if (!admin.apps.length) {
    try {
        // The service account JSON is loaded from your environment variable
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

        // Initialize the app with the service account
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin SDK initialized successfully.");

    } catch (error) {
        console.error("Failed to initialize Firebase Admin SDK:", error.message);
        // The previous JSON parsing errors were here, but should be fixed now!
    }
}

// Export the initialized admin object so other files can use it.
module.exports = admin;