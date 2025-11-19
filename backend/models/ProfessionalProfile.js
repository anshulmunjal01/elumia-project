const mongoose = require('mongoose');

const ProfessionalProfileSchema = new mongoose.Schema({
    // Link to the Firebase User UID (from the main User model)
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true // For efficient lookup
    },
    // Reference to the main User document
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: { // Storing email here for convenience, should match User.email
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    specialty: {
        type: String,
        required: true,
        enum: ['psychiatrist', 'psychologist', 'therapist', 'counselor', 'other'], // 'other' for custom roles
        default: 'therapist'
    },
    otherSpecialty: { // If specialty is 'other'
        type: String,
        trim: true
    },
    bio: {
        type: String,
        maxlength: 1000 // Limit bio length
    },
    contactPhone: {
        type: String,
        trim: true
    },
    // Array of available time slots for booking
    // Each slot will have its own MongoDB _id when saved as a subdocument
    availability: [
        {
            date: { type: Date, required: true }, // Stored as Date object for consistency
            time: { type: String, required: true }, // e.g., "10:00 AM", "14:30"
            isBooked: { type: Boolean, default: false },
            bookedByPatientUid: { type: String } // Firebase UID of the patient who booked
        }
    ],
    profilePictureUrl: { // Optional: URL to a professional's profile picture
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ProfessionalProfile', ProfessionalProfileSchema);