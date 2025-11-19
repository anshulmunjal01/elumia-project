import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const AuthContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
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
    border: 1px solid ${({ theme }) => theme.journalBorder};
`;

const Title = styled.h2`
    color: ${({ theme }) => theme.text};
    margin-bottom: 25px;
    font-size: 2.2rem;
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
        border-color: ${({ theme }) => theme.primaryAccent}; /* Use primaryAccent for focus */
        box-shadow: 0 0 0 3px ${({ theme }) => theme.focusOutline};
    }
    &::placeholder {
        color: ${({ theme }) => theme.journalPlaceholder};
    }
`;

const SubmitButton = styled.button`
    background: ${({ theme }) => theme.primaryGradient};
    color: white;
    padding: 12px 20px;
    border-radius: var(--border-radius-round);
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    border: none;
    box-shadow: ${({ theme }) => theme.shadowSmall};
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
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
    margin-top: 20px;
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
        color: ${({ theme }) => theme.primaryAccent}; /* Changed to primaryAccent for consistency */
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
    background-color: ${({ $type }) => ($type === 'error' ? '#FF6347' : '#4CAF50')};
    opacity: ${({ $show }) => ($show ? 1 : 0)};
    transition: opacity 0.3s ease-in-out;
`;


function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // userType and otherUserType states removed as per request
    const [message, setMessage] = useState({ text: '', type: '' });
    const [user, setUser] = useState(null);
    const { theme } = useTheme();
    const navigate = useNavigate(); // Initialize useNavigate

    // Monitor auth state changes
    useEffect(() => {
        if (!auth) {
            setMessage({ text: "Firebase authentication not available. Please check setup.", type: "error" });
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                console.log("User authenticated:", currentUser.uid);
            } else {
                console.log("User signed out or not yet authenticated.");
                setMessage({ text: "", type: "" }); // Clear message on logout
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' }); // Clear previous messages

        if (!auth) {
            setMessage({ text: "Firebase authentication not initialized. Cannot proceed.", type: "error" });
            return;
        }

        try {
            if (isLogin) {
                // Firebase Login
                await signInWithEmailAndPassword(auth, email, password);
                setMessage({ text: "Login successful!", type: "success" });
            } else {
                // Registration Logic
                if (password !== confirmPassword) {
                    setMessage({ text: "Passwords do not match!", type: "error" });
                    return;
                }

                // 1. Register with Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                const firebaseUid = firebaseUser.uid;

                // 2. Send Firebase UID and email to your backend to save in MongoDB
                // userType and otherUserType are no longer sent from frontend
                const idToken = await firebaseUser.getIdToken();
                const backendResponse = await fetch('http://localhost:5000/api/auth/register-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify({
                        firebaseUid: firebaseUid,
                        email: email,
                        // userType and otherUserType are now handled by backend default
                    }),
                });

                if (!backendResponse.ok) {
                    const errorData = await backendResponse.json();
                    throw new Error(errorData.msg || 'Failed to save user profile to backend.');
                }

                setMessage({ text: "Registration successful! Welcome to Elumia.", type: "success" });
                // Clear form fields after successful operation
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            console.error("Authentication error:", error);
            let errorMessage = "An unknown error occurred.";

            if (error.code && error.code.startsWith('auth/')) {
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
                        errorMessage = 'This email is already registered with Firebase.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password should be at least 6 characters.';
                        break;
                    default:
                        errorMessage = error.message;
                        break;
                }
            } else {
                errorMessage = error.message;
            }
            setMessage({ text: errorMessage, type: "error" });
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setMessage({ text: "Logged out successfully!", type: "success" });
            navigate('/'); // Redirect to home after logout
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
                        {!isLogin && ( // This block is only visible during registration
                            <>
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    theme={theme}
                                />
                                {/* User type selection removed */}
                            </>
                        )}
                        <SubmitButton type="submit" theme={theme}>
                            {isLogin ? 'Login' : 'Register'}
                        </SubmitButton>
                    </Form>
                ) : ( // Show user info and logout button if user is authenticated
                    <>
                        <p style={{ color: theme.text, fontSize: '1.1rem', marginBottom: '20px' }}>
                            You are logged in as <span style={{ fontWeight: 'bold', color: theme.primaryAccent }}>{user.email}</span>.
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