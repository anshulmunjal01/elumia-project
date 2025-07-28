// frontend/src/components/ai/ChatInput.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-top: 1px solid ${({ theme }) => theme.inputBorder};
  gap: 10px;
  width: 100%;
`;

const StyledTextarea = styled.textarea`
  flex-grow: 1;
  padding: 12px 15px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: var(--border-radius-soft);
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.inputBackground};
  resize: vertical;
  min-height: 40px;
  max-height: 150px;
  outline: none;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    border-color: ${({ theme }) => theme.buttonSecondaryText};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.focusOutline};
  }
  &::placeholder {
    color: ${({ theme }) => theme.textLight};
  }
`;

const SendButton = styled.button`
  background-color: ${({ theme }) => theme.buttonPrimaryBg};
  color: ${({ theme }) => theme.buttonPrimaryText};
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: ${({ theme }) => theme.shadowLight};
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.buttonSecondaryText};
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

function ChatInput({ onSendMessage, theme }) {
  const [message, setMessage] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleClick = () => {
    onSendMessage(message);
    setMessage('');
  };

  return (
    <InputContainer theme={theme}>
      <StyledTextarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        rows={1}
        theme={theme}
      />
      <SendButton onClick={handleClick} disabled={!message.trim()} theme={theme}>
        <FaPaperPlane />
      </SendButton>
    </InputContainer>
  );
}

export default ChatInput; // <--- MAKE SURE THIS LINE IS PRESENT AND CORRECT