// frontend/src/components/ai/TypingIndicator.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const TypingBubble = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  padding: 12px 18px;
  border-radius: 20px;
  max-width: fit-content;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  align-self: flex-start;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.textLight};
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }
`;

const TypingIndicator = ({ theme }) => {
  return (
    <TypingBubble theme={theme}>
      <Dot theme={theme} />
      <Dot theme={theme} />
      <Dot theme={theme} />
    </TypingBubble>
  );
};

export default TypingIndicator;