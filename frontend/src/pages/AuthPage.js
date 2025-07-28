// frontend/src/pages/AuthPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

// Import the initialized Firebase auth instance from your new firebase.js file
import { auth } from '../firebase'; // Adjust path if firebase.js is in a different location

// Firebase Auth methods
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'; // Added signOut

// Assuming React Router is used for navigation
// import { useNavigate } from 'react-router-dom'; // Uncomment if you have react-router-dom installed

const AuthContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh; /* Changed to 100vh to ensure it fills the viewport */
    padding: 20px;
    background-color: ${({ theme }) => theme.background};
    transition: background-color var(--transition-speed);
`;

const AuthBox = styled.div`
    background: ${({ theme }) => theme.cardBackground};
    padding: 40px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    max-width: 450px;
    width: 100%;
    text-align: center;
    transition: background var(--transition-speed);
    border: 1px solid ${({ theme }) => theme.journalBorder}; /* Added border for consistency */
`;

const Title = styled.h2`
    color: ${({ theme }) => theme.text};
    margin-bottom: 25px;
    font-size: 2.2rem; /* Slightly larger title */
    transition: color var(--transition-speed);
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 12px 15px;
    border: 1px solid ${({ theme }) => theme.inputBorder};
    border-radius: var(--border-radius-soft);
    font-size: 1rem;
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.inputBackground};
    transition: background-color var(--transition-speed), border-color var(--transition-speed), box-shadow 0.2s ease-in-out;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primaryColor}; /* Changed focus border color */
        box-shadow: 0 0 0 3px ${({ theme }) => theme.focusOutline}; /* Changed focus shadow */
    }
    &::placeholder {
        color: ${({ theme }) => theme.journalPlaceholder}; /* Consistent placeholder color */
    }
`;

const SubmitButton = styled.button`
    background: ${({ theme }) => theme.primaryGradient}; /* Used primary gradient */
    color: white; /* Changed text color to white for gradient */
    padding: 12px 20px;
    border-radius: var(--border-radius-round);
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    border: none;
    box-shadow: ${({ theme }) => theme.shadowSmall}; /* Consistent shadow */
    transition: transform 0.2s ease, box-shadow 0.2s ease; /* Simplified transition */

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Enhanced hover shadow */
    }
    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const LogoutButton = styled(SubmitButton)`
    background: ${({ theme }) => theme.buttonSecondaryBg};
    color: ${({ theme }) => theme.buttonSecondaryText};
    border: 2px solid ${({ theme }) => theme.buttonSecondaryBorder};
    margin-top: 20px; /* Add some space above the logout button */
    &:hover {
        background: ${({ theme }) => theme.buttonSecondaryBorder};
        color: white;
    }
`;

const ToggleText = styled.p`
    color: ${({ theme }) => theme.textLight};
    font-size: 0.95rem;
    margin-top: 15px;
    transition: color var(--transition-speed);

    span {
        color: ${({ theme }) => theme.primaryColor}; /* Consistent primary color for links */
        cursor: pointer;
        font-weight: bold;
        &:hover {
            text-decoration: underline;
        }
    }
`;

const Message = styled.div`
    padding: 10px 15px;
    margin-bottom: 15px;
    border-radius: var(--border-radius-soft);
    font-size: 0.95rem;
    color: white;
    background-color: ${({ $type }) => ($type === 'error' ? '#FF6347' : '#4CAF50')}; /* Red for error, Green for success */
    opacity: ${({ $show }) => ($show ? 1 : 0)};
    transition: opacity 0.3s ease-in-out;
`;


function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' }); // For success/error messages
    const [user, setUser] = useState(null); // State to hold the authenticated user
    const { theme } = useTheme();

    // const navigate = useNavigate(); // Uncomment if you have react-router-dom installed

    // Monitor auth state changes (for redirection or UI updates)
    useEffect(() => {
        // Ensure auth is initialized before setting up listener
        if (!auth) {
            setMessage({ text: "Firebase authentication not available. Please check setup.", type: "error" });
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Update user state
            if (currentUser) {
                // User is signed in.
                console.log("User authenticated:", currentUser.uid);
                setMessage({ text: `Welcome, ${currentUser.email || 'user'}!`, type: "success" });
                // In a real app, you would redirect here:
                // navigate('/mood-journal'); // Uncomment and adjust path as needed
            } else {
                // User is signed out.
                console.log("User signed out or not yet authenticated.");
                setMessage({ text: "", type: "" }); // Clear messages on logout
            }
        });
        return () => unsubscribe(); // Clean up subscription
    }, []); // Empty dependency array means this runs once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' }); // Clear previous messages

        // Check if auth is available before attempting operations
        if (!auth) {
            setMessage({ text: "Firebase authentication not initialized. Cannot proceed.", type: "error" });
            return;
        }

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                setMessage({ text: "Login successful!", type: "success" });
            } else {
                if (password !== confirmPassword) {
                    setMessage({ text: "Passwords do not match!", type: "error" });
                    return;
                }
                await createUserWithEmailAndPassword(auth, email, password);
                setMessage({ text: "Registration successful!", type: "success" });
            }
            // Clear form fields after successful operation
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Authentication error:", error);
            let errorMessage = "An unknown error occurred.";
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This user account has been disabled.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No user found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = 'This email is already registered.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters.';
                    break;
                default:
                    errorMessage = error.message;
                    break;
            }
            setMessage({ text: errorMessage, type: "error" });
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setMessage({ text: "Logged out successfully!", type: "success" });
            // Optionally redirect after logout
            // navigate('/'); // Redirect to home or login page
        } catch (error) {
            console.error("Logout error:", error);
            setMessage({ text: "Failed to log out. Please try again.", type: "error" });
        }
    };

    return (
        <AuthContainer theme={theme}>
            <AuthBox theme={theme}>
                <Title theme={theme}>{isLogin ? 'Welcome Back!' : 'Join Elumia'}</Title>
                <Message $show={!!message.text} $type={message.type}>
                    {message.text}
                </Message>
                {!user ? ( // Show login/register form if no user is authenticated
                    <Form onSubmit={handleSubmit}>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            theme={theme}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            theme={theme}
                        />
                        {!isLogin && (
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                theme={theme}
                            />
                        )}
                        <SubmitButton type="submit" theme={theme}>
                            {isLogin ? 'Login' : 'Register'}
                        </SubmitButton>
                    </Form>
                ) : ( // Show user info and logout button if user is authenticated
                    <>
                        <p style={{ color: theme.text, fontSize: '1.1rem', marginBottom: '20px' }}>
                            You are logged in as <span style={{ fontWeight: 'bold', color: theme.primaryColor }}>{user.email}</span>.
                        </p>
                        <LogoutButton onClick={handleLogout} theme={theme}>
                            Logout
                        </LogoutButton>
                    </>
                )}
                
                {!user && ( // Only show toggle text if no user is authenticated
                    <ToggleText theme={theme}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Register' : 'Login'}
                        </span>
                    </ToggleText>
                )}
            </AuthBox>
        </AuthContainer>
    );
}

export default AuthPage;