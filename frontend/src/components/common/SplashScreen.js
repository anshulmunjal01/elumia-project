// frontend/src/components/common/SplashScreen.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeInOut = keyframes`
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
`;

const scalePulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const SplashScreenContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%); /* Deep purple gradient */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: 'Inter', sans-serif; /* Assuming Inter font is available */
    z-index: 9999; /* Ensure it's on top of everything */
    animation: ${fadeInOut} 3s ease-in-out forwards; /* Adjust duration as needed */
    pointer-events: none; /* Allow clicks to pass through after animation */
`;

const SplashTitle = styled.h1`
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 20px;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.3);

    @media (max-width: 768px) {
        font-size: 3rem;
    }
    @media (max-width: 480px) {
        font-size: 2.5rem;
    }
`;

const SplashImage = styled.img`
    max-width: 80%;
    height: auto;
    max-height: 400px; /* Limit height for larger screens */
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    animation: ${scalePulse} 2s infinite ease-in-out; /* Subtle pulse for the image */

    @media (max-width: 768px) {
        max-height: 300px;
    }
    @media (max-width: 480px) {
        max-height: 200px;
    }
`;

function SplashScreen() {
    return (
        <SplashScreenContainer>
            <SplashTitle>Welcome to Elumia</SplashTitle>
            <SplashImage
                src="/images/elumialogoextended.jpg" // Path to the extended logo
                alt="Elumia Extended Logo"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/8A2BE2/FFFFFF?text=Elumia+Logo'; }}
            />
        </SplashScreenContainer>
    );
}

export default SplashScreen;