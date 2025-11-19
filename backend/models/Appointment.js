const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    // Patient's Firebase UID
    patientFirebaseUid: {
        type: String,
        required: true,
        index: true
    },
    // Professional's Firebase UID
    professionalFirebaseUid: {
        type: String,
        required: true,
        index: true
    },
    // Reference to the ProfessionalProfile document
    professionalProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProfessionalProfile',
        required: true
    },
    // Reference to the specific slot in the professional's availability
    // This will be the MongoDB _id of the subdocument in ProfessionalProfile.availability
    slotId: {
        type: mongoose.Schema.Types.ObjectId, // Now using ObjectId to reference the subdocument
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    patientNotes: { // Notes from the patient during booking
        type: String,
        maxlength: 500
    },
    professionalNotes: { // Notes added by the professional after/during session
        type: String,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);