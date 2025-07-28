// frontend/src/components/ai/SuggestedPrompts.js
import React from 'react';
import styled from 'styled-components';

const PromptsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const PromptButton = styled.button`
  background: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.inputBorder};
  padding: 10px 15px;
  border-radius: var(--border-radius-round);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.cardBackground};
    border-color: ${({ theme }) => theme.buttonSecondaryText};
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const prompts = [
  "How can I practice mindfulness today?",
  "What are some ways to manage stress?",
  "Tell me a positive affirmation.",
  "How can I improve my sleep?",
  "Can you suggest a quick mood boost?",
  "I'm feeling a bit overwhelmed. What should I do?",
];

const SuggestedPrompts = ({ onPromptClick, theme }) => {
  return (
    <PromptsContainer>
      {prompts.map((prompt, index) => (
        <PromptButton key={index} onClick={() => onPromptClick(prompt)} theme={theme}>
          {prompt}
        </PromptButton>
      ))}
    </PromptsContainer>
  );
};

export default SuggestedPrompts;