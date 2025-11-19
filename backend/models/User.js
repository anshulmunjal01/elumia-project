const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true // For efficient lookup
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    username: {
        type: String,
        required: false, // <--- IMPORTANT: Changed to false
        unique: true,
        sparse: true, // <--- IMPORTANT: Added sparse index to allow multiple null values
        trim: true
    },
    userType: {
        type: String,
        enum: ['patient', 'psychiatrist', 'psychologist', 'therapist', 'other'],
        default: 'patient',
        required: true
    },
    otherUserType: {
        type: String,
        trim: true
    },
    preferredLanguage: {
        type: String,
        default: 'en'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);