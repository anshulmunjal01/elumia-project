// frontend/src/components/layout/Header.js
import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { FaBars, FaHome, FaRobot, FaBookOpen, FaTools, FaHeartbeat, FaCog } from 'react-icons/fa'; // Import icons

// --- Styled Components ---

const HeaderContainer = styled.header`
    background: ${({ theme }) => theme.headerBackground};
    backdrop-filter: blur(10px);
    padding: 15px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: ${({ theme }) => theme.shadowLight};
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    height: 70px; /* Fixed height for header */
    flex-shrink: 0; /* Prevent shrinking in flex container */

    @media (max-width: 768px) {
        padding: 15px 20px;
        flex-direction: row; /* Keep row for mobile, but adjust spacing */
        justify-content: space-between;
        gap: 0; /* Remove gap for mobile, nav will handle its own spacing */
    }
`;

const Logo = styled(NavLink)`
    font-size: 2rem;
    font-weight: bold;
    color: ${({ theme }) => theme.headerText};
    text-decoration: none;
    display: flex;
    align-items: center;

    img {
        height: 40px; /* Adjust height for header logo */
        margin-right: 10px;
        vertical-align: middle;
    }

    /* Hide text on smaller screens if logo image is sufficient */
    span {
        display: block;
        @media (max-width: 768px) {
            display: none;
        }
    }
`;

const Nav = styled.nav`
    display: flex;
    gap: 30px;

    a {
        font-size: 1.1rem;
        color: ${({ theme }) => theme.headerText};
        text-decoration: none;
        position: relative;
        transition: color var(--transition-speed);
        padding: 5px 0;
        display: flex; /* For icon + text alignment */
        align-items: center;
        gap: 8px; /* Space between icon and text */

        &:hover {
            color: ${({ theme }) => theme.primaryAccent};
        }

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: ${({ theme }) => theme.primaryGradient};
            transition: width 0.3s ease-in-out;
        }

        &:hover::after,
        &.active::after {
            width: 100%;
        }
    }

    @media (max-width: 768px) {
        display: none; /* Hide main nav on small screens, use hamburger or similar */
    }
`;

const SettingsButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.headerText};
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.primaryAccent};
    }

    @media (min-width: 769px) {
        display: none; /* Hide button on larger screens, nav is visible */
    }
`;

const DesktopSettingsButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.headerText};
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 0;
    position: relative;
    transition: color var(--transition-speed);
    font-weight: 500;

    &:hover {
        color: ${({ theme }) => theme.primaryAccent};
    }

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: ${({ theme }) => theme.primaryGradient};
        transition: width 0.3s ease-in-out;
    }

    &:hover::after {
        width: 100%;
    }

    @media (max-width: 768px) {
        display: none; /* Hide on mobile, use hamburger */
    }
`;

// Mobile navigation overlay
const MobileNavOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1050;
    display: flex;
    justify-content: flex-end; /* Push sidebar to right */
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

const MobileNavSidebar = styled.nav`
    width: 250px;
    height: 100%;
    background: ${({ theme }) => theme.cardBackground};
    box-shadow: -5px 0 15px rgba(0,0,0,0.2);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0%' : '100%')});
    transition: transform 0.3s ease-in-out;

    a {
        font-size: 1.2rem;
        color: ${({ theme }) => theme.text};
        text-decoration: none;
        padding: 10px 0;
        border-bottom: 1px solid ${({ theme }) => theme.journalBorder};
        display: flex;
        align-items: center;
        gap: 10px;

        &:hover {
            color: ${({ theme }) => theme.primaryColor};
        }
        &:last-child {
            border-bottom: none;
        }
    }
`;

function Header({ className, toggleSettingsSidebar }) {
    const { theme } = useTheme();
    const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false); // State for mobile nav

    const handleNavLinkClick = () => {
        setIsMobileNavOpen(false); // Close mobile nav on link click
    };

    return (
        <HeaderContainer className={className} theme={theme}>
            <Logo to="/" theme={theme}>
                <img src="/images/elumialogo.png" alt="Elumia Logo" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/8A2BE2/FFFFFF?text=EL'; }} /> {/* Updated logo path */}
                <span>Elumia</span>
            </Logo>
            <Nav>
                <NavLink to="/" end onClick={handleNavLinkClick}><FaHome /> Home</NavLink>
                <NavLink to="/ai" onClick={handleNavLinkClick}><FaRobot /> AI Chat</NavLink>
                <NavLink to="/journal" onClick={handleNavLinkClick}><FaBookOpen /> Journal</NavLink>
                <NavLink to="/upliftment" onClick={handleNavLinkClick}><FaTools /> Tools</NavLink>
                <NavLink to="/wellness" onClick={handleNavLinkClick}><FaHeartbeat /> Wellness</NavLink>
                <DesktopSettingsButton onClick={toggleSettingsSidebar}><FaCog /> Settings</DesktopSettingsButton>
            </Nav>

            <SettingsButton onClick={() => setIsMobileNavOpen(true)} theme={theme}>
                <FaBars />
            </SettingsButton>

            <MobileNavOverlay $isOpen={isMobileNavOpen} onClick={() => setIsMobileNavOpen(false)}>
                <MobileNavSidebar $isOpen={isMobileNavOpen} theme={theme} onClick={(e) => e.stopPropagation()}>
                    <NavLink to="/" end onClick={handleNavLinkClick}><FaHome /> Home</NavLink>
                    <NavLink to="/ai" onClick={handleNavLinkClick}><FaRobot /> AI Chat</NavLink>
                    <NavLink to="/journal" onClick={handleNavLinkClick}><FaBookOpen /> Journal</NavLink>
                    <NavLink to="/upliftment" onClick={handleNavLinkClick}><FaTools /> Tools</NavLink>
                    <NavLink to="/wellness" onClick={handleNavLinkClick}><FaHeartbeat /> Wellness</NavLink>
                    <NavLink to="#" onClick={(e) => { e.preventDefault(); toggleSettingsSidebar(); setIsMobileNavOpen(false); }}><FaCog /> Settings</NavLink>
                </MobileNavSidebar>
            </MobileNavOverlay>
        </HeaderContainer>
    );
}

export default Header;