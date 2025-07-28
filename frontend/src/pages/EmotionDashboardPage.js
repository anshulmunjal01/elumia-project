// frontend/src/pages/EmotionDashboardPage.js
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme

const PageContainer = styled.div`
    padding: 40px;
    text-align: center;
    background-color: ${({ theme }) => theme.background}; /* Use theme background */
    min-height: 100%; /* Changed to 100% to fill parent MainContent */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-speed);
`;

const ContentBox = styled.div`
    background: ${({ theme }) => theme.cardBackground}; /* Use theme card background */
    padding: 30px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium}; /* Use theme shadow */
    max-width: 800px;
    width: 100%;
    transition: background var(--transition-speed);
`;

function EmotionDashboardPage() {
    const { theme } = useTheme(); // Access theme
    return (
        <PageContainer theme={theme}> {/* Pass theme to PageContainer */}
            <ContentBox theme={theme}> {/* Pass theme to ContentBox */}
                <h1>Emotion Dashboard</h1>
                <p>Visualize your emotional patterns and insights over time.</p>
                {/* Add charts and data visualizations here later */}
                {/* Example: <canvas id="moodChart"></canvas> */}
                {/* Example: <p>Your most common mood this week: Happy 😊</p> */}
            </ContentBox>
        </PageContainer>
    );
}

export default EmotionDashboardPage;