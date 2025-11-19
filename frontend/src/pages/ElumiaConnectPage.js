import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

// Keyframe animations for subtle entry effects
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
`;

const PageContainer = styled.div`
    padding: 40px 20px;
    text-align: center;
    background-color: ${({ theme }) => theme.background};
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    transition: background-color var(--transition-speed);
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        padding: 20px 15px;
    }
`;

const ContentBox = styled.div`
    background: ${({ theme }) => theme.cardBackground};
    padding: 30px;
    border-radius: ${({ theme }) => theme.borderRadiusSoft};
    box-shadow: ${({ theme }) => theme.shadowMedium};
    max-width: 900px;
    width: 100%;
    text-align: left;
    animation: ${fadeIn} 0.8s ease-out forwards;
    transition: background-color var(--transition-speed), box-shadow var(--transition-speed);
    margin-bottom: 30px;

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    color: ${({ theme }) => theme.text};
    margin-bottom: 20px;
    text-align: center;
    font-weight: 700;

    @media (max-width: 768px) {
        font-size: 1.5rem;
        margin-bottom: 15px;
    }
`;

const SectionDescription = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.textLight};
    margin-bottom: 25px;
    text-align: center;
    line-height: 1.5;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        margin-bottom: 20px;
    }
`;

// --- Patient View Styles ---
const ProfessionalsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin-top: 20px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
    }
`;

const ProfessionalCard = styled.div`
    background-color: ${({ theme }) => theme.background};
    padding: 20px;
    border-radius: ${({ theme }) => theme.borderRadiusSoft};
    box-shadow: ${({ theme }) => theme.shadowLight};
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${({ theme }) => theme.shadowMedium};
    }

    .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.primaryAccent};
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 15px;
        overflow: hidden;
    }

    .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    h3 {
        font-size: 1.3rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 5px;
    }

    p {
        font-size: 0.95rem;
        color: ${({ theme }) => theme.textLight};
        margin-bottom: 15px;
        flex-grow: 1;
    }

    .specialty {
        font-weight: 600;
        color: ${({ theme }) => theme.secondaryAccent};
        margin-bottom: 10px;
    }

    button {
        background-image: ${({ theme }) => theme.buttonPrimaryBg};
        color: ${({ theme }) => theme.buttonPrimaryText};
        padding: 10px 20px;
        border: none;
        border-radius: ${({ theme }) => theme.borderRadiusRound};
        cursor: pointer;
        font-weight: 600;
        transition: opacity 0.2s ease, transform 0.2s ease;

        &:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
    }
`;

// --- Professional Dashboard Styles ---
const DashboardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin-top: 20px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 20px;
    }
`;

const DashboardCard = styled.div`
    background-color: ${({ theme }) => theme.background};
    padding: 20px;
    border-radius: ${({ theme }) => theme.borderRadiusSoft};
    box-shadow: ${({ theme }) => theme.shadowLight};
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${({ theme }) => theme.shadowMedium};
    }

    h3 {
        font-size: 1.3rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 10px;
    }

    p {
        font-size: 1rem;
        color: ${({ theme }) => theme.textLight};
        margin-bottom: 15px;
    }

    button {
        background-image: ${({ theme }) => theme.buttonPrimaryBg};
        color: ${({ theme }) => theme.buttonPrimaryText};
        padding: 10px 20px;
        border: none;
        border-radius: ${({ theme }) => theme.borderRadiusRound};
        cursor: pointer;
        font-weight: 600;
        transition: opacity 0.2s ease, transform 0.2s ease;

        &:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
    }
`;

const AppointmentList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
    width: 100%;
`;

const AppointmentItem = styled.div`
    background-color: ${({ theme }) => theme.background};
    padding: 15px;
    border-radius: ${({ theme }) => theme.borderRadiusSoft};
    box-shadow: ${({ theme }) => theme.shadowLight};
    display: flex;
    flex-direction: column;
    gap: 5px;
    text-align: left;

    h4 {
        color: ${({ theme }) => theme.text};
        font-size: 1.1rem;
        margin-bottom: 5px;
    }
    p {
        color: ${({ theme }) => theme.textLight};
        font-size: 0.9rem;
        margin: 0;
    }
    .status {
        font-weight: bold;
        color: ${({ status }) =>
            status === 'pending' ? '#FFA500' :
            status === 'confirmed' ? '#4CAF50' :
            status === 'rejected' ? '#FF6347' :
            'inherit'};
    }
    .actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
`;

const ActionButton = styled.button`
    background-color: ${({ $type, theme }) =>
        $type === 'accept' ? '#4CAF50' :
        $type === 'reject' ? '#FF6347' :
        theme.buttonPrimaryBg};
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadiusRound};
    cursor: pointer;
    font-weight: 600;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.8;
    }
`;

// --- Modal for Booking Appointments ---
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: ${({ theme }) => theme.cardBackground};
    padding: 30px;
    border-radius: ${({ theme }) => theme.borderRadiusSoft};
    box-shadow: ${({ theme }) => theme.shadowStrong};
    width: 90%;
    max-width: 500px;
    animation: ${fadeIn} 0.3s ease-out forwards;
    position: relative;
    text-align: left;

    h3 {
        color: ${({ theme }) => theme.text};
        margin-bottom: 20px;
        text-align: center;
        font-size: 1.8rem;
    }

    .close-button {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: ${({ theme }) => theme.textLight};
        cursor: pointer;
        &:hover {
            color: ${({ theme }) => theme.primaryAccent};
        }
    }

    .slot-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 10px;
        margin-top: 20px;
        max-height: 250px;
        overflow-y: auto;
        padding-right: 10px; /* For scrollbar space */
    }

    .slot-item {
        background-color: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.text};
        padding: 10px 15px;
        border-radius: ${({ theme }) => theme.borderRadiusSoft};
        cursor: pointer;
        text-align: center;
        transition: background-color 0.2s ease, transform 0.1s ease;
        border: 1px solid ${({ theme }) => theme.inputBorder};

        &.selected {
            background-color: ${({ theme }) => theme.primaryAccent};
            color: white;
            border-color: ${({ theme }) => theme.primaryAccent};
        }
        &:hover:not(.selected) {
            background-color: ${({ theme }) => theme.buttonSecondaryBg};
            transform: translateY(-2px);
        }
        &.booked {
            background-color: #e0e0e0;
            color: #888;
            cursor: not-allowed;
            text-decoration: line-through;
            opacity: 0.7;
            border-color: #ccc;
        }
    }

    button.confirm-button {
        display: block;
        width: 100%;
        margin-top: 30px;
        background-image: ${({ theme }) => theme.primaryGradient};
        color: white;
        padding: 12px 20px;
        border-radius: ${({ theme }) => theme.borderRadiusRound};
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        border: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
`;

// --- Login Prompt Container ---
const LoginPromptContainer = styled.div`
    background-color: ${({ theme }) => theme.background};
    padding: 30px;
    border-radius: ${({ theme }) => theme.borderRadiusSoft};
    box-shadow: ${({ theme }) => theme.shadowLight};
    margin-top: 20px;
    text-align: center;
    transition: background-color var(--transition-speed), box-shadow var(--transition-speed);

    h3 {
        font-size: 1.5rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 15px;
    }

    p {
        font-size: 1rem;
        color: ${({ theme }) => theme.textLight};
        margin-bottom: 20px;
    }
`;

const StyledLinkButton = styled(Link)`
    display: inline-block;
    background-image: ${({ theme }) => theme.primaryGradient};
    color: ${({ theme }) => theme.buttonPrimaryText};
    padding: 12px 25px;
    border-radius: ${({ theme }) => theme.borderRadiusRound};
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
    box-shadow: ${({ theme }) => theme.shadowMedium};

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${({ theme }) => theme.shadowStrong};
        opacity: 0.9;
    }
`;

// --- Availability Management Styles (for Professionals) ---
const AvailabilityManager = styled.div`
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid ${({ theme }) => theme.inputBorder};
    text-align: center;

    h3 {
        color: ${({ theme }) => theme.text};
        font-size: 1.5rem;
        margin-bottom: 15px;
    }

    .add-slot-form {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        margin-bottom: 20px;

        input[type="date"], input[type="time"] {
            padding: 10px;
            border: 1px solid ${({ theme }) => theme.inputBorder};
            border-radius: ${({ theme }) => theme.borderRadiusSoft};
            background-color: ${({ theme }) => theme.inputBackground};
            color: ${({ theme }) => theme.text};
            font-size: 1rem;
        }

        button {
            background-color: ${({ theme }) => theme.secondaryAccent};
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: ${({ theme }) => theme.borderRadiusRound};
            cursor: pointer;
            font-weight: 600;
            transition: opacity 0.2s ease;

            &:hover {
                opacity: 0.9;
            }
        }
    }

    .current-slots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
        max-height: 300px;
        overflow-y: auto;
        padding-right: 10px; /* For scrollbar space */
    }

    .current-slot-item {
        background-color: ${({ theme }) => theme.background};
        padding: 10px;
        border-radius: ${({ theme }) => theme.borderRadiusSoft};
        box-shadow: ${({ theme }) => theme.shadowLight};
        color: ${({ theme }) => theme.text};
        font-size: 0.9rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        &.booked {
            background-color: #f0f0f0;
            color: #888;
            text-decoration: line-through;
            opacity: 0.8;
        }

        .remove-slot-button {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: ${({ theme }) => theme.textLight};
            font-size: 1.2rem;
            cursor: pointer;
            &:hover {
                color: #FF6347;
            }
        }
    }
`;


function ElumiaConnectPage({ isAuthenticated, userType, currentUser }) {
    const { theme } = useTheme();
    const [professionals, setProfessionals] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [professionalProfile, setProfessionalProfile] = useState(null); // For professional's own profile
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // State for adding new availability slots (for professionals)
    const [newSlotDate, setNewSlotDate] = useState('');
    const [newSlotTime, setNewSlotTime] = useState('');

    const getAuthHeaders = async () => {
        if (!currentUser) {
            return {};
        }
        try {
            const idToken = await currentUser.getIdToken();
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            };
        } catch (error) {
            console.error("Error getting ID token:", error);
            setError("Authentication error. Please log in again.");
            return {};
        }
    };

    // Fetch data based on user type
    useEffect(() => {
        const fetchData = async () => {
            console.log("ElumiaConnectPage: Fetching data...");
            console.log("isAuthenticated:", isAuthenticated);
            console.log("userType:", userType);
            console.log("currentUser:", currentUser ? currentUser.uid : "None");

            if (!isAuthenticated || !userType || !currentUser) {
                setLoading(false);
                // If not authenticated or userType is missing, show login prompt
                if (!isAuthenticated) {
                    setError("You need to be logged in to access Elumia Connect.");
                } else if (!userType) {
                    setError("Your user role could not be determined. Please try logging in again.");
                }
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const headers = await getAuthHeaders();
                if (!headers.Authorization) {
                    // This means getAuthHeaders failed to get a token
                    setLoading(false);
                    return;
                }

                if (userType === 'patient' || userType === 'other') {
                    // Fetch all professionals for patient view
                    const professionalsRes = await fetch('http://localhost:5000/api/professionals', { headers });
                    if (!professionalsRes.ok) {
                        const errorData = await professionalsRes.json();
                        throw new Error(errorData.msg || 'Failed to fetch professionals');
                    }
                    const professionalsData = await professionalsRes.json();
                    setProfessionals(professionalsData);
                    console.log("Fetched professionals:", professionalsData);

                } else if (['psychiatrist', 'psychologist', 'therapist'].includes(userType)) {
                    // Fetch professional's own profile
                    const professionalProfileRes = await fetch('http://localhost:5000/api/professionals/me', { headers });
                    if (!professionalProfileRes.ok) {
                        const errorData = await professionalProfileRes.json();
                        throw new Error(errorData.msg || 'Failed to fetch professional profile');
                    }
                    const professionalProfileData = await professionalProfileRes.json();
                    setProfessionalProfile(professionalProfileData);
                    console.log("Fetched professional profile:", professionalProfileData);

                    // Fetch appointments for this professional
                    const appointmentsRes = await fetch('http://localhost:5000/api/appointments/me', { headers });
                    if (!appointmentsRes.ok) {
                        const errorData = await appointmentsRes.json();
                        throw new Error(errorData.msg || 'Failed to fetch appointments');
                    }
                    const appointmentsData = await appointmentsRes.json();
                    setAppointments(appointmentsData);
                    console.log("Fetched appointments:", appointmentsData);
                }
            } catch (err) {
                console.error('Error fetching data for ElumiaConnectPage:', err);
                setError(err.message || 'Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, userType, currentUser]); // Re-run when auth state or user type changes

    const handleBookAppointmentClick = async (professional) => {
        // Fetch latest availability for the selected professional before showing modal
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                alert('Authentication required to view availability.');
                return;
            }
            const res = await fetch(`http://localhost:5000/api/professionals/${professional.firebaseUid}/availability`, { headers });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Failed to fetch professional availability');
            }
            const latestAvailability = await res.json();
            setSelectedProfessional({ ...professional, availableSlots: latestAvailability }); // Update with latest slots
            setShowBookingModal(true);
        } catch (err) {
            console.error('Error fetching availability:', err);
            alert(`Could not load professional availability: ${err.message}. Please try again.`);
        }
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setSelectedProfessional(null);
        setSelectedSlot(null);
    };

    const handleSlotSelect = (slot) => {
        if (!slot.isBooked) { // Only allow selection of unbooked slots
            setSelectedSlot(slot);
        }
    };

    const handleConfirmBooking = async () => {
        if (!selectedProfessional || !selectedSlot || !currentUser) {
            alert('Please select a slot and ensure you are logged in.');
            return;
        }
        if (selectedSlot.isBooked) {
            alert('This slot is already booked.');
            return;
        }

        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                alert('Authentication required to book an appointment.');
                return;
            }
            const response = await fetch('http://localhost:5000/api/appointments/book', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    professionalFirebaseUid: selectedProfessional.firebaseUid,
                    slotId: selectedSlot._id, // Use MongoDB _id for the slot
                    date: selectedSlot.date,
                    time: selectedSlot.time,
                    patientNotes: "Initial consultation request." // Example note
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to book appointment.');
            }

            alert(`Appointment booked with ${selectedProfessional.name} on ${new Date(selectedSlot.date).toDateString()} at ${selectedSlot.time}! A confirmation email will be sent.`);
            handleCloseBookingModal();
            // Re-fetch professionals to update availability if needed, or update locally
            // For now, a simple alert and close is sufficient.
        } catch (err) {
            console.error('Error confirming booking:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAppointmentAction = async (appointmentId, action) => {
        if (!currentUser) {
            alert('You must be logged in to perform this action.');
            return;
        }
        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                alert('Authentication required to update appointment status.');
                return;
            }
            const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ status: action === 'accept' ? 'confirmed' : 'rejected' }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || `Failed to ${action} appointment.`);
            }

            alert(`Appointment ${action}d successfully!`);
            // Update the local appointments state
            setAppointments(prevAppointments =>
                prevAppointments.map(app =>
                    app._id === appointmentId ? { ...app, status: action === 'accept' ? 'confirmed' : 'rejected' } : app
                )
            );
            // If the professional's own profile is loaded, also update its availability
            if (professionalProfile) {
                setProfessionalProfile(prevProfile => ({
                    ...prevProfile,
                    availability: prevProfile.availability.map(slot =>
                        slot._id === (appointments.find(a => a._id === appointmentId)?.slotId)
                            ? { ...slot, isBooked: (action === 'accept') } // Mark as booked if accepted
                            : slot
                    )
                }));
            }

        } catch (err) {
            console.error(`Error ${action}ing appointment:`, err);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async () => {
        if (!newSlotDate || !newSlotTime) {
            alert('Please select both date and time for the new slot.');
            return;
        }
        if (!currentUser || !professionalProfile) {
            alert('You must be logged in as a professional to add slots.');
            return;
        }

        const slotDateTime = new Date(`${newSlotDate}T${newSlotTime}`);
        if (isNaN(slotDateTime.getTime())) {
            alert('Invalid date or time format.');
            return;
        }
        if (slotDateTime < new Date()) {
            alert('Cannot add a slot in the past.');
            return;
        }

        const newSlot = {
            date: newSlotDate,
            time: newSlotTime,
            isBooked: false,
        };

        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                alert('Authentication required to add slots.');
                return;
            }
            const updatedAvailability = [...professionalProfile.availability, newSlot];

            const response = await fetch('http://localhost:5000/api/professionals/me/availability', {
                method: 'PUT',
                headers,
                body: JSON.stringify({ newAvailability: updatedAvailability }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to add new slot.');
            }

            const updatedProfile = await response.json();
            setProfessionalProfile(updatedProfile.professionalProfile);
            setNewSlotDate('');
            setNewSlotTime('');
            alert('New slot added successfully!');
        } catch (err) {
            console.error('Error adding slot:', err);
            alert(`Error adding slot: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSlot = async (slotId) => {
        if (!currentUser || !professionalProfile) {
            alert('You must be logged in as a professional to remove slots.');
            return;
        }

        const slotToRemove = professionalProfile.availability.find(slot => slot._id === slotId);
        if (slotToRemove && slotToRemove.isBooked) {
            if (!window.confirm('This slot is booked. Are you sure you want to remove it? This will cancel the associated appointment.')) {
                return;
            }
            // In a real app, you'd also send a cancellation email to the patient and update appointment status
        }

        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            if (!headers.Authorization) {
                alert('Authentication required to remove slots.');
                return;
            }
            const updatedAvailability = professionalProfile.availability.filter(slot => slot._id !== slotId);

            const response = await fetch('http://localhost:5000/api/professionals/me/availability', {
                method: 'PUT',
                headers,
                body: JSON.stringify({ newAvailability: updatedAvailability }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to remove slot.');
            }

            const updatedProfile = await response.json();
            setProfessionalProfile(updatedProfile.professionalProfile);
            alert('Slot removed successfully!');
        } catch (err) {
            console.error('Error removing slot:', err);
            alert(`Error removing slot: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <PageContainer theme={theme}>
                <ContentBox theme={theme}>
                    <SectionTitle theme={theme}>Loading Elumia Connect...</SectionTitle>
                    <p style={{ color: theme.textLight }}>Please wait while we fetch your data.</p>
                </ContentBox>
            </PageContainer>
        );
    }

    // This error state will be triggered if isAuthenticated, userType, or currentUser are missing/invalid
    if (error) {
        return (
            <PageContainer theme={theme}>
                <ContentBox theme={theme}>
                    <SectionTitle theme={theme}>Error</SectionTitle>
                    <p style={{ color: theme.textLight }}>{error}</p>
                    <p style={{ color: theme.textLight }}>Please try again later or ensure you are logged in correctly.</p>
                    <StyledLinkButton to="/auth" theme={theme}>Login / Register</StyledLinkButton>
                </ContentBox>
            </PageContainer>
        );
    }

    return (
        <PageContainer theme={theme}>
            {!isAuthenticated ? (
                <LoginPromptContainer theme={theme}>
                    <SectionTitle theme={theme}>Access Elumia Connect</SectionTitle>
                    <p>
                        Please log in or register to access the Elumia Connect platform, where you can find professionals or manage your professional account.
                    </p>
                    <StyledLinkButton to="/auth" theme={theme}>
                        Login / Register
                    </StyledLinkButton>
                </LoginPromptContainer>
            ) : (
                <ContentBox theme={theme}>
                    {(userType === 'psychiatrist' || userType === 'psychologist' || userType === 'therapist' || userType === 'other') ? (
                        <>
                            <SectionTitle theme={theme}>Professional Dashboard</SectionTitle>
                            <SectionDescription theme={theme}>
                                Welcome, Professional! Manage your appointments, view feedback, and track your patients.
                            </SectionDescription>
                            <DashboardGrid>
                                <DashboardCard theme={theme}>
                                    <h3>My Appointments</h3>
                                    <p>View and manage your upcoming and past appointments.</p>
                                    <AppointmentList>
                                        {appointments.length > 0 ? (
                                            appointments.map(app => (
                                                <AppointmentItem key={app._id} theme={theme} status={app.status}>
                                                    <h4>Appointment with {app.professionalProfile ? app.professionalProfile.name : 'N/A'}</h4>
                                                    <p>Patient: {app.patientFirebaseUid}</p> {/* In a real app, you'd fetch patient name */}
                                                    <p>Date: {new Date(app.date).toDateString()}</p>
                                                    <p>Time: {app.time}</p>
                                                    <p>Status: <span className="status">{app.status.toUpperCase()}</span></p>
                                                    <p>Notes: {app.patientNotes || 'No patient notes.'}</p>
                                                    {app.status === 'pending' && (
                                                        <div className="actions">
                                                            <ActionButton $type="accept" onClick={() => handleAppointmentAction(app._id, 'accept')}>Accept</ActionButton>
                                                            <ActionButton $type="reject" onClick={() => handleAppointmentAction(app._id, 'reject')}>Reject</ActionButton>
                                                        </div>
                                                    )}
                                                </AppointmentItem>
                                            ))
                                        ) : (
                                            <p style={{ color: theme.textLight }}>No appointments yet.</p>
                                        )}
                                    </AppointmentList>
                                </DashboardCard>
                                <DashboardCard theme={theme}>
                                    <h3>Manage Schedule</h3>
                                    <p>Set your availability and block out time slots.</p>
                                    <AvailabilityManager theme={theme}>
                                        <h3>Add New Slot</h3>
                                        <div className="add-slot-form">
                                            <input
                                                type="date"
                                                value={newSlotDate}
                                                onChange={(e) => setNewSlotDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                            />
                                            <input
                                                type="time"
                                                value={newSlotTime}
                                                onChange={(e) => setNewSlotTime(e.target.value)}
                                            />
                                            <button onClick={handleAddSlot}>Add Slot</button>
                                        </div>

                                        <h3>Current Availability</h3>
                                        <div className="current-slots-grid">
                                            {professionalProfile && professionalProfile.availability.length > 0 ? (
                                                professionalProfile.availability
                                                    .sort((a, b) => new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time))
                                                    .map(slot => (
                                                        <div key={slot._id} className={`current-slot-item ${slot.isBooked ? 'booked' : ''}`} theme={theme}>
                                                            <button className="remove-slot-button" onClick={() => handleRemoveSlot(slot._id)}>&times;</button>
                                                            {new Date(slot.date).toLocaleDateString()} <br /> {slot.time}
                                                            {slot.isBooked && <p style={{ margin: '5px 0 0', fontSize: '0.8em', color: theme.primaryAccent }}>Booked</p>}
                                                        </div>
                                                    ))
                                            ) : (
                                                <p style={{ color: theme.textLight, width: '100%' }}>No availability set yet.</p>
                                            )}
                                        </div>
                                    </AvailabilityManager>
                                </DashboardCard>
                                {/* Additional Professional Cards (Patient List, Feedback) - placeholders */}
                                <DashboardCard theme={theme}>
                                    <h3>Patient List</h3>
                                    <p>View details of your patients.</p>
                                    <button onClick={() => alert('View Patient List functionality (to be implemented)')}>View Patients</button>
                                </DashboardCard>
                                <DashboardCard theme={theme}>
                                    <h3>Feedback & Reviews</h3>
                                    <p>See what your patients are saying.</p>
                                    <button onClick={() => alert('View Feedback functionality (to be implemented)')}>View Feedback</button>
                                </DashboardCard>
                            </DashboardGrid>
                            <p style={{ fontSize: '0.9rem', color: theme.textLight, marginTop: '20px' }}>
                                *Note: Professional dashboard functionalities are placeholders. Full implementation requires dedicated backend APIs and database integration.
                            </p>
                        </>
                    ) : ( // User is a 'patient' type
                        <>
                            <SectionTitle theme={theme}>Find Elumia Professionals</SectionTitle>
                            <SectionDescription theme={theme}>
                                You're logged in! Explore our curated list of mental health professionals available for appointments directly through Elumia.
                            </SectionDescription>
                            {professionals.length > 0 ? (
                                <ProfessionalsGrid>
                                    {professionals.map((professional) => (
                                        <ProfessionalCard key={professional._id} theme={theme}>
                                            <div className="avatar">
                                                {professional.profilePictureUrl ? (
                                                    <img src={professional.profilePictureUrl} alt={professional.name} onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/${theme.primaryAccent.substring(1)}/FFFFFF?text=${professional.name.split(' ').map(n => n[0]).join('')}`; }} />
                                                ) : (
                                                    professional.name.split(' ').map(n => n[0]).join('')
                                                )}
                                            </div>
                                            <h3>{professional.name}</h3>
                                            <p className="specialty">{professional.specialty === 'other' ? professional.otherSpecialty : professional.specialty.charAt(0).toUpperCase() + professional.specialty.slice(1)}</p>
                                            <p>{professional.bio || 'No bio provided.'}</p>
                                            <button onClick={() => handleBookAppointmentClick(professional)}>
                                                Book Appointment
                                            </button>
                                        </ProfessionalCard>
                                    ))}
                                </ProfessionalsGrid>
                            ) : (
                                <p style={{ fontSize: '1rem', color: theme.textLight, marginTop: '20px', textAlign: 'center' }}>
                                    No professionals have registered with Elumia yet. Please check back later!
                                </p>
                            )}
                            <p style={{ fontSize: '0.9rem', color: theme.textLight, marginTop: '20px' }}>
                                *Note: Appointment booking functionality is a placeholder. A full implementation would require a backend system for scheduling, professional profiles, and secure communication.
                            </p>
                        </>
                    )}
                </ContentBox>
            )}

            {showBookingModal && selectedProfessional && (
                <ModalOverlay>
                    <ModalContent theme={theme}>
                        <button className="close-button" onClick={handleCloseBookingModal}>&times;</button>
                        <h3>Book Appointment with {selectedProfessional.name}</h3>
                        <p style={{ color: theme.textLight, textAlign: 'center' }}>Select an available slot:</p>
                        <div className="slot-grid">
                            {selectedProfessional.availableSlots && selectedProfessional.availableSlots.length > 0 ? (
                                selectedProfessional.availableSlots
                                    .filter(slot => new Date(slot.date) >= new Date()) // Only show future slots
                                    .sort((a, b) => new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time)) // Sort by date then time
                                    .map(slot => (
                                        <div
                                            key={slot._id}
                                            className={`slot-item ${selectedSlot && selectedSlot._id === slot._id ? 'selected' : ''} ${slot.isBooked ? 'booked' : ''}`}
                                            onClick={() => handleSlotSelect(slot)}
                                        >
                                            {new Date(slot.date).toLocaleDateString()} <br /> {slot.time}
                                        </div>
                                    ))
                            ) : (
                                <p style={{ color: theme.textLight, width: '100%', textAlign: 'center' }}>No available slots.</p>
                            )}
                        </div>
                        <button
                            className="confirm-button"
                            onClick={handleConfirmBooking}
                            disabled={!selectedSlot || selectedSlot.isBooked}
                        >
                            Confirm Booking
                        </button>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageContainer>
    );
}

export default ElumiaConnectPage;