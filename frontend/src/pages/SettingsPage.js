// frontend/src/pages/SettingsPage.js
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
    max-width: 600px;
    width: 100%;
    transition: background var(--transition-speed);
`;

function SettingsPage() {
    const { theme } = useTheme(); // Access theme for consistency
    return (
        <PageContainer theme={theme}> {/* Pass theme to PageContainer */}
            <ContentBox theme={theme}> {/* Pass theme to ContentBox */}
                <h1>Settings</h1>
                <p>Manage your profile, preferences, and app settings here.</p>
                {/* Add actual settings options later */}
                {/* Example: <button>Change Theme</button> */}
                {/* Example: <input type="text" placeholder="Update Username" /> */}
            </ContentBox>
        </PageContainer>
    );
}

export default SettingsPage;