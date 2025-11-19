// frontend/src/pages/AIHubPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// ===================================
// --- 1. Styled Components Definition --- 
// ===================================
// ALL styled components must be defined here, 
// BEFORE the main AIHubPage component function.

const HubContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: auto; 
    padding: 40px 20px 120px; 
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    box-sizing: border-box;
    transition: background-color 0.3s ease;
`;

const HubContent = styled.div`
    max-width: 1100px;
    width: 100%;
    text-align: center;
`;

const HubHeader = styled.header` // <-- Definition of HubHeader
    margin-bottom: 50px;

    h1 {
        font-size: 3em;
        margin-bottom: 10px;
        color: ${({ theme }) => theme.headerText};
    }

    p {
        font-size: 1.2em;
        color: ${({ theme }) => theme.textLight};
        max-width: 800px;
        margin: 0 auto;
    }
`;

const FeatureCards = styled.div`
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }
`;

const AICard = styled.div` // <-- Definition of AICard
    position: relative;
    background-color: ${({ theme }) => theme.cardBackground};
    border-radius: 16px;
    padding: 40px 30px;
    box-shadow: ${({ theme }) => theme.shadowMedium};
    flex: 1;
    min-width: 300px;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid ${({ theme }) => theme.inputBorder};

    &:hover {
        transform: translateY(-8px);
        box-shadow: ${({ theme }) => theme.shadowStrong};
    }

    h2 {
        font-size: 2em;
        margin-bottom: 10px;
        color: ${({ theme }) => theme.primaryAccent};
    }

    p {
        font-size: 1.1em;
        color: ${({ theme }) => theme.textLight};
        margin-bottom: 30px;
        flex-grow: 1;
    }

    @media (max-width: 768px) {
        width: 100%;
        max-width: 500px;
    }
`;

const CardIcon = styled.div`
    font-size: 3em;
    margin-bottom: 15px;
    color: ${({ theme }) => theme.secondaryAccent};
`;

const ComingSoonBadge = styled.span` // <-- Definition of ComingSoonBadge
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: ${({ theme }) => theme.secondaryAccent};
    color: ${({ theme }) => theme.buttonPrimaryText};
    padding: 6px 15px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 700;
    box-shadow: ${({ theme }) => theme.shadowLight};
    transform: rotate(3deg);
`;

const ButtonLink = styled(Link)`
    display: block;
    width: 100%;
    padding: 15px 25px;
    border-radius: 10px;
    font-size: 1.1em;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.2s ease, opacity 0.2s ease;

    background: ${({ theme }) => theme.buttonPrimaryBg};
    color: ${({ theme }) => theme.buttonPrimaryText};

    &:hover {
        opacity: 0.9;
    }
`;

const DisabledButton = styled.button` // <-- Definition of DisabledButton
    display: block;
    width: 100%;
    padding: 15px 25px;
    border-radius: 10px;
    font-size: 1.1em;
    font-weight: 600;
    cursor: not-allowed;
    text-align: center;
    opacity: 0.5;
    border: 1px solid ${({ theme }) => theme.buttonSecondaryBorder};
    color: ${({ theme }) => theme.buttonSecondaryText};
    background-color: ${({ theme }) => theme.buttonSecondaryBg};
`;

// ===================================
// --- 2. Component Implementation ---
// ===================================

const AIHubPage = () => {
  return (
    <HubContainer>
      <HubContent>
        <HubHeader> {/* <-- Usage of HubHeader */}
          <h1>Explore Lumira AI Features</h1>
          <p>Choose your preferred way to interact with our empathetic AI designed for your wellness journey.</p>
        </HubHeader>

        <FeatureCards>
          {/* Card 1: AI Chat */}
          <AICard> {/* <-- Usage of AICard */}
            <CardIcon>💬</CardIcon>
            <h2>AI Chat</h2>
            <p>Engage in real-time, supportive text conversations with your personalized AI companion.</p>
            <ButtonLink to="/ai">
              Start AI Chat
            </ButtonLink>
          </AICard>

          {/* Card 2: Talk with AI */}
          <AICard> {/* <-- Usage of AICard */}
            <CardIcon>🎙️</CardIcon>
            <h2>Talk with AI</h2>
            <p>Experience hands-free, interactive voice discussions. The future of communication is here.</p>
            <ButtonLink to="https://final-year-project-mental-health.vercel.app/">
              Speak to AI
            </ButtonLink>
          </AICard>
        </FeatureCards>
      </HubContent>
    </HubContainer>
  );
};

export default AIHubPage;