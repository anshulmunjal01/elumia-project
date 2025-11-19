import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme hook

// Custom CSS and animations injected directly
const CustomStylesAndAnimations = () => (
    <style>
        {`
        /* Global styles from GlobalStyle.js principles */
        html, body, #root {
            height: 100%;
            margin: 0;
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow: hidden; /* Prevent body scroll, main-container will scroll */
        }

        /* Keyframe Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-400 { animation-delay: 0.4s; }
        .animate-delay-500 { animation-delay: 0.5s; }
        .animate-delay-600 { animation-delay: 0.6s; }
        .animate-delay-700 { animation-delay: 0.7s; }
        .animate-delay-800 { animation-delay: 0.8s; }
        .animate-delay-900 { animation-delay: 0.9s; }
        .animate-delay-1000 { animation-delay: 1s; }
        .animate-delay-1100 { animation-delay: 1.1s; }
        .animate-delay-1200 { animation-delay: 1.2s; }

        @keyframes pulse-slow {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }
        .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        .button-shimmer:hover {
            background-size: 200% 100%;
            background-image: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
            animation: shimmer 1s infinite linear;
        }

        /* Sidebar specific styles */
        .sidebar {
            width: 250px; /* Fixed width for sidebar */
            flex-shrink: 0;
            background-color: #f8f8f8; /* Light background for sidebar */
            padding: 2rem 1rem;
            box-shadow: 2px 0 5px rgba(0,0,0,0.05);
            overflow-y: auto; /* Allow sidebar to scroll if content is long */
            position: sticky; /* Make sidebar sticky */
            top: 0; /* Stick to the top */
            height: 100vh; /* Full viewport height */
            z-index: 20; /* Higher z-index than main content background */
            display: flex;
            flex-direction: column;
            gap: 1rem;
            border-right: 1px solid #e0e0e0;
        }
        .sidebar-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            border-radius: 9999px; /* Fully rounded */
            background-color: transparent;
            color: #333;
            font-weight: 500;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            border: none;
            text-align: left;
            width: 100%;
            box-sizing: border-box;
        }
        .sidebar-item:hover {
            background-color: #e0e0e0;
            color: #000;
            transform: translateX(5px);
        }
        .sidebar-item.active {
            background-color: #e0e0e0; /* Active background */
            color: #000; /* Active text color */
            font-weight: 700;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        /* Main content area */
        .main-content-area {
            flex-grow: 1;
            padding: 40px;
            max-width: calc(100% - 250px); /* Adjust max-width for sidebar */
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-y: auto; /* Main content area scrolls */
            overflow-x: hidden;
            position: relative;
            z-index: 10;
        }

        /* Content Grids - These will scroll */
        /* Changed to flex column to stack sections horizontally */
        .content-grid {
            width: 100%;
            max-width: 1200px;
            display: flex; /* Changed from grid */
            flex-direction: column; /* Stack sections vertically */
            gap: 2rem;
            position: relative;
            z-index: 10;
        }

        /* Styles for the inner grid of items within each section */
        .content-items-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Responsive grid for items */
            gap: 1.5rem; /* Gap between individual content cards */
            width: 100%;
        }

        /* Adjust content-card to fit well within the inner grid */
        .content-card {
            display: flex;
            flex-direction: column; /* Keep content inside card vertical */
            gap: 0.5rem;
            padding: 1rem;
            border-radius: 0.5rem; /* Using a fixed value for consistency in CSS */
            box-shadow: 0 4px 8px rgba(0,0,0,0.05); /* Using a fixed value for consistency in CSS */
            background-color: #ffffff; /* Using a fixed value for consistency in CSS */
            color: #333; /* Default text color */
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            transform: none;
            outline: 1px solid transparent;
            height: 100%; /* Ensure cards fill their grid cell height */
        }
        .content-card:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1); /* Using a fixed value for consistency in CSS */
        }

        /* Ensure images within content cards have consistent sizing */
        .content-card img {
            width: 100%;
            height: 120px; /* Increased height for better visual */
            object-fit: cover;
            border-radius: 0.375rem;
            margin-bottom: 0.5rem;
        }

        /* Adjust image gallery grid for consistency */
        .image-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* More images per row */
            gap: 1rem;
            width: 100%;
        }
        .image-gallery-img {
            width: 100%;
            height: 120px; /* Consistent height with other cards */
            object-fit: cover;
            border-radius: 0.5rem; /* Consistent border radius */
        }

        /* Responsive adjustments using direct CSS media queries */
        @media (max-width: 1024px) {
            .sidebar {
                width: 100%; /* Full width sidebar on smaller screens */
                height: auto; /* Auto height */
                position: relative; /* Not sticky */
                border-right: none;
                border-bottom: 1px solid #e0e0e0;
                flex-direction: row; /* Horizontal layout for sidebar items */
                flex-wrap: wrap;
                justify-content: center;
                gap: 0.75rem;
                padding: 1rem;
            }
            .sidebar-item {
                padding: 0.5rem 0.8rem;
                font-size: 0.9rem;
                flex-grow: 1; /* Allow items to grow */
                justify-content: center; /* Center text/icon */
            }
            .sidebar-item svg {
                display: none; /* Hide icons on small screen sidebar */
            }
            .main-content-area {
                max-width: 100%; /* Full width for main content */
                padding: 1rem;
            }
            .hero-title { font-size: 2.5rem !important; }
            .hero-subtitle { font-size: 1rem !important; }
            .mood-section-padding { padding: 1rem !important; }
            .mood-button { min-width: 90px !important; padding: 0.6rem !important; }
            .mood-button-emoji { font-size: 2.2rem !important; }
            .mood-button-text { font-size: 0.75rem !important; }
            .content-grid {
                /* No change needed here, it's already flex-column */
                gap: 1rem; /* Adjust gap for smaller screens */
            }
            .content-section-title { font-size: 1.5rem !important; }
            .content-card h3 { font-size: 1rem !important; }
            .content-card p { font-size: 0.75rem !important; }
            .content-card button { font-size: 0.75rem !important; }
            .image-gallery-grid {
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important; /* Smaller images on mobile */
                gap: 0.5rem !important;
            }
            .image-gallery-img {
                height: 80px !important;
            }
            .lg-col-span-3 { grid-column: auto !important; } /* Reset for smaller screens */
            .message-section { padding: 1.5rem !important; }
            .message-section h2 { font-size: 1.75rem !important; }
            .message-section p { font-size: 0.9rem !important; }
            .message-card { height: 180px !important; }
            .message-card-text { font-size: 2rem !important; }
            .message-card-back-text { font-size: 0.9rem !important; }
            .serendipity-button { padding: 0.8rem 1.8rem !important; font-size: 1rem !important; }
            .serendipity-button svg { width: 24px !important; height: 24px !important; }
            .modal-content { padding: 1rem !important; width: 95% !important; }
            .modal-content h3 { font-size: 1.25rem !important; }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
            /* No change needed for content-grid here, as it's flex-column now */
            .content-items-grid {
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* Adjust for tablet */
            }
        }
        /* No specific rule needed for min-width 1025px as it's the default now */
        @media (min-width: 1025px) {
            .image-gallery-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }

        /* Moved pseudo-class styles from inline to CSS */
        .mood-button:hover {
            transform: translateY(-4px);
            box-shadow: var(--theme-shadow-medium); /* Use CSS variable for theme shadow */
        }
        .sidebar-item:hover {
            background-color: var(--theme-sidebar-item-hover-bg); /* Use CSS variable */
            color: var(--theme-sidebar-item-hover-text); /* Use CSS variable */
            transform: translateX(5px);
        }
        .sidebar-item:active {
            background-color: var(--theme-sidebar-item-active-bg); /* Use CSS variable */
            color: var(--theme-sidebar-item-active-text); /* Use CSS variable */
        }
        .content-card:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1); /* Using a fixed value for consistency in CSS */
        }
        .content-card-button:hover { /* Corrected class name */
            transform: translateX(4px);
        }
        .serendipity-button:hover {
            transform: translateY(-8px);
            box-shadow: var(--theme-shadow-strong); /* Use CSS variable */
            opacity: 0.9;
        }
        .message-card.front:hover { /* Added a class to distinguish front of message card */
            transform: translateY(-4px);
            box-shadow: var(--theme-shadow-medium); /* Use CSS variable */
        }
        .message-card.back:hover { /* Added a class to distinguish back of message card */
            transform: translateY(-4px);
            box-shadow: var(--theme-shadow-medium); /* Use CSS variable */
        }
        .modal-content .close-button:hover { /* Specific class for close button */
            color: var(--theme-text); /* Use CSS variable */
        }
        .modal-content .open-new-tab-button:hover { /* Specific class for open in new tab button */
            opacity: 0.9;
        }
        .modal-content .back-button:hover { /* Specific class for back button */
            box-shadow: var(--theme-shadow-light); /* Use CSS variable */
            opacity: 0.9;
        }
        `}
    </style>
);

// Inline SVG Icons (unchanged)
const PlayCircleIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="10 8 16 12 10 16 10 8"></polygon>
    </svg>
);

const BookOpenIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

const PaletteIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5"></circle>
        <circle cx="17.5" cy="10.5" r=".5"></circle>
        <circle cx="8.5" cy="7.5" r=".5"></circle>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.83 0 1.64-.13 2.4-.35C14.2 21.5 15 22 16 22c2.2 0 4-1.8 4-4 0-1.2-.5-2.3-1.3-3.1.8-.7 1.3-1.7 1.3-2.9 0-5.5-4.5-10-10-10z"></path>
    </svg>
);

const PuzzleIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.4 15.3c-1.1.9-2.2 1.6-3.4 2.1-1.2.5-2.5.8-3.9.8-1.4 0-2.7-.3-3.9-.8-1.2-.5-2.3-1.2-3.4-2.1-1.1-.9-2-2-2.7-3.2-.7-1.2-1.1-2.6-1.1-4.1 0-1.5.4-2.9 1.1-4.1.7-1.2 1.6-2.3 2.7-3.2 1.1-.9 2.2-1.6 3.4-2.1 1.2-.5 2.5-.8 3.9-.8 1.4 0 2.7.3 3.9.8 1.2.5 2.3 1.2 3.4 2.1 1.1.9 2 2 2.7 3.2.7 1.2 1.1 2.6 1.1 4.1 0 1.5-.4 2.9-1.1 4.1-.7 1.2-1.6 2.3-2.7 3.2z"></path>
    </svg>
);

const ChevronRightIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6"></path>
    </svg>
);

const ShuffleIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3H3v13h13V3z"></path>
        <path d="M21 8h-3V3"></path>
        <path d="M3 16h3v5"></path>
        <path d="M16 3l5 5"></path>
        <path d="M3 16l5 5"></path>
    </svg>
);

const ImageIcon = ({ size = 24, color = 'currentColor' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <path d="M21 15l-5-5L5 21"></path>
    </svg>
);

// New: Guess The Number Game Component
const GuessTheNumberGame = ({ theme }) => {
    const [secretNumber, setSecretNumber] = useState(null);
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('Guess a number between 1 and 100!');
    const [attempts, setAttempts] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Initialize game
    const startGame = useCallback(() => {
        setSecretNumber(Math.floor(Math.random() * 100) + 1);
        setGuess('');
        setMessage('Guess a number between 1 and 100!');
        setAttempts(0);
        setGameOver(false);
    }, []);

    useEffect(() => {
        startGame(); // Start a new game when component mounts
    }, [startGame]);

    const handleGuessChange = (e) => {
        setGuess(e.target.value);
    };

    const handleSubmitGuess = (e) => {
        e.preventDefault();
        if (gameOver) return;

        const numGuess = parseInt(guess, 10);

        if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
            setMessage('Please enter a valid number between 1 and 100.');
            return;
        }

        setAttempts(prev => prev + 1);

        if (numGuess === secretNumber) {
            setMessage(`Congratulations! You guessed the number ${secretNumber} in ${attempts + 1} attempts!`);
            setGameOver(true);
        } else if (numGuess < secretNumber) {
            setMessage('Too low! Try again.');
        } else {
            setMessage('Too high! Try again.');
        }
        setGuess(''); // Clear input after guess
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backgroundColor: theme.background,
            borderRadius: theme.borderRadiusSoft,
            boxShadow: theme.shadowLight,
            color: theme.text,
            maxWidth: '400px',
            margin: 'auto',
            textAlign: 'center'
        }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '1rem', color: theme.primaryAccent }}>Guess The Number!</h3>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{message}</p>
            {!gameOver && (
                <form onSubmit={handleSubmitGuess} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                    <input
                        type="number"
                        value={guess}
                        onChange={handleGuessChange}
                        min="1"
                        max="100"
                        placeholder="Enter your guess"
                        style={{
                            padding: '0.75rem',
                            borderRadius: theme.borderRadiusSoft,
                            border: `1px solid ${theme.journalBorder}`,
                            backgroundColor: theme.inputBackground,
                            color: theme.text,
                            fontSize: '1rem',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button type="submit" style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: theme.borderRadiusRound,
                        backgroundImage: theme.buttonPrimaryBg,
                        color: theme.buttonPrimaryText,
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: theme.transitionSpeed,
                        outline: 'none',
                    }}>
                        Submit Guess
                    </button>
                </form>
            )}
            {gameOver && (
                <button onClick={startGame} style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: theme.borderRadiusRound,
                    backgroundColor: theme.buttonSecondaryBg,
                    color: theme.buttonSecondaryText,
                    border: `1px solid ${theme.buttonSecondaryBorder}`,
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: theme.transitionSpeed,
                    outline: 'none',
                }}>
                    Play Again
                </button>
            )}
            <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: theme.textLight }}>Attempts: {attempts}</p>
        </div>
    );
};


function UpliftmentToolsPage() {
    // Use the useTheme hook to get the current theme dynamically
    const { theme } = useTheme();

    const [selectedMood, setSelectedMood] = useState(null);
    const [content, setContent] = useState({
        music: [],
        videos: [],
        meditations: [],
        games: [], // This array will still be fetched but game UI is now fixed
        books: [],
        images: [],
    });
    const [universeMessage, setUniverseMessage] = useState("Click to reveal your message!");
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [isLoadingMessage, setIsLoadingMessage] = useState(false);
    const [playbackModalOpen, setPlaybackModalOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState({ type: '', title: '', url: '' });
    const [isModalLoading, setIsModalLoading] = useState(false); // New state for modal loading

    // Ref for the mood section (no longer used for sticky positioning)
    const moodSectionRef = useRef(null);

    // Mood options with direct color references from theme
    const moodOptions = [
        { name: 'Happy', emoji: '😊', color: theme.moodHappy, border: theme.moodSelectedBorder },
        { name: 'Calm', emoji: '😌', color: theme.moodCalm, border: theme.moodSelectedBorder },
        { name: 'Sad', emoji: '😔', color: theme.moodSad, border: theme.moodSelectedBorder },
        { name: 'Anxious', emoji: '😟', color: theme.moodAnxious, border: theme.moodSelectedBorder },
        { name: 'Excited', emoji: '🤩', color: theme.moodExcited, border: theme.moodSelectedBorder },
        { name: 'Reflective', emoji: '🤔', color: theme.moodReflective, border: theme.moodSelectedBorder },
    ];

    const API_BASE_URL = 'http://localhost:5000/api/upliftment';

    // useCallback for fetching content from backend
    const fetchContentForMood = useCallback(async (mood) => {
        try {
            const response = await fetch(`${API_BASE_URL}/content?mood=${mood || ''}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setContent(data);
        } catch (error) {
            console.error("Error fetching content:", error);
            setContent({ music: [], videos: [], meditations: [], games: [], books: [], images: [] }); // Clear content on error
        }
    }, []);

    // useCallback for generating universe message from backend
    const generateUniverseMessage = useCallback(async () => {
        setIsLoadingMessage(true);
        setIsCardFlipped(false);
        setUniverseMessage("Generating your message...");

        try {
            const response = await fetch(`${API_BASE_URL}/message`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUniverseMessage(data.message);
            setIsLoadingMessage(false);
            setIsCardFlipped(true);
        } catch (error) {
            console.error("Error generating universe message:", error);
            setUniverseMessage("Failed to get message. Try again!");
            setIsLoadingMessage(false);
        }
    }, []);

    // Effect to fetch content when selectedMood changes
    useEffect(() => {
        fetchContentForMood(selectedMood);
    }, [selectedMood, fetchContentForMood]);

    const handleMoodSelect = (moodName) => {
        setSelectedMood(moodName);
        // Ensure content is re-fetched when mood changes
        fetchContentForMood(moodName);
    };

    const handleSerendipity = () => {
        const contentTypes = ['music', 'videos', 'meditations', 'games', 'books', 'images', 'message'];
        const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];

        if (randomType === 'message') {
            generateUniverseMessage();
            document.getElementById('universe-message-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            const sectionId = `${randomType}-section`;
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // For games, we don't load more, just open the modal with the built-in game
            if (randomType === 'games') {
                openPlaybackModal('game', 'Guess The Number', ''); // Pass empty URL as it's an internal game
            } else if (content[randomType].length === 0) {
                handleLoadMore(randomType);
            }
        }
    };

    const handleLoadMore = useCallback(async (type) => {
        try {
            const currentCount = content[type].length;
            const response = await fetch(`${API_BASE_URL}/load-more?type=${type}&currentCount=${currentCount}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setContent(prevContent => ({
                ...prevContent,
                [data.type]: [...prevContent[data.type], ...data.newItems]
            }));
        } catch (error) {
            console.error(`Error loading more ${type} content:`, error);
        }
    }, [content]);

    const openPlaybackModal = (type, title, url) => {
        setIsModalLoading(true); // Set modal loading true
        let processedUrl = url;

        // Attempt to convert YouTube watch URL to embed URL if not already one
        if (type === 'video' && url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('v=')[1];
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                processedUrl = `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
            } else {
                processedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
        }
        // No special processing for Spotify here, as the backend now sends embed URLs.

        setCurrentMedia({ type, title, url: processedUrl });
        setPlaybackModalOpen(true);
        // Simulate loading time for modal content, then set loading to false
        setTimeout(() => {
            setIsModalLoading(false);
        }, 500); // Small delay to show loading state
    };

    const closePlaybackModal = () => {
        setPlaybackModalOpen(false);
        setCurrentMedia({ type: '', title: '', url: '' }); // Clear media on close
    };

    const sidebarItems = [
        { id: 'music-section', label: 'Music', icon: <PlayCircleIcon size={20} /> },
        { id: 'videos-section', label: 'Videos', icon: <PlayCircleIcon size={20} /> },
        { id: 'meditations-section', label: 'Meditations', icon: <PaletteIcon size={20} /> },
        { id: 'games-section', label: 'Games', icon: <PuzzleIcon size={20} /> },
        { id: 'books-section', label: 'Books', icon: <BookOpenIcon size={20} /> },
        { id: 'images-section', label: 'Images', icon: <ImageIcon size={20} /> },
        { id: 'universe-message-section', label: 'Message', icon: <ShuffleIcon size={20} /> }, // Using ShuffleIcon for message for now
    ];

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <CustomStylesAndAnimations />

            {/* Background Animation - Fixed to viewport */}
            <div
                className="bg-particle-animation"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    opacity: 0.6,
                    pointerEvents: 'none',
                    transition: 'all 1.5s ease-in-out',
                    background: selectedMood ?
                        (selectedMood === 'Happy' ? `radial-gradient(circle at top left, ${theme.moodHappy}, ${theme.secondaryAccent})` :
                        selectedMood === 'Calm' ? `radial-gradient(circle at center, ${theme.moodCalm}, ${theme.primaryAccent})` :
                        selectedMood === 'Sad' ? `radial-gradient(circle at bottom right, ${theme.moodSad}, ${theme.secondaryAccent})` :
                        selectedMood === 'Anxious' ? `radial-gradient(circle at top right, ${theme.moodAnxious}, ${theme.primaryAccent})` :
                        selectedMood === 'Excited' ? `radial-gradient(circle at center, ${theme.moodExcited}, ${theme.secondaryAccent})` :
                        selectedMood === 'Reflective' ? `radial-gradient(circle at bottom left, ${theme.moodReflective}, ${theme.primaryAccent})` :
                        theme.primaryGradient) // Default fallback gradient
                        : theme.primaryGradient // Default if no mood selected
                }}
            ></div>

            {/* Main container for the entire page, including sidebar and main content */}
            <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative', zIndex: 1 }}>
                {/* Sidebar */}
                <div className="sidebar" style={{ backgroundColor: theme.sidebarBackground, color: theme.sidebarText }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: theme.sidebarHeader }}>Sections</h2>
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            className="sidebar-item"
                            onClick={() => scrollToSection(item.id)}
                            style={{
                                color: theme.sidebarItemText,
                            }}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="main-content-area" style={{ backgroundColor: 'transparent' }}>
                    {/* Hero Section for Upliftment Tools - Scrolls with content */}
                    <section className="animate-fade-in" style={{
                        textAlign: 'center',
                        marginBottom: '4rem', // Space before the mood selector
                        maxWidth: '1200px',
                        width: '100%',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <h1 className="hero-title" style={{
                            fontSize: '3.75rem',
                            fontWeight: '800',
                            marginBottom: '1rem',
                            backgroundImage: theme.primaryGradient, // Using theme gradient
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Adjusted text shadow for better visibility
                        }}>
                            Upliftment Tools
                        </h1>
                        <p className="hero-subtitle" style={{
                            fontSize: '1.25rem',
                            lineHeight: '1.625',
                            maxWidth: '768px',
                            margin: '0 auto',
                            color: theme.textLight, // Using theme textLight
                        }}>
                            Discover music, videos, meditations, games, and more, specifically curated to boost your mood and bring you peace. Let Elumia guide you to your happy place.
                        </p>
                    </section>

                    {/* Mood Selection Section - Now a regular block element that scrolls with content */}
                    <div ref={moodSectionRef} className="animate-fade-in animate-delay-200 mood-section-padding" style={{
                        width: '100%',
                        maxWidth: '1000px',
                        backgroundColor: theme.cardBackground, // Using theme card background
                        padding: '2rem',
                        borderRadius: theme.borderRadiusSoft, // Using theme border radius
                        boxShadow: theme.shadowMedium, // Using theme shadow
                        textAlign: 'center',
                        marginBottom: '2.5rem', // Add margin below it to separate from content grids
                        zIndex: 10, // Keep a reasonable z-index
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderBottom: `1px solid ${theme.journalBorder}`,
                        transition: `background-color ${theme.transitionSpeed}, box-shadow ${theme.transitionSpeed}`,
                    }}>
                        <h2 style={{
                            fontSize: '2.25rem',
                            color: theme.text, // Using theme text
                            marginBottom: '1.5rem',
                        }}>How are you feeling today?</h2>
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            justifyContent: 'center',
                            paddingBottom: '0.5rem',
                            flexWrap: 'wrap', // Ensure buttons wrap
                        }}>
                            {moodOptions.map((mood, index) => (
                                <button
                                    key={mood.name}
                                    className="mood-button"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: '120px',
                                        padding: '1rem',
                                        borderRadius: theme.borderRadiusRound, // Using theme border radius
                                        boxShadow: theme.shadowLight, // Using theme shadow
                                        cursor: 'pointer',
                                        transition: theme.transitionSpeed, // Using theme transition
                                        backgroundColor: mood.color, // Mood specific color from theme
                                        border: selectedMood === mood.name ? `4px solid ${mood.border}` : '4px solid transparent',
                                        transform: selectedMood === mood.name ? 'translateY(-4px)' : 'none',
                                        outline: 'none',
                                        flexShrink: 0,
                                    }}
                                    onClick={() => handleMoodSelect(mood.name)}
                                >
                                    <span className="mood-button-emoji" style={{
                                        fontSize: '3.125rem',
                                        marginBottom: '0.5rem',
                                    }}>{mood.emoji}</span>
                                    <span className="mood-button-text" style={{
                                        color: theme.moodText, // Using theme moodText
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        whiteSpace: 'nowrap',
                                    }}>{mood.name}</span>
                                </button>
                            ))}
                        </div>
                        {selectedMood && (
                            <p className="animate-fade-in" style={{
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                marginTop: '1.5rem',
                                color: theme.text // Using theme text
                            }}>
                                You've selected: <span style={{ fontWeight: '700' }}>{selectedMood}</span> {moodOptions.find(m => m.name === selectedMood)?.emoji}. Here are some recommendations for you!
                            </p>
                        )}
                    </div>

                    {/* Content Grids - These will scroll */}
                    <div className="content-grid" style={{
                        width: '100%',
                        maxWidth: '1200px',
                        // display: 'grid', /* Removed, now flex column */
                        // gridTemplateColumns: 'repeat(3, 1fr)', /* Removed */
                        gap: '2rem',
                        position: 'relative',
                        zIndex: 10,
                    }}>
                        {/* Music Section */}
                        <section id="music-section" className="animate-fade-in animate-delay-300" style={{
                            padding: '1.5rem',
                            borderRadius: theme.borderRadiusSoft,
                            boxShadow: theme.shadowMedium,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                            backgroundColor: theme.cardBackground // Using theme card background
                        }}>
                            <h2 className="content-section-title" style={{
                                fontSize: '1.875rem',
                                color: theme.text, // Using theme text
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <span style={{ color: theme.primaryAccent, fontSize: '2rem' }}><PlayCircleIcon size={32} /></span> Discover Music
                            </h2>
                            <div className="content-items-grid">
                                {content.music.length > 0 ? content.music.map(item => (
                                    <div key={item.id} className="content-card" style={{
                                        backgroundColor: theme.background, // Using theme background
                                        color: theme.text, // Using theme text
                                    }}>
                                        {/* Check if item.thumbnail exists before rendering img */}
                                        {item.thumbnail ? (
                                            <img src={item.thumbnail} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x80/cccccc/ffffff?text=Music'; }} />
                                        ) : (
                                            // Placeholder if no thumbnail URL is provided by the API
                                            <div style={{
                                                width: '100%', height: '120px', backgroundColor: '#cccccc', borderRadius: '0.375rem',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff',
                                                fontSize: '0.875rem', marginBottom: '0.5rem'
                                            }}>No Music Thumbnail</div>
                                        )}
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: theme.text }}>{item.title}</h3>
                                        <p style={{ fontSize: '0.875rem', flexGrow: 1, color: theme.textLight }}>{item.description}</p>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '700', marginTop: '0.25rem', color: theme.primaryAccent }}>{item.category}</span>
                                        <button className="content-card-button" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            color: theme.buttonSecondaryText, // Using theme button secondary text
                                            fontWeight: '600',
                                            fontSize: '0.875rem',
                                            marginTop: '0.5rem',
                                            transition: theme.transitionSpeed,
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            outline: 'none',
                                        }}
                                                onClick={() => openPlaybackModal('music', item.title, item.url)}>
                                            {item.icon} Play Now <ChevronRightIcon size={16} color={theme.buttonSecondaryText} />
                                        </button>
                                    </div>
                                )) : <p style={{color: theme.textLight, textAlign: 'center', gridColumn: 'span 3 / span 3'}}>No music found for this mood. Try another mood or check API keys.</p>}
                            </div>
                            <button onClick={() => handleLoadMore('music')} style={{
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                borderRadius: theme.borderRadiusRound,
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                boxShadow: theme.shadowLight,
                                transition: theme.transitionSpeed,
                                backgroundImage: theme.buttonPrimaryBg, // Using theme primary button background
                                color: theme.buttonPrimaryText, // Using theme primary button text
                                border: 'none',
                                cursor: 'pointer',
                                outline: 'none',
                            }}>Load More Music</button>
                        </section>

                        {/* Videos Section */}
                        <section id="videos-section" className="animate-fade-in animate-delay-500" style={{
                            padding: '1.5rem',
                            borderRadius: theme.borderRadiusSoft,
                            boxShadow: theme.shadowMedium,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                            backgroundColor: theme.cardBackground
                        }}>
                            <h2 className="content-section-title" style={{
                                fontSize: '1.875rem',
                                color: theme.text,
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <span style={{ color: theme.primaryAccent, fontSize: '2rem' }}><PlayCircleIcon size={32} /></span> Explore Videos
                            </h2>
                            <div className="content-items-grid">
                                {content.videos.length > 0 ? content.videos.map(item => (
                                    <div key={item.id} className="content-card" style={{
                                        backgroundColor: theme.background, // Using theme background
                                        color: theme.text, // Using theme text
                                    }}>
                                        {/* Check if item.thumbnail exists before rendering img */}
                                        {item.thumbnail ? (
                                            <img src={item.thumbnail} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x80/cccccc/ffffff?text=Video'; }} />
                                        ) : (
                                            // Placeholder if no thumbnail URL is provided by the API
                                            <div style={{
                                                width: '100%', height: '120px', backgroundColor: '#cccccc', borderRadius: '0.375rem',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff',
                                                fontSize: '0.875rem', marginBottom: '0.5rem'
                                            }}>No Video Thumbnail</div>
                                        )}
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: theme.text }}>{item.title}</h3>
                                        <p style={{ fontSize: '0.875rem', flexGrow: 1, color: theme.textLight }}>{item.description}</p>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '700', marginTop: '0.25rem', color: theme.primaryAccent }}>{item.category}</span>
                                        <button className="content-card-button" style={{
                                            display: 'flex', alignItems: 'center', gap: '0.25rem', color: theme.buttonSecondaryText, fontWeight: '600', fontSize: '0.875rem', marginTop: '0.5rem', transition: theme.transitionSpeed, background: 'none', border: 'none', cursor: 'pointer', padding: 0, outline: 'none',
                                        }}
                                                onClick={() => openPlaybackModal('video', item.title, item.url)}>
                                            {item.icon} Watch Now <ChevronRightIcon size={16} color={theme.buttonSecondaryText} />
                                        </button>
                                    </div>
                                )) : <p style={{color: theme.textLight, textAlign: 'center', gridColumn: 'span 3 / span 3'}}>No videos found for this mood. Try another mood or check API keys.</p>}
                            </div>
                            <button onClick={() => handleLoadMore('videos')} style={{
                                marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: theme.borderRadiusRound, fontSize: '0.875rem', fontWeight: '600', boxShadow: theme.shadowLight, transition: theme.transitionSpeed, backgroundImage: theme.buttonPrimaryBg, color: theme.buttonPrimaryText, border: 'none', cursor: 'pointer', outline: 'none',
                            }}>Load More Videos</button>
                        </section>

                        {/* Meditations Section */}
                        <section id="meditations-section" className="animate-fade-in animate-delay-700" style={{
                            padding: '1.5rem',
                            borderRadius: theme.borderRadiusSoft,
                            boxShadow: theme.shadowMedium,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                            backgroundColor: theme.cardBackground
                        }}>
                            <h2 className="content-section-title" style={{
                                fontSize: '1.875rem',
                                color: theme.text,
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <span style={{ color: theme.primaryAccent, fontSize: '2rem' }}><PaletteIcon size={32} /></span> Find Your Inner Calm
                            </h2>
                            <div className="content-items-grid">
                                {content.meditations.length > 0 ? content.meditations.map(item => (
                                    <div key={item.id} className="content-card" style={{
                                        backgroundColor: theme.background, // Using theme background
                                        color: theme.text, // Using theme text
                                    }}>
                                        {/* Check if item.thumbnail exists before rendering img */}
                                        {item.thumbnail ? (
                                            <img src={item.thumbnail} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x80/cccccc/ffffff?text=Meditation'; }} />
                                        ) : (
                                            // Placeholder if no thumbnail URL is provided by the API
                                            <div style={{
                                                width: '100%', height: '120px', backgroundColor: '#cccccc', borderRadius: '0.375rem',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff',
                                                fontSize: '0.875rem', marginBottom: '0.5rem'
                                            }}>No Meditation Thumbnail</div>
                                        )}
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: theme.text }}>{item.title}</h3>
                                        <p style={{ fontSize: '0.875rem', flexGrow: 1, color: theme.textLight }}>{item.description}</p>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '700', marginTop: '0.25rem', color: theme.primaryAccent }}>{item.category}</span>
                                        <button className="content-card-button" style={{
                                            display: 'flex', alignItems: 'center', gap: '0.25rem', color: theme.buttonSecondaryText, fontWeight: '600', fontSize: '0.875rem', marginTop: '0.5rem', transition: theme.transitionSpeed, background: 'none', border: 'none', cursor: 'pointer', padding: 0, outline: 'none',
                                        }}
                                                onClick={() => openPlaybackModal('meditation', item.title, item.url)}>
                                            {item.icon} Begin <ChevronRightIcon size={16} color={theme.buttonSecondaryText} />
                                        </button>
                                    </div>
                                )) : <p style={{color: theme.textLight, textAlign: 'center', gridColumn: 'span 3 / span 3'}}>No meditations found for this mood. Try another mood or check API keys.</p>}
                            </div>
                            <button onClick={() => handleLoadMore('meditations')} style={{
                                marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: theme.borderRadiusRound, fontSize: '0.875rem', fontWeight: '600', boxShadow: theme.shadowLight, transition: theme.transitionSpeed, backgroundImage: theme.buttonPrimaryBg, color: theme.buttonPrimaryText, border: 'none', cursor: 'pointer', outline: 'none',
                            }}>Load More Meditations</button>
                        </section>

                        {/* Games Section (Now only features Guess the Number) */}
                        <section id="games-section" className="animate-fade-in animate-delay-900" style={{
                            padding: '1.5rem',
                            borderRadius: theme.borderRadiusSoft,
                            boxShadow: theme.shadowMedium,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                            backgroundColor: theme.cardBackground,
                            justifyContent: 'center', // Center content vertically
                            alignItems: 'center', // Center content horizontally
                            minHeight: '250px' // Ensure a minimum height for consistent box look
                        }}>
                            <h2 className="content-section-title" style={{
                                fontSize: '1.875rem',
                                color: theme.text,
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <span style={{ color: theme.primaryAccent, fontSize: '2rem' }}><PuzzleIcon size={32} /></span> Engage Your Mind with a Game!
                            </h2>
                            <p style={{color: theme.textLight, textAlign: 'center', marginBottom: '1.5rem'}}>
                                Play a simple, fun game directly in the app to uplift your spirits!
                            </p>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '1rem 2rem',
                                borderRadius: theme.borderRadiusRound,
                                backgroundImage: theme.buttonPrimaryBg,
                                color: theme.buttonPrimaryText,
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '1.125rem',
                                boxShadow: theme.shadowMedium,
                                transition: theme.transitionSpeed,
                                outline: 'none',
                            }}
                                    onClick={() => openPlaybackModal('game', 'Guess The Number', '')}>
                                <PuzzleIcon size={24} color={theme.buttonPrimaryText} /> Play Guess The Number
                            </button>
                            {/* Removed Load More Games button */}
                        </section>

                        {/* Books Section */}
                        <section id="books-section" className="animate-fade-in animate-delay-1100" style={{
                            padding: '1.5rem',
                            borderRadius: theme.borderRadiusSoft,
                            boxShadow: theme.shadowMedium,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                            backgroundColor: theme.cardBackground
                        }}>
                            <h2 className="content-section-title" style={{
                                fontSize: '1.875rem',
                                color: theme.text,
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <span style={{ color: theme.primaryAccent, fontSize: '2rem' }}><BookOpenIcon size={32} /></span> Explore & Grow
                            </h2>
                            <div className="content-items-grid">
                                {content.books.length > 0 ? content.books.map(item => (
                                    <div key={item.id} className="content-card" style={{
                                        backgroundColor: theme.background, // Using theme background
                                        color: theme.text, // Using theme text
                                    }}>
                                        {/* Check if item.thumbnail exists before rendering img */}
                                        {item.thumbnail ? (
                                            <img src={item.thumbnail} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x80/cccccc/ffffff?text=Book'; }} />
                                        ) : (
                                            // Placeholder if no thumbnail URL is provided by the API
                                            <div style={{
                                                width: '100%', height: '120px', backgroundColor: '#cccccc', borderRadius: '0.375rem',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff',
                                                fontSize: '0.875rem', marginBottom: '0.5rem'
                                            }}>No Book Thumbnail</div>
                                        )}
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: theme.text }}>{item.title}</h3>
                                        <p style={{ fontSize: '0.875rem', flexGrow: 1, color: theme.textLight }}>{item.description}</p>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '700', marginTop: '0.25rem', color: theme.primaryAccent }}>{item.category}</span>
                                        <button className="content-card-button" style={{
                                            display: 'flex', alignItems: 'center', gap: '0.25rem', color: theme.buttonSecondaryText, fontWeight: '600', fontSize: '0.875rem', marginTop: '0.5rem', transition: theme.transitionSpeed, background: 'none', border: 'none', cursor: 'pointer', padding: 0, outline: 'none',
                                        }}
                                                onClick={() => window.open(item.url, '_blank')}>
                                            {item.icon} Read Now <ChevronRightIcon size={16} color={theme.buttonSecondaryText} />
                                        </button>
                                    </div>
                                )) : <p style={{color: theme.textLight, textAlign: 'center', gridColumn: 'span 3 / span 3'}}>No books found for this mood.</p>}
                            </div>
                            <button onClick={() => handleLoadMore('books')} style={{
                                marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: theme.borderRadiusRound, fontSize: '0.875rem', fontWeight: '600', boxShadow: theme.shadowLight, transition: theme.transitionSpeed, backgroundImage: theme.buttonPrimaryBg, color: theme.buttonPrimaryText, border: 'none', cursor: 'pointer', outline: 'none',
                            }}>Load More Books</button>
                        </section>

                        {/* Visual Upliftment Gallery */}
                        <section id="images-section" className="animate-fade-in animate-delay-1200" style={{
                            padding: '1.5rem',
                            borderRadius: theme.borderRadiusSoft,
                            boxShadow: theme.shadowMedium,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                            backgroundColor: theme.cardBackground,
                            // Removed gridColumn: 'span 3 / span 3'
                        }}>
                            <h2 className="content-section-title" style={{
                                fontSize: '1.875rem',
                                color: theme.text,
                                marginBottom: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <span style={{ color: theme.primaryAccent, fontSize: '2rem' }}><ImageIcon size={32} /></span> Visual Upliftment Gallery
                            </h2>
                            <p style={{ textAlign: 'center', marginBottom: '1rem', color: theme.textLight }}>A calming collection of images to soothe your mind. (Images are from Picsum.photos for demonstration.)</p>
                            <div className="image-gallery-grid">
                                {content.images.length > 0 ? content.images.map(image => (
                                    <div key={image.id} style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: theme.borderRadiusSoft, // Using theme border radius
                                        boxShadow: theme.shadowLight,
                                        cursor: 'pointer',
                                        transition: theme.transitionSpeed,
                                        transform: 'none',
                                    }}>
                                        {/* Check if image.url exists before rendering img */}
                                        {image.url ? (
                                            <img src={image.url} alt="Uplifting Visual" className="image-gallery-img" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x200/cccccc/ffffff?text=Image+Error'; }} />
                                        ) : (
                                            // Placeholder if no image URL is provided by the API
                                            <div style={{
                                                width: '100%', height: '120px', backgroundColor: '#cccccc', borderRadius: '0.375rem',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff',
                                                fontSize: '0.875rem'
                                            }}>No Image Available</div>
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: theme.transitionSpeed,
                                        }}>
                                            <span style={{ color: theme.buttonPrimaryText, fontSize: '1.125rem', fontWeight: '700' }}>View</span>
                                        </div>
                                    </div>
                                )) : <p style={{color: theme.textLight, textAlign: 'center', gridColumn: 'span 3 / span 3'}}>No images found for this mood.</p>}
                            </div>
                            <button onClick={() => handleLoadMore('images')} style={{
                                marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: theme.borderRadiusRound, fontSize: '0.875rem', fontWeight: '600', boxShadow: theme.shadowLight, transition: theme.transitionSpeed, backgroundImage: theme.buttonPrimaryBg, color: theme.buttonPrimaryText, border: 'none', cursor: 'pointer', outline: 'none',
                            }}>Load More Images</button>
                        </section>
                    </div>

                    <section id="universe-message-section" className="animate-fade-in animate-delay-800 message-section" style={{
                        width: '100%',
                        maxWidth: '768px',
                        padding: '2rem',
                        borderRadius: theme.borderRadiusSoft,
                        boxShadow: theme.shadowMedium,
                        textAlign: 'center',
                        marginTop: '4rem',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        position: 'relative',
                        zIndex: 10,
                        background: theme.primaryGradient, // Using theme primary gradient
                        color: theme.buttonPrimaryText // Using theme button primary text for contrast
                    }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Your Message from the Universe</h2>
                        <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>A daily dose of wisdom and inspiration, just for you.</p>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '32rem', height: '208px', margin: '0 auto', perspective: '1000px' }}>
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                transition: theme.transitionSpeed,
                                transformStyle: 'preserve-3d',
                                transform: isCardFlipped ? 'rotateY(180deg)' : 'none'
                            }}>
                                <div className="message-card front" style={{ // Added 'front' class
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: theme.borderRadiusSoft,
                                    boxShadow: theme.shadowLight,
                                    backgroundColor: theme.cardBackground, // Using theme card background
                                    color: theme.primaryAccent, // Using theme primary accent
                                    fontSize: '3.125rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    padding: '1.25rem'
                                }}
                                     onClick={() => {
                                         if (!isLoadingMessage && !isCardFlipped) {
                                             generateUniverseMessage();
                                         }
                                     }}>
                                    {isLoadingMessage ? "..." : "Tap to Reveal"}
                                    {!isLoadingMessage && <span className="message-card-text" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>✨</span>}
                                </div>
                                <div className="message-card back" style={{ // Added 'back' class
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: theme.borderRadiusSoft,
                                    boxShadow: theme.shadowLight,
                                    backgroundColor: theme.cardBackground, // Using theme card background
                                    transform: 'rotateY(180deg)',
                                    fontStyle: 'italic',
                                    lineHeight: '1.625',
                                    fontWeight: '500',
                                    padding: '1.25rem',
                                    color: theme.text // Using theme text
                                }}>
                                    {isLoadingMessage ? "..." : <span className="message-card-back-text">{universeMessage}</span>}
                                </div>
                            </div>
                        </div>
                        {!isLoadingMessage && isCardFlipped && (
                            <button style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: theme.borderRadiusRound,
                                border: 'none',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: theme.shadowLight,
                                transition: theme.transitionSpeed,
                                backgroundColor: theme.cardBackground, // Using theme card background
                                color: theme.primaryAccent, // Using theme primary accent
                                outline: 'none',
                            }}
                                    onClick={() => { setIsCardFlipped(false); setUniverseMessage("Click to reveal your message!"); }}>
                                Get Another Message
                            </button>
                        )}
                        {isLoadingMessage && <p style={{ color: theme.buttonPrimaryText, marginTop: '1rem' }}>Generating...</p>}
                    </section>

                    <div className="animate-fade-in animate-delay-1000" style={{
                        marginTop: '4rem',
                        marginBottom: '5rem',
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 10
                    }}>
                        <button className="animate-pulse-slow button-shimmer serendipity-button" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem 2.5rem',
                            borderRadius: theme.borderRadiusRound,
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: theme.shadowStrong, // Using theme shadow
                            transition: theme.transitionSpeed,
                            backgroundImage: theme.secondaryGradient, // Using theme secondary gradient
                            color: theme.buttonPrimaryText, // Using theme button primary text
                            outline: 'none',
                        }} onClick={handleSerendipity}>
                            <ShuffleIcon size={30} color={theme.buttonPrimaryText} /> Surprise Me!
                        </button>
                        <p style={{ marginTop: '1rem', fontSize: '1.125rem', color: theme.textLight }}>Can't decide? Let Elumia pick something uplifting for you!</p>
                    </div>

                    {playbackModalOpen && (
                        <div style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 50,
                            animation: 'fadeIn 0.5s ease-out forwards'
                        }}>
                            <div className="animate-fade-in animate-delay-200 modal-content" style={{
                                backgroundColor: theme.cardBackground,
                                borderRadius: theme.borderRadiusSoft,
                                boxShadow: theme.shadowMedium,
                                padding: '1.5rem',
                                width: '91.666667%',
                                maxWidth: '48rem',
                                position: 'relative',
                                maxHeight: '90vh', // Added max-height
                                overflowY: 'auto', // Added overflow-y for internal scrolling
                            }}>
                                {/* Close Button (X) */}
                                <button className="close-button" onClick={closePlaybackModal} style={{
                                    position: 'absolute',
                                    top: '0.75rem',
                                    right: '0.75rem',
                                    color: theme.textLight,
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    outline: 'none',
                                }}>&times;</button>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: theme.text }}>{currentMedia.title}</h3>
                                {isModalLoading ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: theme.text }}>
                                        <div style={{
                                            border: '4px solid rgba(0, 0, 0, 0.1)',
                                            borderTop: `4px solid ${theme.primaryAccent}`,
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            animation: 'spin 1s linear infinite',
                                            margin: 'auto auto 1rem auto',
                                        }}></div>
                                        <p>Loading media...</p>
                                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                                    </div>
                                ) : (
                                    <>
                                        {/* Conditional Rendering for Embeds or Game */}
                                        {currentMedia.type === 'game' ? (
                                            <GuessTheNumberGame theme={theme} />
                                        ) : (
                                            (currentMedia.type === 'music' && currentMedia.url.includes('open.spotify.com/embed/')) ||
                                            (currentMedia.type === 'video' && currentMedia.url.includes('youtube.com/embed/')) ||
                                            (currentMedia.type === 'meditation' && currentMedia.url.includes('youtube.com/embed/'))
                                            ? (
                                                <div style={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: 0,
                                                    paddingBottom: '56.25%', // 16:9 aspect ratio
                                                    overflow: 'hidden',
                                                    borderRadius: '0.375rem',
                                                }}>
                                                    <iframe
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                        }}
                                                        src={currentMedia.url}
                                                        title={currentMedia.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            ) : (
                                                // Fallback for non-embeddable URLs or other types
                                                <div style={{ textAlign: 'center', padding: '2rem', color: theme.text }}>
                                                    <p style={{marginBottom: '1rem'}}>
                                                        Direct embedding for this content type might be restricted by the provider, or it's not a direct embed URL.
                                                        For the best experience, please open in a new tab:
                                                    </p>
                                                    <button className="open-new-tab-button" onClick={() => window.open(currentMedia.url, '_blank')} style={{
                                                        marginTop: '1rem',
                                                        padding: '0.75rem 1.5rem',
                                                        borderRadius: theme.borderRadiusRound,
                                                        backgroundImage: theme.buttonPrimaryBg,
                                                        color: theme.buttonPrimaryText,
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        outline: 'none',
                                                    }}>
                                                        Open {currentMedia.type === 'music' ? 'Spotify' : 'Content'} in New Tab
                                                    </button>
                                                </div>
                                            )
                                        )}
                                        {currentMedia.type !== 'game' && (
                                            <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: theme.textLight }}>
                                                Note: If a video shows "unavailable" or "restricted," it's due to the uploader's settings on YouTube. Please try another video.
                                            </p>
                                        )}
                                    </>
                                )}
                                {/* Back to Upliftment Button */}
                                <button className="back-button" onClick={closePlaybackModal} style={{
                                    marginTop: '1.5rem',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: theme.borderRadiusRound,
                                    backgroundColor: theme.buttonSecondaryBg, // Using theme secondary button background
                                    color: theme.buttonSecondaryText, // Using theme secondary button text
                                    border: `1px solid ${theme.buttonSecondaryBorder}`, // Using theme secondary button border
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    outline: 'none',
                                }}>
                                    Back to Upliftment
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default UpliftmentToolsPage;