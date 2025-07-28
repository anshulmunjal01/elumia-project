// frontend/src/pages/HomePage.js
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa'; // Only FaChevronRight is used, others removed

// --- Animations ---
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
    from { opacity: 0; transform: translateX(-50px); }
    to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
`;

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
`;

// --- Styled Components ---

const HomePageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 80px; /* Space between sections */
    padding: 60px 20px; /* Overall padding */
    width: 100%;
    max-width: 1200px; /* Max width for content */
    margin: 0 auto; /* Center content */
    position: relative; /* For floating elements */
    /* Removed overflow: hidden here. Rely on MainContent in App.js for scrolling. */

    @media (max-width: 768px) {
        gap: 60px;
        padding: 40px 15px;
    }
`;

const FloatingElement = styled.span`
    position: absolute;
    font-size: ${({ size }) => size || '2rem'};
    opacity: ${({ opacity }) => opacity || 0.3};
    color: ${({ theme }) => theme.primaryColor};
    animation: ${float} ${({ duration }) => duration || '5s'} ease-in-out infinite;
    z-index: 0;
    pointer-events: none; /* Allow clicks to pass through */
    top: ${({ top }) => top};
    left: ${({ left }) => left};
    right: ${({ right }) => right};
    bottom: ${({ bottom }) => bottom};
    animation-delay: ${({ delay }) => delay || '0s'};
`;

const HeroSection = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    max-width: 800px;
    animation: ${fadeIn} 1s ease-out; /* Added animation */
`;

const Tagline = styled.p`
    font-size: 1.1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.textLight};
    margin-bottom: 10px;
`;

const MainTitle = styled.h1`
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.1;
    color: ${({ theme }) => theme.text}; /* Default text color for "Welcome to" */

    img {
        height: 80px; /* Adjust height as needed for your logo */
        vertical-align: middle;
        margin-right: 10px;
        animation: ${pulse} 2s infinite ease-in-out; /* Pulse animation for logo */
    }

    span {
        color: #007bff; /* Changed Elumia text color to blue */
        /* Removed gradient specific properties */
    }

    @media (max-width: 768px) {
        font-size: 2.5rem;
        img {
            height: 60px;
        }
    }
    @media (max-width: 480px) {
        font-size: 2rem;
        img {
            height: 50px;
        }
    }
`;

const Subtitle = styled.p`
    font-size: 1.25rem;
    color: ${({ theme }) => theme.textLight};
    line-height: 1.5;
    margin-bottom: 30px;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 20px;
    margin-top: 20px;

    @media (max-width: 600px) {
        flex-direction: column;
        width: 80%;
    }
`;

const PrimaryButton = styled(Link)`
    display: inline-block;
    padding: 16px 30px;
    border-radius: var(--border-radius-round);
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    color: ${({ theme }) => theme.buttonPrimaryText};
    background: ${({ theme }) => theme.buttonPrimaryBg};
    box-shadow: ${({ theme }) => theme.shadowMedium};
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    }
`;

const SecondaryButton = styled(Link)`
    display: inline-block;
    padding: 16px 30px;
    border-radius: var(--border-radius-round);
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    color: ${({ theme }) => theme.buttonSecondaryText};
    background: ${({ theme }) => theme.buttonSecondaryBg};
    border: 2px solid ${({ theme }) => theme.buttonSecondaryBorder};
    transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

    &:hover {
        background: ${({ theme }) => theme.secondaryGradient};
        transform: translateY(-3px);
        border-color: transparent;
    }
`;

const MoodSelectionSection = styled.section`
    width: 100%;
    max-width: 900px;
    background: ${({ theme }) => theme.cardBackground};
    padding: 40px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    text-align: center;
    animation: ${fadeIn} 1s ease-out 0.2s forwards; /* Added animation */
    opacity: 0; /* Start hidden for animation */

    h2 {
        font-size: 2rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 30px;
    }

    p {
        font-size: 1.1rem;
        color: ${({ theme }) => theme.textLight};
        margin-bottom: 40px;
    }

    @media (max-width: 768px) {
        padding: 30px 20px;
        h2 { font-size: 1.7rem; }
        p { font-size: 1rem; }
    }
`;

const MoodGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 20px;
    margin-bottom: 40px;

    @media (max-width: 600px) {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 15px;
    }
`;

const MoodButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    border-radius: var(--border-radius-soft);
    background-color: ${({ $moodColor }) => $moodColor};
    border: 2px solid ${({ $selected, $selectedBorderColor }) => ($selected ? $selectedBorderColor : 'transparent')};
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    font-size: 0.95rem;
    color: ${({ theme }) => theme.text};
    font-weight: 500;
    animation: ${slideInLeft} 0.5s ease-out forwards; /* Added animation */
    opacity: 0; /* Start hidden for animation */
    animation-delay: ${({ $delay }) => $delay};

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }

    span { /* Emoji */
        font-size: 2.5rem;
        margin-bottom: 8px;
    }

    @media (max-width: 600px) {
        padding: 10px;
        span { font-size: 2rem; }
    }
`;

const SelectedMoodDisplay = styled.p`
    font-size: 1.2rem;
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    margin-top: 20px;
`;

const FeaturesGridSection = styled.section`
    width: 100%;
    max-width: 1000px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 30px;
    padding: 40px 0;
    animation: ${fadeIn} 1s ease-out 0.4s forwards; /* Added animation */
    opacity: 0; /* Start hidden for animation */

    h2 {
        grid-column: 1 / -1;
        text-align: center;
        font-size: 2.2rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 20px;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        h2 { font-size: 1.8rem; }
    }
`;

const FeatureCard = styled.div`
    background: ${({ theme }) => theme.cardBackground};
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    padding: 30px;
    text-align: left;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s;
    display: flex;
    flex-direction: column;
    gap: 15px;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
    }

    span.icon {
        font-size: 3rem;
        background: ${({ theme }) => theme.primaryGradient};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        margin-bottom: 10px;
        display: inline-block;
    }

    h3 {
        font-size: 1.5rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 10px;
    }
    p {
        font-size: 1rem;
        color: ${({ theme }) => theme.textLight};
        line-height: 1.5;
        flex-grow: 1;
    }
    a { /* Read More / Arrow button */
        display: flex;
        align-items: center;
        gap: 5px;
        color: ${({ theme }) => theme.buttonSecondaryText};
        font-weight: 600;
        text-decoration: none;
        margin-top: 15px;
        transition: transform 0.2s ease;

        &:hover {
            transform: translateX(5px);
        }
    }

    @media (max-width: 768px) {
        padding: 25px;
    }
`;

const WellnessButton = styled(Link)`
    padding: 15px 35px;
    border-radius: var(--border-radius-round);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    background-color: white;
    color: ${({ theme }) => theme.buttonSecondaryText};
    border: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-decoration: none;
    display: inline-block;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }
`;


const WellnessJourneySection = styled.section`
    width: 100%;
    max-width: 900px;
    background: ${({ theme }) => theme.primaryGradient};
    padding: 50px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 25px;
    animation: ${fadeIn} 1s ease-out 0.6s forwards; /* Added animation */
    opacity: 0; /* Start hidden for animation */

    span.icon {
        font-size: 4rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 15px;
    }

    h2 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 15px;
        color: ${({ theme }) => theme.text};

        @media (max-width: 768px) {
            font-size: 2rem;
        }
    }

    p {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 20px;
        max-width: 600px;
        color: ${({ theme }) => theme.text};
    }

    @media (max-width: 768px) {
        padding: 40px 20px;
    }
`;

// Modal for Mood Selection
const MoodModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: ${fadeIn} 0.3s ease-out;
`;

const MoodModalContent = styled.div`
    background: ${({ theme }) => theme.cardBackground};
    padding: 40px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    text-align: center;
    max-width: 500px;
    width: 90%;
    animation: ${pulse} 0.5s ease-out;

    h3 {
        font-size: 1.8rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 20px;
    }

    p {
        font-size: 1.1rem;
        color: ${({ theme }) => theme.textLight};
        margin-bottom: 30px;
    }

    div {
        display: flex;
        gap: 15px;
        justify-content: center;
    }

    button {
        padding: 12px 25px;
        border-radius: var(--border-radius-round);
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: transform 0.2s ease;

        &:first-child {
            background: ${({ theme }) => theme.primaryGradient};
            color: white;
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
        }
        &:last-child {
            background: ${({ theme }) => theme.buttonSecondaryBg};
            color: ${({ theme }) => theme.buttonSecondaryText};
            border: 2px solid ${({ theme }) => theme.buttonSecondaryBorder};
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
        }
    }
`;


function HomePage() {
    const { theme } = useTheme();
    const [selectedMood, setSelectedMood] = useState(null);
    const [showMoodModal, setShowMoodModal] = useState(false);

    const moodOptions = [
        { name: 'Happy', emoji: '😊', color: theme.moodHappy },
        { name: 'Calm', emoji: '😌', color: theme.moodCalm },
        { name: 'Sad', emoji: '😔', color: theme.moodSad },
        { name: 'Anxious', emoji: '😟', color: theme.moodAnxious },
        { name: 'Excited', emoji: '🤩', color: theme.moodExcited },
        { name: 'Reflective', emoji: '🤔', color: theme.moodReflective },
    ];

    const handleMoodSelect = (moodName) => {
        setSelectedMood(moodName);
        setShowMoodModal(true); // Show modal on mood selection
    };

    const handleModalAction = (action) => {
        setShowMoodModal(false);
        if (action === 'chat') {
            // Logic to navigate to AI chat, potentially passing mood as state/query param
            // navigate(`/ai?mood=${selectedMood.toLowerCase()}`); // If using useNavigate
            window.location.href = `/ai?mood=${selectedMood.toLowerCase()}`; // Simple redirect
        } else if (action === 'journal') {
            // Logic to navigate to Journal page
            // navigate('/journal');
            window.location.href = '/journal'; // Simple redirect
        }
    };

    return (
        <HomePageWrapper>
            {/* Floating background elements */}
            <FloatingElement theme={theme} size="3rem" opacity="0.1" top="10%" left="5%" duration="6s">✨</FloatingElement>
            <FloatingElement theme={theme} size="2.5rem" opacity="0.08" top="30%" right="15%" duration="7s" delay="1s">💭</FloatingElement>
            <FloatingElement theme={theme} size="3.5rem" opacity="0.12" bottom="20%" left="10%" duration="5s" delay="0.5s">💖</FloatingElement>
            <FloatingElement theme={theme} size="2rem" opacity="0.07" top="50%" left="2%" duration="8s" delay="2s">🌿</FloatingElement>
            <FloatingElement theme={theme} size="4rem" opacity="0.15" bottom="5%" right="5%" duration="6.5s" delay="1.5s">🌟</FloatingElement>
            <FloatingElement theme={theme} size="2.8rem" opacity="0.09" top="25%" left="40%" duration="7.5s" delay="0.8s">💡</FloatingElement>
            <FloatingElement theme={theme} size="3.2rem" opacity="0.11" bottom="15%" left="45%" duration="6s" delay="0.3s">🎶</FloatingElement>


            <HeroSection>
                <Tagline>Your AI Companion for Mind, Mood & Meaning</Tagline>
                <MainTitle theme={theme}>
                    <img src="/images/elumialogo.png" alt="Elumia Logo" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/8A2BE2/FFFFFF?text=EL'; }} /> {/* Updated logo path */}
                    Welcome to <span>Elumia</span>
                </MainTitle>
                <Subtitle>
                    Discover a safe space where you can be yourself. Elumia is your empathetic AI friend, therapist, motivator,
                    and mood journal, all designed to support your well-being.
                </Subtitle>
                <ButtonGroup>
                    <PrimaryButton to="/ai">Start Chatting</PrimaryButton>
                    <SecondaryButton to="/journal">Begin Journaling</SecondaryButton>
                </ButtonGroup>
            </HeroSection>

            <MoodSelectionSection theme={theme}>
                <h2>How are you feeling today?</h2>
                <p>Select your current mood to get personalized support and insights.</p>
                <MoodGrid>
                    {moodOptions.map((mood, index) => (
                        <MoodButton
                            key={mood.name}
                            $moodColor={mood.color}
                            $selected={selectedMood === mood.name}
                            $selectedBorderColor={theme.moodSelectedBorder}
                            onClick={() => handleMoodSelect(mood.name)}
                            $delay={`${index * 0.1}s`} /* Staggered animation */
                        >
                            <span>{mood.emoji}</span>
                            {mood.name}
                        </MoodButton>
                    ))}
                </MoodGrid>
                {selectedMood && (
                    <SelectedMoodDisplay theme={theme}>
                        You're feeling **{selectedMood}** today {moodOptions.find(m => m.name === selectedMood)?.emoji} Your AI companion is ready to chat about it!
                    </SelectedMoodDisplay>
                )}
            </MoodSelectionSection>

            <FeaturesGridSection>
                <h2>Features Designed for Your Peace</h2>
                <FeatureCard theme={theme}>
                    <span className="icon">💬</span>
                    <h3>Intelligent AI Companion</h3>
                    <p>Chat with an AI that understands your emotions, offers human-like advice, and helps you navigate life's challenges.</p>
                    <Link to="/ai">Learn More <FaChevronRight /></Link>
                </FeatureCard>
                <FeatureCard theme={theme}>
                    <span className="icon">📔</span>
                    <h3>Intuitive Mood Journal</h3>
                    <p>Track your feelings effortlessly, see daily patterns, and gain insights into your emotional well-being.</p>
                    <Link to="/journal">Learn More <FaChevronRight /></Link>
                </FeatureCard>
                <FeatureCard theme={theme}>
                    <span className="icon">🧘‍♀️</span>
                    <h3>Uplifting Wellness Tools</h3>
                    <p>Access guided meditations, breathing exercises, affirmations, and personalized content to brighten your day.</p>
                    <Link to="/upliftment">Learn More <FaChevronRight /></Link>
                </FeatureCard>
                <FeatureCard theme={theme}>
                    <span className="icon">❤️‍🩹</span>
                    <h3>Mental Health Support</h3>
                    <p>Connect with professional therapists (optional) and find resources for understanding various mental health aspects.</p>
                    <Link to="/support">Learn More <FaChevronRight /></Link>
                </FeatureCard>
            </FeaturesGridSection>

            <WellnessJourneySection theme={theme}>
                <span className="icon">🌟</span>
                <h2>Ready to start your wellness journey?</h2>
                <p>Take the first step towards a healthier, happier you. Elumia is here to guide and support you every step of the way.</p>
                <WellnessButton to="/wellness">Begin Your Journey</WellnessButton>
            </WellnessJourneySection>

            {showMoodModal && (
                <MoodModalOverlay>
                    <MoodModalContent theme={theme}>
                        <h3>You selected: {selectedMood} {moodOptions.find(m => m.name === selectedMood)?.emoji}</h3>
                        <p>Would you like to chat with Elumia's AI about this, or jot it down in your journal?</p>
                        <div>
                            <button onClick={() => handleModalAction('chat')}>Chat with AI</button>
                            <button onClick={() => handleModalAction('journal')}>Go to Journal</button>
                        </div>
                    </MoodModalContent>
                </MoodModalOverlay>
            )}
        </HomePageWrapper>
    );
}

export default HomePage;