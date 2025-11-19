import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as AppThemeProvider, useTheme } from './contexts/ThemeContext';
import GlobalStyle from './styles/GlobalStyle';
import { lightTheme, darkTheme } from './styles/themes';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatInput from './components/ai/ChatInput';
import HomePage from './pages/HomePage';
import AIPage from './pages/AIPage'; // Your existing AI Chat Page
import AIHubPage from './pages/AIHubPage'; // ⭐ NEW: Import the AI Hub Page
import MoodJournalPage from './pages/MoodJournalPage';
import DashboardPage from './pages/EmotionDashboardPage';
import UpliftmentPage from './pages/UpliftmentToolsPage';
import MentalHealthSupportPage from './pages/MentalHealthSupportPage';
import AuthPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import WellnessPage from './pages/WellnessMindfulnessPage';
import SettingsSidebar from './components/layout/SettingsSidebar';
import SplashScreen from './components/common/SplashScreen';

// Firebase Auth for user email in settings sidebar
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';

const PageLayout = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: ${({ theme }) => theme.background};
    transition: background-color var(--transition-speed);
`;

const MainContent = styled.main`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding-top: 70px;
    position: relative;
    width: 100%;
    overflow-y: auto;

    /* Custom scrollbar for MainContent */
    &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.inputBackground};
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.buttonSecondaryText};
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.primaryGradient};
    }
`;

const FixedHeader = styled(Header)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: ${({ theme }) => theme.background};
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    height: 70px;
    flex-shrink: 0;
`;

// Fixed Chat Input Container (only for AI Page)
const FixedChatInputContainer = styled.div`
    position: fixed;
    bottom: 60px;
    left: 0;
    width: 100%;
    background-color: ${({ theme }) => theme.background};
    padding: 10px 0;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90px;
    flex-shrink: 0;
    padding: 10px 20px;
`;

const FixedFooter = styled(Footer)`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: ${({ theme }) => theme.background};
    box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
    height: 60px;
    flex-shrink: 0;
`;


function ThemedAppContent() {
    const { themeMode } = useTheme();
    const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
    const location = useLocation();

    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showSettingsSidebar, setShowSettingsSidebar] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // State for splash screen
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000); // 3 seconds
        return () => clearTimeout(timer);
    }, []);

    // Firebase Auth listener and backend user data fetch
    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserEmail(user.email);
                setCurrentUser(user);

                // Fetch user role from your backend
                try {
                    const idToken = await user.getIdToken();
                    const response = await fetch('http://localhost:5000/api/auth/me', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${idToken}`
                        },
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUserRole(userData.userType);
                    } else {
                        console.error('Failed to fetch user role from backend:', response.statusText);
                        setUserRole(null);
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUserRole(null);
                }

            } else {
                setUserEmail(null);
                setCurrentUser(null);
                setUserRole(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const toggleSettingsSidebar = () => {
        setShowSettingsSidebar(prev => !prev);
    };

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        const newUserMessage = { text, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);

        setIsTyping(true);

        try {
            const historyForApi = messages.map(msg => ({
                sender: msg.sender,
                message: msg.text
            }));

            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    history: historyForApi,
                    userMood: 'neutral'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get AI response from backend.');
            }

            const data = await response.json();
            const aiResponseContent = data.reply || data.text;

            const aiResponse = { text: aiResponseContent, sender: 'ai' };
            setMessages((prevMessages) => [...prevMessages, aiResponse]);

        } catch (error) {
            console.error('Error sending message to backend:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: `Error: ${error.message}. Please try again.`, sender: 'ai' }
            ]);
        } finally {
            setIsTyping(false);
        }
    };


    return (
        <StyledThemeProvider theme={currentTheme}>
            <GlobalStyle />
            {showSplash ? (
                <SplashScreen />
            ) : (
                <PageLayout theme={currentTheme}>
                    <FixedHeader toggleSettingsSidebar={toggleSettingsSidebar} />

                    <MainContent theme={currentTheme}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/journal" element={<MoodJournalPage />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/upliftment" element={<UpliftmentPage />} />
                            <Route
                                path="/support"
                                element={<MentalHealthSupportPage isAuthenticated={!!currentUser} />}
                            />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/wellness" element={<WellnessPage />} />
                            <Route path="/profile" element={<div>Profile Page Content (To be developed)</div>} />

                            {/* ⭐ NEW ROUTE: AI Hub Page (The main page with two links) */}
                            <Route path="/ai-hub" element={<AIHubPage />} />

                            {/* EXISTING ROUTE: AI Chat Page (The page with the chat interface) */}
                            <Route
                                path="/ai"
                                element={
                                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, paddingBottom: 'calc(90px + 60px)' }}>
                                        <AIPage
                                            messages={messages}
                                            setMessages={setMessages}
                                            isTyping={isTyping}
                                            setIsTyping={setIsTyping}
                                            onSendMessage={handleSendMessage}
                                        />
                                    </div>
                                }
                            />
                        </Routes>
                    </MainContent>

                    {/* Chat Input only shows on the AI Chat Page (/ai) */}
                    {location.pathname === '/ai' && (
                        <FixedChatInputContainer theme={currentTheme}>
                            <ChatInput onSendMessage={handleSendMessage} theme={currentTheme} />
                        </FixedChatInputContainer>
                    )}

                    <FixedFooter />

                    <SettingsSidebar
                        isOpen={showSettingsSidebar}
                        onClose={toggleSettingsSidebar}
                        userEmail={userEmail}
                    />

                </PageLayout>
            )}
        </StyledThemeProvider>
    );
}

function App() {
    return (
        <AppThemeProvider>
            <Router>
                <ThemedAppContent />
            </Router>
        </AppThemeProvider>
    );
}

export default App;