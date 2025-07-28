// frontend/src/pages/AIPage.js
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom'; // Keep useLocation

import ChatMessage from '../components/ai/ChatMessage';
import TypingIndicator from '../components/ai/TypingIndicator';
import SuggestedPrompts from '../components/ai/SuggestedPrompts';
import AnimatedBackground from '../components/common/AnimatedBackground'; // Ensure this path is correct

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const AIPageContainer = styled.div`
  display: flex;
  flex-direction: column; /* Essential for its children to flex vertically */
  flex-grow: 1; /* Essential for it to fill MainContent's space */
  height: 100%; /* Explicitly take 100% of the available height from MainContent */
  min-height: 0; /* Crucial for flex items to shrink properly */
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  position: relative;
  overflow: hidden; /* Hide overflow from AnimatedBackground */
`;

// Add a styled component for the AnimatedBackground to control its position
const StyledAnimatedBackground = styled(AnimatedBackground)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0; /* Ensure it's behind other content */
    opacity: 0.1; /* Adjust opacity as needed for a subtle effect */
`;


const ChatArea = styled.div`
  flex-grow: 1; /* This is crucial for it to expand and occupy available space */
  padding: 20px;
  overflow-y: auto; /* THIS enables vertical scrolling when content overflows */
  display: flex;
  flex-direction: column; /* Allows its children (messages) to stack vertically */
  gap: 15px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;
  min-height: 0; /* Also crucial for ChatArea itself as a flex item to shrink properly */
  position: relative; /* For z-index context */
  z-index: 1; /* Ensure chat content is above the background */

  /* Custom scrollbar styles */
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

const InitialPromptSection = styled.div`
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  animation: ${slideUp} 0.7s ease-out;
  background-color: ${({ theme }) => theme.cardBackground}; /* Give it a background */
  border-radius: var(--border-radius-soft);
  box-shadow: ${({ theme }) => theme.shadowMedium};
`;

const StyledH2 = styled.h2`
  color: ${({ theme }) => theme.text};
  margin-bottom: 15px;
  font-size: 1.8em;
`;

const NewChatButton = styled.button`
  background: ${({ theme }) => theme.buttonSecondaryText};
  color: ${({ theme }) => theme.buttonPrimaryText};
  padding: 10px 20px;
  border: none;
  border-radius: var(--border-radius-round);
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 15px;
  transition: background 0.3s ease, transform 0.2s;
  &:hover {
    background: ${({ theme }) => theme.buttonPrimaryBg};
    transform: translateY(-2px);
  }
`;


function AIPage({ messages, setMessages, isTyping, setIsTyping, onSendMessage }) {
  const { theme } = useTheme();
  const chatAreaRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Check if there's an initial message from navigation state
    if (location.state?.initialMessage) {
        onSendMessage(location.state.initialMessage);
        // Clear the state so it doesn't trigger again on subsequent renders
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (messages.length === 0) {
        // Only set the default initial message if no messages exist AND no initial state was provided
        setMessages([{
            text: "Hello! I'm Elumia AI, your companion for emotional wellness. How can I help you today?",
            sender: 'ai'
        }]);
    }
    // Dependencies: location.state (for initial message), messages.length (to know if it's truly empty),
    // setMessages, onSendMessage (functions are stable if passed from App.js via useCallback)
  }, [location.state, messages.length, setMessages, onSendMessage]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]); // Also scroll on typing indicator change

  const handlePromptClick = (promptText) => {
    onSendMessage(promptText);
  };

  const handleNewChat = () => {
    setMessages([{
      text: "Hello! I'm Elumia AI, your companion for emotional wellness. How can I help you today?",
      sender: 'ai'
    }]);
    setIsTyping(false);
  };

  return (
    <AIPageContainer theme={theme}>
      <StyledAnimatedBackground /> {/* Place the animated background here */}
      <ChatArea ref={chatAreaRef} theme={theme}>
        {messages.length <= 1 && messages[0]?.sender === 'ai' && !isTyping ? (
          <InitialPromptSection theme={theme}>
            <StyledH2 theme={theme}>Start your conversation with Elumia AI!</StyledH2>
            <p style={{ color: theme.textLight }}>I'm here to listen, support, and help you on your emotional wellness journey.</p>
            <SuggestedPrompts onPromptClick={handlePromptClick} theme={theme} />
            <NewChatButton onClick={handleNewChat} theme={theme}>Start New Chat</NewChatButton>
          </InitialPromptSection>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              key={index}
              message={msg.text}
              sender={msg.sender}
              theme={theme}
            />
          ))
        )}
        {isTyping && <TypingIndicator theme={theme} />}
      </ChatArea>
    </AIPageContainer>
  );
}

export default AIPage;