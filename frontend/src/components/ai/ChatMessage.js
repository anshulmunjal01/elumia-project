// frontend/src/components/ai/ChatMessage.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MessageBubble = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  max-width: 70%;
  padding: 12px 18px;
  border-radius: 20px;
  font-size: 1rem;
  line-height: 1.5;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.3s ease-out forwards;

  ${({ sender, theme }) => sender === 'user' && `
    background-color: ${theme.buttonPrimaryBg};
    color: ${theme.buttonPrimaryText};
    align-self: flex-end;
    border-bottom-right-radius: 5px;
  `}

  ${({ sender, theme }) => sender === 'ai' && `
    background-color: ${theme.cardBackground};
    color: ${theme.text};
    align-self: flex-start;
    border-bottom-left-radius: 5px;
  `}
`;

const Avatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: ${({ theme, sender }) => sender === 'ai' ? theme.buttonSecondaryText : '#ccc'};
  color: ${({ theme }) => theme.buttonPrimaryText};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 0.9em;
  flex-shrink: 0;

  ${({ sender }) => sender === 'user' && `order: 2;`}
  ${({ sender }) => sender === 'ai' && `order: 1;`}
`;

const MessageContent = styled.div`
  flex-grow: 1;
`;

function ChatMessage({ message, sender, theme }) {
  const isUser = sender === 'user';
  const avatarText = isUser ? 'You' : 'AI';

  return (
    <MessageBubble sender={sender} theme={theme}>
      <Avatar sender={sender} theme={theme}>{avatarText}</Avatar>
      <MessageContent>{message}</MessageContent>
    </MessageBubble>
  );
}

export default ChatMessage; // <--- MAKE SURE THIS LINE IS PRESENT AND CORRECT