const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Your Firebase-aware auth middleware
const ProfessionalProfile = require('../models/ProfessionalProfile');
const Appointment = require('../models/Appointment');
const User = require('../models/User'); // To get patient/professional details if needed

// You'll need an email utility later for sending notifications
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


// @route   GET /api/professionals
// @desc    Get all registered professional profiles
// @access  Public (or Private, depending on if you want unauthenticated users to see the list)
router.get('/', async (req, res) => {
    try {
        const professionals = await ProfessionalProfile.find().select('-availability.bookedByPatientUid'); // Exclude sensitive info
        res.json(professionals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching professionals');
    }
});

// @route   GET /api/professionals/:firebaseUid/availability
// @desc    Get available slots for a specific professional
// @access  Public (or Private, if only logged-in users can see availability)
router.get('/:firebaseUid/availability', async (req, res) => {
    try {
        const professional = await ProfessionalProfile.findOne({ firebaseUid: req.params.firebaseUid });
        if (!professional) {
            return res.status(404).json({ msg: 'Professional not found' });
        }
        // Filter out sensitive info if needed, or return all availability
        res.json(professional.availability);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching professional availability');
    }
});

// @route   POST /api/appointments/book
// @desc    Patient books an appointment with a professional
// @access  Private (Patient role required)
router.post('/book', protect, async (req, res) => {
    // req.user contains the MongoDB user document of the authenticated user (patient)
    const patientFirebaseUid = req.user.firebaseUid;
    const patientEmail = req.user.email; // Get patient's email from their user profile

    const { professionalFirebaseUid, slotId, date, time, patientNotes } = req.body;

    if (!professionalFirebaseUid || !slotId || !date || !time) {
        return res.status(400).json({ msg: 'Missing required appointment details' });
    }

    try {
        // Find the professional profile
        const professional = await ProfessionalProfile.findOne({ firebaseUid: professionalFirebaseUid });
        if (!professional) {
            return res.status(404).json({ msg: 'Professional not found' });
        }

        // Find the specific slot in the professional's availability
        const slot = professional.availability.id(slotId); // Mongoose subdocument .id() method
        if (!slot) {
            return res.status(404).json({ msg: 'Selected slot not found' });
        }
        if (slot.isBooked) {
            return res.status(400).json({ msg: 'Selected slot is already booked' });
        }

        // Mark the slot as booked
        slot.isBooked = true;
        slot.bookedByPatientUid = patientFirebaseUid;

        // Save the updated professional profile
        await professional.save();

        // Create a new appointment record
        const newAppointment = new Appointment({
            patientFirebaseUid,
            professionalFirebaseUid,
            professionalProfile: professional._id, // Store reference to professional profile
            slotId,
            date: new Date(date), // Ensure date is stored as Date object
            time,
            patientNotes
        });

        await newAppointment.save();

        // --- Send Email Notifications (Placeholder) ---
        // Email to professional
        await sendEmail(
            professional.email,
            'New Appointment Request on Elumia',
            `You have a new appointment request from ${patientEmail} for ${new Date(date).toDateString()} at ${time}. Status: Pending.`,
            `<p>Dear ${professional.name},</p>
            <p>You have a new appointment request on Elumia:</p>
            <ul>
                <li><strong>Patient:</strong> ${patientEmail}</li>
                <li><strong>Date:</strong> ${new Date(date).toDateString()}</li>
                <li><strong>Time:</strong> ${time}</li>
                <li><strong>Status:</strong> Pending</li>
                <li><strong>Patient Notes:</strong> ${patientNotes || 'N/A'}</li>
            </ul>
            <p>Please log in to your Elumia Professional Dashboard to accept or reject this appointment.</p>
            <p>Thank you,<br>Elumia Team</p>`
        );

        // Email to patient
        await sendEmail(
            patientEmail,
            'Your Appointment Request on Elumia',
            `Your appointment request with ${professional.name} for ${new Date(date).toDateString()} at ${time} has been sent. Status: Pending.`,
            `<p>Dear ${patientEmail},</p>
            <p>Your appointment request with ${professional.name} has been sent:</p>
            <ul>
                <li><strong>Professional:</strong> ${professional.name} (${professional.specialty})</li>
                <li><strong>Date:</strong> ${new Date(date).toDateString()}</li>
                <li><strong>Time:</strong> ${time}</li>
                <li><strong>Status:</strong> Pending (awaiting professional's confirmation)</li>
            </ul>
            <p>You will receive another email once the professional confirms your appointment.</p>
            <p>Thank you,<br>Elumia Team</p>`
        );

        res.status(201).json({ msg: 'Appointment booked successfully', appointment: newAppointment });

    } catch (err) {
        console.error('Error booking appointment:', err.message);
        res.status(500).send('Server Error during appointment booking');
    }
});

// @route   GET /api/appointments/me
// @desc    Get appointments for the authenticated user (patient or professional)
// @access  Private
router.get('/me', protect, async (req, res) => {
    const firebaseUid = req.user.firebaseUid;
    const userType = req.user.userType;

    try {
        let appointments;
        if (userType === 'patient' || userType === 'other') {
            // Fetch appointments where current user is the patient
            appointments = await Appointment.find({ patientFirebaseUid: firebaseUid })
                                            .populate('professionalProfile', 'name specialty email'); // Populate professional details
        } else if (['psychiatrist', 'psychologist', 'therapist'].includes(userType)) {
            // Fetch appointments where current user is the professional
            appointments = await Appointment.find({ professionalFirebaseUid: firebaseUid })
                                            .populate('professionalProfile', 'name specialty email'); // Populate professional details
        } else {
            return res.status(403).json({ msg: 'Unauthorized user type for appointments.' });
        }

        res.json(appointments);
    } catch (err) {
        console.error('Error fetching appointments:', err.message);
        res.status(500).send('Server Error fetching appointments');
    }
});

// @route   PUT /api/appointments/:id/status
// @desc    Professional accepts or rejects an appointment
// @access  Private (Professional role required)
router.put('/:id/status', protect, async (req, res) => {
    const { status } = req.body; // 'confirmed' or 'rejected'
    const appointmentId = req.params.id;
    const professionalFirebaseUid = req.user.firebaseUid; // Current professional's UID

    if (!['confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status provided.' });
    }

    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found.' });
        }

        // Ensure the professional trying to update is the one associated with the appointment
        if (appointment.professionalFirebaseUid !== professionalFirebaseUid) {
            return res.status(403).json({ msg: 'Unauthorized to update this appointment.' });
        }

        // Update appointment status
        appointment.status = status;
        await appointment.save();

        // Update professional's availability (mark slot as booked/unbooked)
        const professional = await ProfessionalProfile.findOne({ firebaseUid: professionalFirebaseUid });
        if (professional) {
            const slot = professional.availability.id(appointment.slotId);
            if (slot) {
                slot.isBooked = (status === 'confirmed'); // Mark as booked if confirmed, unbooked if rejected
                slot.bookedByPatientUid = (status === 'confirmed') ? appointment.patientFirebaseUid : undefined;
                await professional.save();
            }
        }

        // Get patient's email for notification
        const patientUser = await User.findOne({ firebaseUid: appointment.patientFirebaseUid });
        if (patientUser) {
            const patientEmail = patientUser.email;
            const professionalName = professional ? professional.name : 'A Professional';

            await sendEmail(
                patientEmail,
                `Your Appointment with ${professionalName} is ${status.toUpperCase()}`,
                `Your appointment for ${new Date(appointment.date).toDateString()} at ${appointment.time} with ${professionalName} has been ${status}.`,
                `<p>Dear ${patientEmail},</p>
                <p>Your appointment for <strong>${new Date(appointment.date).toDateString()} at ${appointment.time}</strong> with <strong>${professionalName}</strong> has been <strong>${status.toUpperCase()}</strong>.</p>
                <p>Thank you,<br>Elumia Team</p>`
            );
        }


        res.json({ msg: `Appointment ${status} successfully`, appointment });

    } catch (err) {
        console.error('Error updating appointment status:', err.message);
        res.status(500).send('Server Error updating appointment status');
    }
});


module.exports = router;