// backend/models/JournalEntry.js
const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
    userId: { // Changed from 'user' to 'userId' for consistency with req.user.id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model
        required: true
    },
    content: { // Changed from 'text' to 'content' to match frontend
        type: String,
        required: false, // Make content optional if only drawing
        maxlength: 5000 // Limit journal entry length
    },
    mood: {
        type: String,
        // Aligned enum values with frontend MoodButton options
        enum: ['Happy', 'Calm', 'Sad', 'Anxious', 'Excited', 'Reflective', 'Neutral'],
        default: 'Neutral'
    },
    // Removed 'emoji' field as it's part of the mood name on frontend
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    // Removed 'moodScale' as it's not currently used in frontend
    drawing: { // Added to store base64 image data from canvas
        type: String,
        default: ''
    },
    detectedMoods: [{ // Keep for future AI detection integration
        source: String,
        mood: String,
        confidence: Number
    }],
    // 'createdAt' is already handled by timestamps: true below
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);