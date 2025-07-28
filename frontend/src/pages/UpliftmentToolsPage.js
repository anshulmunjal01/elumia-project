// frontend/src/pages/UpliftmentToolsPage.js
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme

const PageContainer = styled.div`
    padding: 40px;
    text-align: center;
    background-color: ${({ theme }) => theme.background}; /* Use theme background */
    min-height: 100%; /* Changed from calc(100vh - 120px) to 100% to fill parent */
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

function UpliftmentToolsPage() {
    const { theme } = useTheme(); // Access theme for consistency
    return (
        <PageContainer theme={theme}> {/* Pass theme to PageContainer */}
            <ContentBox theme={theme}> {/* Pass theme to ContentBox */}
                <h1>Upliftment Tools</h1>
                <p>Discover music, videos, meditations, and more to boost your mood.</p>
                {/* Add sections for music, videos, articles etc. later */}
                {/* Example: <h2>Music Recommendations</h2> */}
                {/* Example: <h2>Guided Meditations</h2> */}
            </ContentBox>
        </PageContainer>
    );
}

export default UpliftmentToolsPage;