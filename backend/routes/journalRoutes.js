// backend/routes/journalRoutes.js
const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry'); // Import your JournalEntry model
const authMiddleware = require('../middleware/authMiddleware'); // Assuming this path is correct for your auth middleware

// --- Journal Entry Endpoints ---

// @route   GET /api/journal
// @desc    Get all journal entries for the authenticated user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Find entries for the authenticated user, sorted by most recent date
        const entries = await JournalEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/journal
// @desc    Create a new journal entry
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    // Destructure content, mood, tags, and drawing from the request body
    const { content, mood, tags, drawing } = req.body;

    // Basic validation: ensure either content or a drawing is provided
    if (!content && !drawing) {
        return res.status(400).json({ msg: 'Journal entry must have content or a drawing.' });
    }

    try {
        const newEntry = new JournalEntry({
            userId: req.user.id, // Get user ID from authentication middleware
            content,
            mood,
            tags,
            drawing
            // detectedMoods can be added by a separate AI processing step later
        });

        const entry = await newEntry.save();
        res.status(201).json(entry); // Respond with the created entry and 201 status
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/journal/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
    const { content, mood, tags, drawing } = req.body; // Get updated fields from body

    try {
        let entry = await JournalEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ msg: 'Journal entry not found' });
        }

        // Ensure the authenticated user owns this journal entry
        if (entry.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to update this entry' });
        }

        // Update fields
        entry.content = content; // Allow content to be updated/cleared
        entry.mood = mood;
        entry.tags = tags;
        entry.drawing = drawing; // Allow drawing to be updated/cleared

        await entry.save(); // Save the updated entry
        res.json(entry); // Respond with the updated entry
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/journal/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        let entry = await JournalEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ msg: 'Journal entry not found' });
        }

        // Ensure the authenticated user owns this journal entry
        if (entry.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this entry' });
        }

        await JournalEntry.deleteOne({ _id: req.params.id }); // Delete the entry
        res.json({ msg: 'Journal entry removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;