const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Your Firebase-aware auth middleware
const ProfessionalProfile = require('../models/ProfessionalProfile');
const User = require('../models/User'); // To get user details if needed

// You'll need an email utility later for sending notifications if necessary
// const nodemailer = require('nodemailer'); // Example: npm install nodemailer

// --- Helper function for sending emails (Placeholder) ---
// In a real app, this would be a more robust service
const sendEmail = async (to, subject, text, html) => {
    console.log(`--- SIMULATING EMAIL SEND ---`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}`);
    console.log(`HTML: ${html}`);
    console.log(`--- END SIMULATED EMAIL ---`);
    // Example with Nodemailer (requires setup in server.js or a config file)
    /*
    let transporter = nodemailer.createTransport({
        service: 'gmail', // or your SMTP host
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
    */
};


// @route   POST /api/professionals/register-profile
// @desc    Register or update a professional's detailed profile (after Firebase/User model registration)
// @access  Private (Professional role required)
router.post('/register-profile', protect, async (req, res) => {
    // req.user contains the MongoDB user document of the authenticated user
    const firebaseUid = req.user.firebaseUid;
    const userId = req.user._id; // MongoDB _id of the User document
    const userEmail = req.user.email; // Email from the User document

    const { name, specialty, otherSpecialty, bio, contactPhone, profilePictureUrl, availability } = req.body;

    // Basic validation
    if (!name || !specialty) {
        return res.status(400).json({ msg: 'Name and specialty are required for professional profile.' });
    }
    if (specialty === 'other' && (!otherSpecialty || otherSpecialty.trim() === '')) {
        return res.status(400).json({ msg: 'Please specify your role when selecting "Other" specialty.' });
    }

    // Ensure the user is a professional type based on their User model's userType
    if (!['psychiatrist', 'psychologist', 'therapist', 'other'].includes(req.user.userType)) {
        return res.status(403).json({ msg: 'Only professionals can register a professional profile.' });
    }

    try {
        let professionalProfile = await ProfessionalProfile.findOne({ firebaseUid });

        if (professionalProfile) {
            // Update existing profile
            professionalProfile.name = name;
            professionalProfile.specialty = specialty;
            professionalProfile.otherSpecialty = specialty === 'other' ? otherSpecialty : undefined;
            professionalProfile.bio = bio || professionalProfile.bio;
            professionalProfile.contactPhone = contactPhone || professionalProfile.contactPhone;
            professionalProfile.profilePictureUrl = profilePictureUrl || professionalProfile.profilePictureUrl;
            // Availability should be managed via a separate endpoint, or merged carefully
            // For now, if availability is sent here, it will overwrite existing.
            if (availability && Array.isArray(availability)) {
                professionalProfile.availability = availability;
            }
            await professionalProfile.save();
            res.json({ msg: 'Professional profile updated successfully', professionalProfile });
        } else {
            // Create new profile
            professionalProfile = new ProfessionalProfile({
                firebaseUid,
                user: userId, // Link to the User document
                name,
                email: userEmail, // Store email for convenience
                specialty,
                otherSpecialty: specialty === 'other' ? otherSpecialty : undefined,
                bio,
                contactPhone,
                profilePictureUrl,
                availability: availability || []
            });
            await professionalProfile.save();
            res.status(201).json({ msg: 'Professional profile registered successfully', professionalProfile });
        }
    } catch (err) {
        console.error('Error registering/updating professional profile:', err.message);
        res.status(500).send('Server Error during professional profile operation');
    }
});

// @route   GET /api/professionals/me
// @desc    Get the authenticated professional's own profile
// @access  Private (Professional role required)
router.get('/me', protect, async (req, res) => {
    const firebaseUid = req.user.firebaseUid;

    // Ensure the user is a professional type
    if (!['psychiatrist', 'psychologist', 'therapist', 'other'].includes(req.user.userType)) {
        return res.status(403).json({ msg: 'Access denied. Only professionals can view this profile.' });
    }

    try {
        const professionalProfile = await ProfessionalProfile.findOne({ firebaseUid }).populate('user', 'email username');
        if (!professionalProfile) {
            return res.status(404).json({ msg: 'Professional profile not found for this user.' });
        }
        res.json(professionalProfile);
    } catch (err) {
        console.error('Error fetching professional profile:', err.message);
        res.status(500).send('Server Error fetching professional profile');
    }
});

// @route   PUT /api/professionals/me/availability
// @desc    Update a professional's availability (add/remove/modify slots)
// @access  Private (Professional role required)
router.put('/me/availability', protect, async (req, res) => {
    const firebaseUid = req.user.firebaseUid;
    const { newAvailability } = req.body; // Expecting an array of availability objects

    if (!Array.isArray(newAvailability)) {
        return res.status(400).json({ msg: 'Invalid availability format. Expected an array.' });
    }

    // Ensure the user is a professional type
    if (!['psychiatrist', 'psychologist', 'therapist', 'other'].includes(req.user.userType)) {
        return res.status(403).json({ msg: 'Access denied. Only professionals can manage availability.' });
    }

    try {
        const professionalProfile = await ProfessionalProfile.findOne({ firebaseUid });
        if (!professionalProfile) {
            return res.status(404).json({ msg: 'Professional profile not found.' });
        }

        // Replace existing availability with the new one
        // In a more complex app, you might merge or update specific slots
        professionalProfile.availability = newAvailability.map(slot => ({
            ...slot,
            date: new Date(slot.date) // Ensure date is stored as Date object
        }));

        await professionalProfile.save();
        res.json({ msg: 'Availability updated successfully', availability: professionalProfile.availability });

    } catch (err) {
        console.error('Error updating professional availability:', err.message);
        res.status(500).send('Server Error updating availability');
    }
});


module.exports = router;