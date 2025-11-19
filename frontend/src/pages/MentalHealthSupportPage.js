import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme
import { Link } from 'react-router-dom'; // Import Link for navigation

// Keyframe animations for subtle entry effects
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
`;

const PageContainer = styled.div`
    padding: 40px 20px;
    text-align: center;
    background-color: ${({ theme }) => theme.background};
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Align content to the top */
    transition: background-color var(--transition-speed);
    overflow-y: auto; /* Allow scrolling for the page content */
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box; /* Include padding in width */

    @media (max-width: 768px) {
        padding: 20px 15px;
    }
`;

const HeroSection = styled.section`
    margin-bottom: 40px;
    animation: ${fadeIn} 0.8s ease-out forwards;
    width: 100%;
    max-width: 900px; /* Constrain width for better readability */
`;

const PageTitle = styled.h1`
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 15px;
    background-image: ${({ theme }) => theme.primaryGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Subtle shadow for readability */

    @media (max-width: 768px) {
        font-size: 2.5rem;
    }
`;

const PageSubtitle = styled.p`
    font-size: 1.25rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.textLight};
    max-width: 700px;
    margin: 0 auto;

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

const SectionContainer = styled.section`
    background: ${({ theme }) => theme.cardBackground};
    padding: 30px;
    border-radius: ${({ theme }) => theme.borderRadiusSoft};
    box-shadow: ${({ theme }) => theme.shadowMedium};
    margin-bottom: 30px;
    width: 100%;
    max-width: 900px;
    text-align: left;
    animation: ${fadeIn} 0.8s ease-out forwards;
    animation-delay: 0.2s; /* Stagger animation */
    transition: background-color var(--transition-speed), box-shadow var(--transition-speed);

    &:nth-of-type(odd) {
        animation: ${slideInLeft} 0.8s ease-out forwards;
        animation-delay: 0.2s;
    }
    &:nth-of-type(even) {
        animation: ${slideInRight} 0.8s ease-out forwards;
        animation-delay: 0.4s;
    }

    @media (max-width: 768px) {
        padding: 20px;
        margin-bottom: 20px;
    }
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    color: ${({ theme }) => theme.text};
    margin-bottom: 20px;
    text-align: center;
    font-weight: 700;

    @media (max-width: 768px) {
        font-size: 1.5rem;
        margin-bottom: 15px;
    }
`;

const SectionDescription = styled.p`
    font-size: 1rem;
    color: ${({ theme }) => theme.textLight};
    margin-bottom: 25px;
    text-align: center;
    line-height: 1.5;

    @media (max-width: 768px) {
        font-size: 0.9rem;
        margin-bottom: 20px;
    }
`;

const HelplineList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 15px;
    }
`;

const HelplineItem = styled.li`
    background-color: ${({ theme }) => theme.background};
    padding: 15px;
    border-radius: ${({ theme }) => theme.borderRadiusSoft};
    box-shadow: ${({ theme }) => theme.shadowLight};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${({ theme }) => theme.shadowMedium};
    }

    strong {
        color: ${({ theme }) => theme.primaryAccent};
        font-size: 1.1rem;
        margin-bottom: 5px;
    }

    span {
        color: ${({ theme }) => theme.text};
        font-size: 1rem;
    }

    a {
        color: ${({ theme }) => theme.buttonSecondaryText};
        text-decoration: none;
        font-weight: 600;
        margin-top: 10px;
        transition: color 0.2s ease;

        &:hover {
            color: ${({ theme }) => theme.primaryAccent};
        }
    }
`;

const ExternalResourceList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 15px;
    }
`;

const ExternalResourceCard = styled.div`
    background-color: ${({ theme }) => theme.background};
    padding: 20px;
    border-radius: ${({ theme }) => theme.borderRadiusSoft};
    box-shadow: ${({ theme }) => theme.shadowLight};
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${({ theme }) => theme.shadowMedium};
    }

    h3 {
        font-size: 1.2rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 10px;
    }

    p {
        font-size: 0.95rem;
        color: ${({ theme }) => theme.textLight};
        margin-bottom: 15px;
        flex-grow: 1;
    }

    a {
        display: inline-block;
        background-image: ${({ theme }) => theme.buttonPrimaryBg};
        color: ${({ theme }) => theme.buttonPrimaryText};
        padding: 10px 20px;
        border-radius: ${({ theme }) => theme.borderRadiusRound};
        text-decoration: none;
        font-weight: 600;
        transition: opacity 0.2s ease, transform 0.2s ease;

        &:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
    }
`;

// Mock Data (replace with real data from backend later)
const helplines = [
    { name: 'National Suicide Prevention Lifeline', number: '988', description: 'Available 24/7 for crisis support.' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free, 24/7 support for those in crisis.' },
    { name: 'The Trevor Project', number: '1-866-488-7386', description: 'Crisis intervention and suicide prevention for LGBTQ young people.' },
    { name: 'SAMHSA National Helpline', number: '1-800-662-HELP (4357)', description: 'Treatment referral and information service.' },
];

const externalResources = [
    {
        name: 'Psychology Today',
        description: 'Find a therapist, psychiatrist, or support group near you.',
        link: 'https://www.psychologytoday.com/us/therapists',
    },
    {
        name: 'GoodTherapy',
        description: 'Connect with a therapist who is a good fit for you.',
        link: 'https://www.goodtherapy.org/',
    },
    {
        name: 'NAMI (National Alliance on Mental Illness)',
        description: 'Information and support for people affected by mental illness.',
        link: 'https://www.nami.org/',
    },
];

function MentalHealthSupportPage({ isAuthenticated }) {
    const { theme } = useTheme();

    return (
        <PageContainer theme={theme}>
            <HeroSection>
                <PageTitle theme={theme}>Mental Health Support</PageTitle>
                <PageSubtitle theme={theme}>
                    Find resources, helplines, and professional support tailored to your needs. You're not alone on this journey.
                </PageSubtitle>
            </HeroSection>

            {/* Helplines and Crisis Support Section */}
            <SectionContainer theme={theme}>
                <SectionTitle theme={theme}>Helplines & Crisis Support</SectionTitle>
                <SectionDescription theme={theme}>
                    Immediate help is available. These helplines offer confidential support 24/7.
                </SectionDescription>
                <HelplineList>
                    {helplines.map((line, index) => (
                        <HelplineItem key={index} theme={theme}>
                            <strong>{line.name}</strong>
                            <span>{line.number}</span>
                            <p style={{ fontSize: '0.85rem', color: theme.textLight, marginTop: '5px' }}>{line.description}</p>
                            <a href={`tel:${line.number.replace(/\D/g, '')}`}>Call Now</a>
                        </HelplineItem>
                    ))}
                </HelplineList>
            </SectionContainer>

            {/* External Professional Directories Section */}
            <SectionContainer theme={theme}>
                <SectionTitle theme={theme}>External Professional Directories</SectionTitle>
                <SectionDescription theme={theme}>
                    Explore these trusted platforms to find licensed therapists, psychiatrists, and psychologists in your area.
                </SectionDescription>
                <ExternalResourceList>
                    {externalResources.map((resource, index) => (
                        <ExternalResourceCard key={index} theme={theme}>
                            <h3>{resource.name}</h3>
                            <p>{resource.description}</p>
                            <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                Visit Website
                            </a>
                        </ExternalResourceCard>
                    ))}
                </ExternalResourceList>
            </SectionContainer>
            {/* The "Connect with Elumia Professionals" section has been removed as requested. */}
        </PageContainer>
    );
}

export default MentalHealthSupportPage;