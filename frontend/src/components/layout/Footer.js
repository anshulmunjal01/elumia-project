// frontend/src/components/layout/Footer.js
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

const FooterContainer = styled.footer`
    background: ${({ theme }) => theme.headerBackground};
    backdrop-filter: blur(10px);
    padding: 20px;
    box-shadow: ${({ theme }) => theme.shadowLight};
    text-align: center;
    color: ${({ theme }) => theme.textLight};
    font-size: 0.9rem;
    /* Removed margin-top: auto; as it's now fixed by App.js layout */
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    @media (max-width: 768px) {
        padding: 15px;
    }
`;

// IMPORTANT CHANGE: Accept className prop
function Footer({ className }) {
    const { theme } = useTheme();
    return (
        // IMPORTANT CHANGE: Apply className prop
        <FooterContainer className={className} theme={theme}>
            &copy; {new Date().getFullYear()} Lumira. All rights reserved. | Built with ❤️ for your well-being.
        </FooterContainer>
    );
}

export default Footer;