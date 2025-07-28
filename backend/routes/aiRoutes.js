// C:\Users\AA\Desktop\elumia-project\backend\routes\aiRoutes.js

const express = require('express');
const router = express.Router();
// This is the ONLY require statement that should look like this in aiRoutes.js
const aiService = require('../services/aiService'); // Correct path to aiService.js

// Route for AI chat
router.post('/chat', async (req, res) => {
    const { message, history, userMood } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    try {
        const aiResponse = await aiService.getLLMResponse(message, history, userMood);
        res.json(aiResponse);
    } catch (error) {
        console.error('Error in AI chat:', error);
        res.status(500).json({ error: error.message || 'An unexpected error occurred during AI chat.' });
    }
});

// Route for text emotion detection
router.post('/detect-emotion-text', async (req, res) => {
    const { text } = req.body;
    try {
        const mood = await aiService.detectEmotionFromText(text);
        res.json({ mood });
    } catch (error) {
        console.error('Error in text emotion detection:', error);
        res.status(500).json({ error: error.message || 'Error detecting emotion from text.' });
    }
});

// Route for audio emotion detection (placeholder)
router.post('/detect-emotion-audio', async (req, res) => {
    const { audioData } = req.body;
    try {
        const mood = await aiService.detectEmotionFromAudio(audioData);
        res.json({ mood });
    } catch (error) {
        console.error('Error in audio emotion detection:', error);
        res.status(500).json({ error: error.message || 'Error detecting emotion from audio.' });
    }
});

// Route for facial expression detection (placeholder)
router.post('/detect-emotion-facial', async (req, res) => {
    const { imageData } = req.body;
    try {
        const mood = await aiService.detectEmotionFromFacialExpression(imageData);
        res.json({ mood });
    } catch (error) {
        console.error('Error in facial expression detection:', error);
        res.status(500).json({ error: error.message || 'Error detecting emotion from facial expression.' });
    }
});

// Route for suggestions based on mood and context (placeholder)
router.post('/suggest', async (req, res) => {
    const { mood, context } = req.body;
    try {
        const suggestions = await aiService.suggestBasedOnMoodAndContext(mood, context);
        res.json({ suggestions });
    } catch (error) {
        console.error('Error getting suggestions:', error);
        res.status(500).json({ error: error.message || 'Error getting suggestions.' });
    }
});

module.exports = router;