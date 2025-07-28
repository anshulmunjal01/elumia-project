// frontend/src/components/layout/SettingsSidebar.js
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
// Added FaCog to the import list
import { FaUserCircle, FaLock, FaLifeRing, FaTimes, FaSun, FaMoon, FaChartBar, FaTachometerAlt, FaCog } from 'react-icons/fa'; // FaCog added here

// Keyframes for slide in/out animation
const slideIn = keyframes`
    from { transform: translateX(100%); opacity: 0.8; }
    to { transform: translateX(0%); opacity: 1; }
`;

const slideOut = keyframes`
    from { transform: translateX(0%); opacity: 1; }
    to { transform: translateX(100%); opacity: 0.8; }
`;

const SidebarOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7); /* Slightly darker overlay */
    z-index: 1100; /* Higher than header and main content */
    display: flex;
    justify-content: flex-end; /* Push sidebar to the right */
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

const SidebarContainer = styled.div`
    width: 320px; /* Slightly wider for a more substantial feel */
    max-width: 85%; /* Max width for smaller screens */
    height: 100%;
    background: ${({ theme }) => theme.cardBackground}; /* Use card background for a consistent, clean base */
    box-shadow: -8px 0 20px rgba(0,0,0,0.3); /* Softer, deeper shadow */
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0%' : '100%')});
    animation: ${({ $isOpen }) => ($isOpen ? slideIn : slideOut)} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; /* Smoother animation curve */
    padding: 40px 25px; /* Increased padding for more breathing room */
    display: flex;
    flex-direction: column;
    gap: 15px; /* Reduced gap slightly for a more cohesive look */
    position: relative;
    overflow-y: auto; /* Allow scrolling if content overflows */

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.inputBackground};
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.buttonSecondaryText};
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.primaryColor};
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 25px; /* Adjusted position */
    right: 25px; /* Adjusted position */
    background: none;
    border: none;
    font-size: 2rem; /* Slightly larger icon */
    color: ${({ theme }) => theme.textLight};
    cursor: pointer;
    transition: color 0.2s ease, transform 0.2s ease;
    padding: 5px; /* Add padding for easier clicking */
    border-radius: 50%; /* Make it round */

    &:hover {
        color: ${({ theme }) => theme.primaryColor};
        transform: scale(1.1) rotate(90deg); /* Subtle rotation on hover */
        background-color: ${({ theme }) => theme.inputBackground}; /* Light background on hover */
    }
`;

const SidebarTitle = styled.h2`
    font-size: 2.5rem; /* Larger, more impactful title */
    color: ${({ theme }) => theme.text};
    margin-bottom: 25px; /* More space below title */
    padding-bottom: 15px; /* Padding for the border */
    border-bottom: 1px solid ${({ theme }) => theme.journalBorder}; /* Subtle separator */
    display: flex;
    align-items: center;
    gap: 12px; /* Space between icon and text */
    font-weight: 700; /* Bolder title */

    svg {
        font-size: 2.2rem; /* Icon size matching title */
        color: ${({ theme }) => theme.primaryColor}; /* Highlight icon with primary color */
    }
`;

const SidebarNavLink = styled(NavLink)`
    display: flex;
    align-items: center;
    gap: 18px; /* Increased gap for better visual separation */
    padding: 16px 20px; /* More generous padding */
    border-radius: var(--border-radius-soft); /* Rounded corners for links */
    background-color: transparent;
    color: ${({ theme }) => theme.text};
    font-size: 1.15rem; /* Slightly larger font */
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease; /* Smooth transition for all properties */
    position: relative; /* For the active indicator */

    &:hover {
        background-color: ${({ theme }) => theme.primaryColor}1A; /* Subtle primary color background on hover */
        color: ${({ theme }) => theme.primaryColor};
        transform: translateX(8px); /* More pronounced slide effect */
        box-shadow: 0 4px 10px rgba(0,0,0,0.1); /* Soft shadow on hover */
    }

    &.active {
        background: ${({ theme }) => theme.primaryGradient}; /* Gradient background for active link */
        color: white; /* White text for active link */
        font-weight: 600;
        box-shadow: ${({ theme }) => theme.shadowMedium}; /* Stronger shadow for active */
        transform: translateX(5px); /* Slightly less slide than hover */

        svg {
            color: white; /* White icon for active link */
        }
    }

    svg {
        font-size: 1.6rem; /* Consistent icon size */
        color: ${({ theme }) => theme.textLight}; /* Default icon color */
        transition: color 0.3s ease;
    }
`;

const ThemeToggleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px; /* Consistent padding */
    border-radius: var(--border-radius-soft);
    background-color: ${({ theme }) => theme.inputBackground}; /* Use input background */
    margin-top: 20px; /* More space above */
    box-shadow: inset 0 0 8px rgba(0,0,0,0.08); /* Deeper inset shadow */

    span {
        color: ${({ theme }) => theme.text};
        font-size: 1.15rem;
        font-weight: 500;
    }

    button {
        background: none;
        border: none;
        font-size: 1.8rem; /* Larger toggle icon */
        cursor: pointer;
        color: ${({ theme }) => theme.textLight};
        transition: color 0.3s ease, transform 0.3s ease;

        &:hover {
            color: ${({ theme }) => theme.primaryColor};
            transform: scale(1.2) rotate(15deg); /* More dynamic hover effect */
        }
    }
`;

const UserInfoSection = styled.div`
    margin-top: auto; /* Pushes to the bottom */
    padding-top: 30px; /* More space from above */
    border-top: 1px solid ${({ theme }) => theme.journalBorder}; /* Clear separator */
    text-align: center;
    font-size: 0.95rem; /* Slightly larger font */
    color: ${({ theme }) => theme.textLight};

    p {
        margin-bottom: 8px; /* More space between lines */
    }

    span {
        font-weight: bold;
        color: ${({ theme }) => theme.primaryColor}; /* Highlight email with primary color */
        word-break: break-all;
        font-size: 1.05rem; /* Make email slightly larger */
    }
`;

function SettingsSidebar({ isOpen, onClose, userEmail }) {
    const { theme, toggleTheme, themeMode } = useTheme();

    // Prevent clicks inside the sidebar from closing the overlay
    const handleSidebarClick = (e) => {
        e.stopPropagation();
    };

    return (
        <SidebarOverlay $isOpen={isOpen} onClick={onClose}>
            <SidebarContainer $isOpen={isOpen} theme={theme} onClick={handleSidebarClick}>
                <CloseButton onClick={onClose} theme={theme}>
                    <FaTimes />
                </CloseButton>
                <SidebarTitle theme={theme}>
                    <FaCog /> Settings {/* FaCog is now imported */}
                </SidebarTitle>

                <SidebarNavLink to="/profile" onClick={onClose} theme={theme}>
                    <FaUserCircle /> Profile
                </SidebarNavLink>
                {/* Added Dashboard link */}
                <SidebarNavLink to="/dashboard" onClick={onClose} theme={theme}>
                    <FaChartBar /> Dashboard
                </SidebarNavLink>
                <SidebarNavLink to="/auth" onClick={onClose} theme={theme}>
                    <FaLock /> Authorization
                </SidebarNavLink>
                <SidebarNavLink to="/support" onClick={onClose} theme={theme}>
                    <FaLifeRing /> Support
                </SidebarNavLink>

                <ThemeToggleContainer theme={theme}>
                    <span>Theme:</span>
                    <button onClick={toggleTheme}>
                        {themeMode === 'light' ? <FaMoon /> : <FaSun />}
                    </button>
                </ThemeToggleContainer>

                {/* User Info at the bottom */}
                <UserInfoSection theme={theme}>
                    <p>Logged in as:</p>
                    <p><span>{userEmail || 'Guest'}</span></p>
                </UserInfoSection>
            </SidebarContainer>
        </SidebarOverlay>
    );
}

export default SettingsSidebar;