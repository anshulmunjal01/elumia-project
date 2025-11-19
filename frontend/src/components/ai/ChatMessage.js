import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

const MessageBubble = styled.div`
    display: flex;
    align-items: flex-end; /* Align avatar and message content at the bottom */
    gap: 10px;
    max-width: 70%;
    padding: 12px 18px;
    border-radius: 20px;
    font-size: 1rem;
    line-height: 1.5;
    word-wrap: break-word;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    animation: ${fadeIn} 0.3s ease-out forwards;
    transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease; /* Ensure transitions are smooth */

    ${({ sender, theme }) => sender === 'user' && `
        background-color: ${theme.userMessageBg}; /* Use theme property for user message background */
        color: ${theme.userMessageText}; /* Use theme property for user message text */
        align-self: flex-end; /* Align user messages to the right */
        border-bottom-right-radius: 5px; /* Adjust border radius for user messages */
    `}

    ${({ sender, theme }) => sender === 'ai' && `
        background-color: ${theme.aiMessageBg}; /* Use theme property for AI message background */
        color: ${theme.aiMessageText}; /* Use theme property for AI message text */
        align-self: flex-start; /* Align AI messages to the left */
        border-bottom-left-radius: 5px; /* Adjust border radius for AI messages */
    `}
`;

const Avatar = styled.div`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: ${({ theme, sender }) => sender === 'ai' ? theme.buttonSecondaryText : theme.userAvatarBg}; /* Use theme property for user avatar background */
    color: ${({ theme }) => theme.buttonPrimaryText}; /* Text color for avatars */
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 0.9em;
    flex-shrink: 0; /* Prevent avatar from shrinking */

    ${({ sender }) => sender === 'user' && `order: 2;`} /* Order for user avatar */
    ${({ sender }) => sender === 'ai' && `order: 1;`} /* Order for AI avatar */
`;

const MessageContent = styled.div`
    flex-grow: 1; /* Allow message content to take available space */
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

export default ChatMessage;
