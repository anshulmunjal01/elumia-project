// frontend/src/pages/MentalHealthSupportPage.js
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

function MentalHealthSupportPage() {
    const { theme } = useTheme(); // Access theme
    return (
        <PageContainer theme={theme}> {/* Pass theme to PageContainer */}
            <ContentBox theme={theme}> {/* Pass theme to ContentBox */}
                <h1>Mental Health Support</h1>
                <p>Find resources, helplines, and professional support.</p>
                {/* Add links to resources, therapist directories etc. later */}
                {/* Example: <h2>Emergency Hotlines</h2> */}
                {/* Example: <p>Find a therapist near you.</p> */}
            </ContentBox>
        </PageContainer>
    );
}

export default MentalHealthSupportPage;