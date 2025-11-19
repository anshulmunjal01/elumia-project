// C:\Users\AA\Desktop\elumia-project\backend\routes\upliftmentRoutes.js
const express = require('express');
const router = express.Router();
const upliftmentController = require('../controllers/upliftmentController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

// --- Upliftment Tools API Endpoints ---

// Get upliftment content based on mood (can be protected if needed)
router.get('/content', upliftmentController.getUpliftmentContent);

// Get more content for a specific type (e.g., for infinite scroll)
router.get('/load-more', upliftmentController.loadMoreContent);

// Get a random "Message from the Universe"
router.get('/message', upliftmentController.getUniverseMessage);

// Example protected route (uncomment and use protect middleware if authentication is required)
// router.get('/music-recommendations', protect, upliftmentController.getMusicRecommendations);
// router.get('/video-recommendations', protect, upliftmentController.getVideoRecommendations);

module.exports = router;