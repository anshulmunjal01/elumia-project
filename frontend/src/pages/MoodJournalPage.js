// frontend/src/pages/MoodJournalPage.js
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import {
    FaPlus, FaSave, FaEdit, FaTrash,
    FaCalendarAlt, FaRegLightbulb, FaChevronDown,
    FaChevronUp, FaSearch, FaBrain, FaUpload, FaChartLine
} from 'react-icons/fa';
import { GiNotebook } from 'react-icons/gi';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, addDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';

// --- Animations ---
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const slideInRight = keyframes`
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.03); }
    100% { transform: scale(1); }
`;

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
`;

const welcomeFadeOut = keyframes`
    from { opacity: 1; visibility: visible; }
    to { opacity: 0; visibility: hidden; }
`;

const welcomeSlideUp = keyframes`
    from { transform: translateY(0); }
    to { transform: translateY(-100%); }
`;

const initialFadeIn = keyframes`
    from { opacity: 0; visibility: hidden; }
    to { opacity: 1; visibility: visible; }
`;


// --- Styled Components ---

const SectionTitle = styled.h2`
    font-size: 2.5rem;
    color: ${({ theme }) => theme.text};
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: center;

    svg {
        color: ${({ theme }) => theme.primaryColor};
    }

    @media (max-width: 768px) {
        font-size: 2rem;
        gap: 10px;
    }
`;

const SectionDescription = styled.p`
    font-size: 1.1rem;
    color: ${({ theme }) => theme.textLight};
    margin-bottom: 30px;
    max-width: 700px;
    line-height: 1.6;
`;

const PageContainer = styled.div`
    display: flex;
    flex-direction: row;
    background-color: ${({ theme }) => theme.background};
    min-height: calc(100vh - 70px - 60px);
    transition: background-color var(--transition-speed);
    overflow: hidden;
`;

const WelcomeOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.primaryGradient};
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 700;
    z-index: 2000;
    animation: ${css`${initialFadeIn} 0.5s ease-out forwards, ${welcomeFadeOut} 1.5s ease-out 2.5s forwards, ${welcomeSlideUp} 1s ease-out 3s forwards`};
    opacity: 0;
    visibility: hidden;
    
    p {
        margin-top: 20px;
        font-size: 1.2rem;
        font-style: italic;
        opacity: 0;
        animation: ${css`${fadeIn} 1s ease-out 1s forwards`};
    }

    svg {
        font-size: 5rem;
        animation: ${css`${pulse} 2s infinite`};
    }
`;

const Sidebar = styled.nav`
    width: 250px;
    background-color: ${({ theme }) => theme.cardBackground};
    padding: 30px 20px;
    box-shadow: ${({ theme }) => theme.shadowLight};
    display: flex;
    flex-direction: column;
    gap: 15px;
    border-right: 1px solid ${({ theme }) => theme.journalBorder};
    flex-shrink: 0;
    overflow-y: auto;
    animation: ${css`${slideInRight} 0.5s ease-out`};

    @media (max-width: 900px) {
        width: 200px;
        padding: 20px 15px;
    }

    @media (max-width: 768px) {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding: 0;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 1500;
        border-right: none;
        border-top: 1px solid ${({ theme }) => theme.journalBorder};
        background-color: ${({ theme }) => theme.cardBackground};
    }
`;

const SidebarItem = styled.button`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px 15px;
    border-radius: var(--border-radius-soft);
    background-color: ${({ $active, theme }) => $active ? theme.primaryColor + '1A' : 'transparent'};
    color: ${({ $active, theme }) => $active ? theme.primaryColor : theme.text};
    font-size: 1.1rem;
    font-weight: ${({ $active }) => ($active ? '600' : '500')};
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: ${({ theme }) => theme.primaryColor}0D;
        transform: translateX(5px);
    }

    svg {
        font-size: 1.3rem;
        color: ${({ $active, theme }) => ($active ? theme.primaryColor : theme.textLight)};
        transition: color 0.2s ease;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 5px;
        padding: 8px 5px;
        font-size: 0.75rem;
        min-width: 60px;
        &:hover {
            transform: none;
        }
        svg {
            font-size: 1.1rem;
        }
    }
`;

const MainJournalContent = styled.div`
    flex-grow: 1;
    padding: 40px 20px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;

    @media (max-width: 768px) {
        padding: 20px 15px;
        padding-bottom: 80px;
    }

    &::-webkit-scrollbar {
        width: 8px;
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
        background: ${({ theme }) => theme.primaryGradient};
    }
`;

const SectionWrapper = styled.section`
    margin-bottom: 60px;
    padding: 20px;
    border-radius: var(--border-radius-soft);
    background-color: ${({ theme }) => theme.cardBackground};
    box-shadow: ${({ theme }) => theme.shadowMedium};
    animation: ${css`${fadeIn} 0.8s ease-out`};

    &:last-child {
        margin-bottom: 0;
    }

    @media (max-width: 768px) {
        margin-bottom: 40px;
        padding: 15px;
    }
`;

const JournalEntryBox = styled.div`
    background: ${({ theme }) => theme.cardBackground};
    padding: 40px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    transition: background var(--transition-speed);
    display: flex;
    flex-direction: column;
    gap: 25px;
    border: 1px solid ${({ theme }) => theme.journalBorder};
    animation: ${css`${fadeIn} 0.8s ease-out`};

    @media (max-width: 768px) {
        padding: 25px;
        gap: 20px;
    }
`;

const JournalTextArea = styled.textarea`
    width: 100%;
    min-height: 200px;
    padding: 15px;
    border: 1px solid ${({ theme }) => theme.journalBorder};
    border-radius: var(--border-radius-soft);
    font-size: 1.1rem;
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.journalEntryBg};
    resize: vertical;
    font-family: 'Inter', sans-serif;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primaryColor};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.focusOutline};
    }
    &::placeholder {
        color: ${({ theme }) => theme.journalPlaceholder};
    }
`;

const MoodSelectorContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
`;

const MoodButton = styled.button`
    padding: 10px 15px;
    border-radius: var(--border-radius-round);
    border: 1px solid ${({ theme }) => theme.journalBorder};
    background-color: ${({ $selected, theme }) => ($selected ? theme.primaryColor + '1A' : theme.background)};
    color: ${({ $selected, theme }) => ($selected ? theme.primaryColor : theme.text)};
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    animation: ${({ $selected }) => ($selected ? css`${pulse} 1s infinite ease-in-out` : 'none')};

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    span {
        margin-right: 5px;
    }
`;

const MoodSliderContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
    margin-bottom: 20px;

    label {
        font-size: 1rem;
        color: ${({ theme }) => theme.text};
        font-weight: 600;
    }

    input[type="range"] {
        width: 80%;
        -webkit-appearance: none;
        height: 8px;
        background: ${({ theme }) => theme.moodSliderTrack};
        outline: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.2s ease;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${({ theme }) => theme.moodSliderThumb};
            cursor: grab;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            margin-top: -6px;
        }
        &::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${({ theme }) => theme.moodSliderThumb};
            cursor: grab;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
    }
    .slider-value {
        font-size: 1.1rem;
        color: ${({ theme }) => theme.primaryColor};
        font-weight: 700;
    }
`;

const TagsInputContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    border: 1px solid ${({ theme }) => theme.journalBorder};
    border-radius: var(--border-radius-soft);
    padding: 10px;
    background-color: ${({ theme }) => theme.journalEntryBg};

    input {
        flex-grow: 1;
        border: none;
        outline: none;
        background: transparent;
        font-size: 1rem;
        color: ${({ theme }) => theme.text};
        padding: 5px 0;
        min-width: 100px;
        &::placeholder {
            color: ${({ theme }) => theme.journalPlaceholder};
        }
    }
`;

const Tag = styled.span`
    display: inline-flex;
    align-items: center;
    background-color: ${({ theme }) => theme.primaryColor}1A;
    color: ${({ theme }) => theme.primaryColor};
    padding: 6px 10px;
    border-radius: var(--border-radius-round);
    font-size: 0.9rem;

    button {
        background: none;
        border: none;
        color: ${({ theme }) => theme.primaryColor};
        font-size: 0.9rem;
        margin-left: 8px;
        cursor: pointer;
        transition: color 0.2s ease;
        &:hover {
            color: ${({ theme }) => theme.primaryColor}CC;
        }
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 20px;

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const PrimaryJournalButton = styled.button`
    padding: 12px 25px;
    border-radius: var(--border-radius-round);
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    color: white;
    background: ${({ theme }) => theme.primaryGradient};
    border: none;
    box-shadow: ${({ theme }) => theme.shadowSmall};
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 600px) {
        width: 100%;
    }
`;

const SecondaryJournalButton = styled.button`
    padding: 12px 25px;
    border-radius: var(--border-radius-round);
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    color: ${({ theme }) => theme.buttonSecondaryText};
    background: transparent;
    border: 2px solid ${({ theme }) => theme.buttonSecondaryBorder};
    transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;

    &:hover {
        background: ${({ theme }) => theme.buttonSecondaryBg};
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 600px) {
        width: 100%;
    }
`;

const EntriesListContainer = styled.div`
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 40px;
`;

const JournalEntryCard = styled.div`
    background: ${({ theme }) => theme.cardBackground};
    padding: 25px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowSmall};
    text-align: left;
    border: 1px solid ${({ theme }) => theme.journalBorder};
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    animation: ${css`${slideInRight} 0.5s ease-out forwards`};
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: ${({ theme }) => theme.shadowMedium};
    }

    h3 {
        font-size: 1.3rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .entry-date {
        font-size: 0.9rem;
        color: ${({ theme }) => theme.textLight};
        margin-bottom: 10px;
    }

    .entry-content {
        font-size: 1rem;
        color: ${({ theme }) => theme.text};
        line-height: 1.6;
        white-space: pre-wrap;
        margin-bottom: 15px;
        max-height: ${({ $expanded }) => ($expanded ? 'none' : '100px')};
        overflow: hidden;
        position: relative;
        
        ${({ $expanded, theme }) => !$expanded && css`
            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 50px;
                background: linear-gradient(to top, ${theme.cardBackground}, transparent);
            }
        `}
    }

    .read-more-button {
        background: none;
        border: none;
        color: ${({ theme }) => theme.primaryColor};
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        margin-top: 5px;
        display: block;
        text-align: right;
        transition: color 0.2s ease;
        &:hover {
            color: ${({ theme }) => theme.primaryAccent};
        }
    }

    .entry-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
    }
    .entry-tags .tag {
        background-color: ${({ theme }) => theme.primaryColor}1A;
        color: ${({ theme }) => theme.primaryColor};
        padding: 5px 10px;
        border-radius: var(--border-radius-round);
        font-size: 0.85rem;
    }

    .entry-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 15px;
    }
    .entry-actions button {
        background: none;
        border: none;
        color: ${({ theme }) => theme.primaryColor};
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: opacity 0.2s ease;
        &:hover {
            opacity: 0.7;
        }
    }

    .drawing-preview {
        max-width: 100%;
        height: auto;
        border-radius: var(--border-radius-soft);
        border: 1px solid ${({ theme }) => theme.journalBorder};
        margin-top: 10px;
    }
`;

const EmptyState = styled.div`
    padding: 50px;
    color: ${({ theme }) => theme.textLight};
    font-size: 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    svg {
        font-size: 3rem;
        color: ${({ theme }) => theme.primaryColor};
    }
`;

const MessageOfTheUniverseContainer = styled.div`
    background: ${({ theme }) => theme.primaryGradient};
    color: ${({ theme }) => theme.text};
    padding: 30px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    max-width: 700px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    text-align: center;
    animation: ${css`${fadeIn} 1s ease-out`};

    h3 {
        font-size: 1.8rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 10px;
    }
    p {
        font-size: 1.1rem;
        line-height: 1.5;
        font-style: italic;
        color: ${({ theme }) => theme.text};
    }
    span.icon {
        font-size: 3rem;
        color: ${({ theme }) => theme.text};
    }
`;

const MoodCalendarWrapper = styled.div`
    background: ${({ theme }) => theme.cardBackground};
    padding: 30px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    transition: background var(--transition-speed);

    h3 {
        font-size: 1.8rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 15px;
        display: flex;
    }
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    width: 100%;
`;

const CalendarDay = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 5px;
    border-radius: 5px;
    background-color: ${({ $hasEntry, theme }) => ($hasEntry ? theme.primaryColor + '30' : theme.background)};
    border: 1px solid ${({ $hasEntry, theme }) => ($hasEntry ? theme.primaryColor : theme.journalBorder)};
    color: ${({ theme }) => theme.text};
    font-size: 0.9rem;
    cursor: ${({ $hasEntry }) => ($hasEntry ? 'pointer' : 'default')};
    transition: all 0.2s ease;

    &:hover {
        ${({ $hasEntry }) => $hasEntry && css`
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        `}
    }

    .day-number {
        font-weight: 600;
        margin-bottom: 5px;
    }
    .mood-emoji {
        font-size: 1.5rem;
    }
`;

const DailyPromptContainer = styled.div`
    background: ${({ theme }) => theme.cardBackground};
    padding: 30px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    max-width: 700px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    text-align: center;
    animation: ${css`${fadeIn} 1s ease-out`};

    h3 {
        font-size: 1.8rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        svg {
            color: ${({ theme }) => theme.primaryColor};
        }
    }
    p {
        font-size: 1.1rem;
        line-height: 1.5;
        font-style: italic;
        color: ${({ theme }) => theme.textLight};
    }
    button {
        background: ${({ theme }) => theme.primaryGradient};
        color: white;
        padding: 10px 20px;
        border-radius: var(--border-radius-round);
        border: none;
        cursor: pointer;
        transition: transform 0.2s ease;
        &:hover {
            transform: translateY(-2px);
        }
    }
`;

const MemoryLaneContainer = styled.div`
    background: ${({ theme }) => theme.cardBackground};
    padding: 30px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    transition: background var(--transition-speed);

    h3 {
        font-size: 1.8rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        svg {
            color: ${({ theme }) => theme.primaryColor};
        }
    }

    .memory-card {
        background: ${({ theme }) => theme.background};
        padding: 20px;
        border-radius: var(--border-radius-soft);
        border: 1px solid ${({ theme }) => theme.journalBorder};
        width: 100%;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 10px;
        animation: ${css`${float} 3s ease-in-out infinite`};
        
        p {
            font-size: 1rem;
            color: ${({ theme }) => theme.text};
            line-height: 1.5;
        }
        img {
            max-width: 100%;
            height: auto;
            border-radius: var(--border-radius-soft);
            margin-top: 10px;
        }
        .memory-date {
            font-size: 0.85rem;
            color: ${({ theme }) => theme.textLight};
            text-align: right;
        }
    }
`;

const JournalStatsContainer = styled.div`
    background: ${({ theme }) => theme.cardBackground};
    padding: 30px;
    border-radius: var(--border-radius-soft);
    box-shadow: ${({ theme }) => theme.shadowMedium};
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    transition: background var(--transition-speed);

    h3 {
        font-size: 1.8rem;
        color: ${({ theme }) => theme.text};
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        svg {
            color: ${({ theme }) => theme.primaryColor};
        }
    }

    .stat-item {
        font-size: 1.1rem;
        color: ${({ theme }) => theme.text};
        font-weight: 500;
        span {
            font-weight: 700;
            color: ${({ theme }) => theme.primaryColor};
            margin-left: 5px;
        }
    }
`;

const UnauthenticatedContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: ${({ theme }) => theme.text};
    padding: 20px;
    max-width: 800px;
    margin: auto;
    height: 100%;

    h1 {
        font-size: 3rem;
        color: ${({ theme }) => theme.primaryColor};
        margin-bottom: 20px;
        animation: ${css`${pulse} 2s infinite`};
    }

    p {
        font-size: 1.5rem;
        font-style: italic;
        margin-bottom: 30px;
        max-width: 600px;
        line-height: 1.6;
        animation: ${css`${fadeIn} 1s ease-out`};
    }

    .auth-cta {
        font-size: 1.2rem;
        margin-top: 20px;
        color: ${({ theme }) => theme.textLight};
    }

    .user-id-display {
        margin-top: 20px;
        font-size: 0.9rem;
        color: ${({ theme }) => theme.textLight};
        .id-value {
            font-family: 'monospace';
            background-color: ${({ theme }) => theme.cardBackground};
            padding: 5px 10px;
            border-radius: 5px;
            word-break: break-all;
            display: inline-block;
            margin-top: 5px;
        }
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 15px;
    border: 1px solid ${({ theme }) => theme.journalBorder};
    border-radius: var(--border-radius-soft);
    font-size: 1rem;
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.journalEntryBg};
    transition: all 0.3s ease;
    margin-bottom: 10px;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primaryColor};
        box-shadow: 0 0 0 3px ${({ theme }) => theme.focusOutline};
    }
    &::placeholder {
        color: ${({ theme }) => theme.journalPlaceholder};
    }
`;

const PictureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
    width: 100%;
    margin-top: 20px;
`;

const PictureCard = styled.div`
    background: ${({ theme }) => theme.background};
    border: 1px solid ${({ theme }) => theme.journalBorder};
    border-radius: var(--border-radius-soft);
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadowSmall};
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-3px);
    }

    img {
        width: 100%;
        height: 150px;
        object-fit: cover;
        display: block;
    }

    .picture-info {
        width: 100%;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        color: ${({ theme }) => theme.textLight};

        span {
            font-weight: 600;
            color: ${({ theme }) => theme.text};
        }

        button {
            background: none;
            border: none;
            color: ${({ theme }) => theme.primaryColor};
            cursor: pointer;
            font-size: 1rem;
            &:hover {
                opacity: 0.7;
            }
        }
    }
`;

const FileInputLabel = styled.label`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 25px;
    border-radius: var(--border-radius-round);
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.buttonSecondaryText};
    background: transparent;
    border: 2px solid ${({ theme }) => theme.buttonSecondaryBorder};
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
    margin-bottom: 10px;

    &:hover {
        background: ${({ theme }) => theme.buttonSecondaryBg};
        transform: translateY(-2px);
    }

    input[type="file"] {
        display: none;
    }
`;


// Dummy data for "Message from the Universe" (replace with API call)
const universeMessages = [
    "The universe whispers, 'You are exactly where you need to be.'",
    "A gentle reminder from the stars: 'Your strength is greater than your struggles.'",
    "From the cosmic ocean: 'Every challenge is a veiled opportunity for growth.'",
    "The cosmos reminds you: 'Your inner peace is your greatest power.'",
    "A message from beyond: 'Embrace the journey, for it shapes your destiny.'",
    "The universe smiles upon you: 'You are capable of achieving all you desire.'",
    "Feel the cosmic energy: 'Let go of what was, embrace what is, and have faith in what will be.'",
    "A celestial thought: 'Your intuition is a compass guiding you through the vastness of life.'",
    "The universe's embrace: 'You are loved, you are worthy, you are enough.'",
    "A cosmic secret: 'The answers you seek are within you, waiting to be discovered.'"
];

// Dummy data for daily prompts (replace with API call)
const dailyPrompts = [
    "What is one small thing that brought you joy today?",
    "Describe a moment when you felt truly at peace.",
    "What challenge did you overcome recently, and what did you learn?",
    "If you could send a message to your past self, what would it be?",
    "What are you grateful for in this moment?",
    "How did you practice self-care today?",
    "What is a dream or goal you're currently nurturing?",
    "Describe a moment when you felt connected to something larger than yourself.",
    "What emotions did you experience today, and what might have caused them?",
    "Write about a person who positively impacted your day."
];

// Mood Emojis Map
const moodEmojis = {
    'Happy': '😊',
    'Sad': '😔',
    'Angry': '😠',
    'Anxious': '�',
    'Calm': '😌',
    'Excited': '🤩',
    'Neutral': '😐',
    'Grateful': '🙏',
    'Energetic': '⚡',
    'Tired': '😴',
    'Stressed': '😩',
    'Hopeful': '✨',
    'Loved': '❤️',
    'Inspired': '💡',
    'Confused': '🤔'
};

function MoodJournalPage() {
    console.log("MoodJournalPage component rendered.");

    const { theme } = useTheme();
    const [activeSection, setActiveSection] = useState('newEntry');
    const sectionRefs = useRef({});

    // State for New Journal Entry
    const [entryContent, setEntryContent] = useState('');
    const [selectedMood, setSelectedMood] = useState('Neutral');
    const [moodRating, setMoodRating] = useState(50);
    const [tags, setTags] = useState([]);
    const [currentTagInput, setCurrentTagInput] = useState('');
    // Removed canvas-related state: drawingData, canvasRef, contextRef, isDrawing, currentColor, brushSize

    // State for Entries List
    const [journalEntries, setJournalEntries] = useState([]);
    const [expandedEntryId, setExpandedEntryId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [app, setApp] = useState(null);
    const [auth, setAuth] = useState(null);
    const [db, setDb] = useState(null);

    // State for Mood Calendar
    const [moodsByDate, setMoodsByDate] = useState({});

    // State for Daily Prompt
    const [currentPrompt, setCurrentPrompt] = useState('');

    // State for Message from the Universe
    const [currentUniverseMessage, setCurrentUniverseMessage] = useState('');

    // State for Memory Lane
    const [aiPrompt, setAiPrompt] = useState('');
    const [generatingImage, setGeneratingImage] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [memories, setMemories] = useState([]);

    const memoizedAppId = useMemo(() => {
        return typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
    }, []);

    const memoizedFirebaseConfig = useMemo(() => {
        return typeof window.__firebase_config !== 'undefined' ? JSON.parse(window.__firebase_config) : {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_FIREBASE_APP_ID,
            measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
        };
    }, []);

    const appId = memoizedAppId;
    const firebaseConfig = memoizedFirebaseConfig;

    const fetchJournalEntries = useCallback(async (currentUserId) => {
        if (!currentUserId || !db) {
            console.log("No user ID or DB available to fetch entries.");
            setJournalEntries([]);
            return;
        }
        try {
            const journalCollectionRef = collection(db, `artifacts/${appId}/users/${currentUserId}/journalEntries`);
            
            const q = query(journalCollectionRef);
            const querySnapshot = await getDocs(q);

            const entries = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            entries.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));

            setJournalEntries(entries);
            console.log("Fetched journal entries:", entries.length);
        } catch (error) {
            console.error("Error fetching journal entries:", error);
        }
    }, [db, appId]);

    const fetchMemories = useCallback(async (currentUserId) => {
        if (!currentUserId || !db) {
            console.log("No user ID or DB available to fetch memories.");
            setMemories([]);
            return;
        }
        try {
            const memoriesCollectionRef = collection(db, `artifacts/${appId}/users/${currentUserId}/memories`);
            const q = query(memoriesCollectionRef);
            const querySnapshot = await getDocs(q);

            const fetchedMemories = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            fetchedMemories.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
            setMemories(fetchedMemories);
            console.log("Fetched memories:", fetchedMemories.length);
        } catch (error) {
            console.error("Error fetching memories:", error);
        }
    }, [db, appId]);

    useEffect(() => {
        if (!app) {
            const initializedApp = initializeApp(firebaseConfig);
            setApp(initializedApp);
            const initializedAuth = getAuth(initializedApp);
            setAuth(initializedAuth);
            setDb(getFirestore(initializedApp));

            const signIn = async () => {
                try {
                    if (typeof window.__initial_auth_token !== 'undefined') {
                        await signInWithCustomToken(initializedAuth, window.__initial_auth_token);
                        console.log("Signed in with custom token.");
                    } else {
                        await signInAnonymously(initializedAuth);
                        console.log("Signed in anonymously.");
                    }
                } catch (error) {
                    console.error("Firebase sign-in failed:", error);
                }
            };
            signIn();
        }

        let unsubscribeAuth;
        if (auth) {
            unsubscribeAuth = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserId(user.uid);
                    console.log("User authenticated in MoodJournalPage:", user.uid);
                    fetchJournalEntries(user.uid);
                    fetchMemories(user.uid);
                } else {
                    setUserId(null);
                    setJournalEntries([]);
                    setMemories([]);
                    console.log("User not authenticated in MoodJournalPage.");
                }
            });
        }

        return () => {
            if (unsubscribeAuth) {
                unsubscribeAuth();
            }
        };
    }, [app, auth, fetchJournalEntries, fetchMemories, firebaseConfig]);

    useEffect(() => {
        if (!userId || !db) return;

        const journalCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journalEntries`);
        const q = query(journalCollectionRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const entries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            entries.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
            setJournalEntries(entries);
            console.log("Real-time update: Fetched journal entries:", entries.length);
        }, (error) => {
            console.error("Error listening to journal entries:", error);
        });

        return () => unsubscribe();
    }, [userId, db, appId]);

    useEffect(() => {
        if (!userId || !db) return;

        const memoriesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/memories`);
        const q = query(memoriesCollectionRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMemories = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            fetchedMemories.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
            setMemories(fetchedMemories);
            console.log("Real-time update: Fetched memories:", fetchedMemories.length);
        }, (error) => {
            console.error("Error listening to memories:", error);
        });

        return () => unsubscribe();
    }, [userId, db, appId]);

    useEffect(() => {
        const newMoodsByDate = {};
        journalEntries.forEach(entry => {
            const date = entry.timestamp ? new Date(entry.timestamp.toDate()).toISOString().split('T')[0] : 'No Date';
            if (!newMoodsByDate[date]) {
                newMoodsByDate[date] = { mood: entry.mood, emoji: moodEmojis[entry.mood] || '😐' };
            }
        });
        setMoodsByDate(newMoodsByDate);
    }, [journalEntries]);

    const generateCalendarDays = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => null);

        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return [...emptyDays, ...days];
    };

    // Removed all canvas drawing logic functions: getCanvasCoordinates, startDrawing, draw, stopDrawing, saveDrawing, clearCanvas

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && currentTagInput.trim() !== '') {
            setTags([...tags, currentTagInput.trim()]);
            setCurrentTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSaveEntry = async () => {
        if (!userId) {
            alert("Please sign in to save your journal entry.");
            return;
        }

        if (!entryContent.trim()) { // Removed drawingData check
            alert("Journal entry cannot be empty!");
            return;
        }

        try {
            const newEntry = {
                content: entryContent,
                mood: selectedMood,
                moodRating: moodRating,
                tags: tags,
                // Removed drawing: drawingData,
                timestamp: new Date(),
                userId: userId
            };

            const journalCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/journalEntries`);
            await addDoc(journalCollectionRef, newEntry);

            alert("Journal entry saved successfully!");
            setEntryContent('');
            setSelectedMood('Neutral');
            setMoodRating(50);
            setTags([]);
            // Removed clearCanvas();
        } catch (error) {
            console.error("Error saving journal entry:", error);
            alert("Failed to save journal entry. Please try again.");
        }
    };

    const handleDeleteEntry = async (id) => {
        if (!userId) {
            alert("Please sign in to delete entries.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                const docRef = doc(db, `artifacts/${appId}/users/${userId}/journalEntries`, id);
                await deleteDoc(docRef);
                alert("Entry deleted successfully!");
            } catch (error) {
                console.error("Error deleting journal entry:", error);
                alert("Failed to delete entry. Please try again.");
            }
        }
    };

    const handleEditEntry = (entry) => {
        setEntryContent(entry.content);
        setSelectedMood(entry.mood);
        setMoodRating(entry.moodRating);
        setTags(entry.tags || []);
        // Removed setDrawingData(entry.drawing || null);
        alert("Edit functionality not fully implemented. Populating form for now.");
    };

    const handleImageUpload = async (event) => {
        if (!userId) {
            alert("Please sign in to upload images.");
            return;
        }
        const file = event.target.files[0];
        if (file) {
            setUploadingImage(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result;
                try {
                    const memoriesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/memories`);
                    await addDoc(memoriesCollectionRef, {
                        imageUrl: base64Image,
                        prompt: "User uploaded image",
                        timestamp: new Date(),
                        userId: userId
                    });
                    alert("Image uploaded successfully!");
                } catch (error) {
                    console.error("Error uploading image:", error);
                    alert("Failed to upload image. Please try again.");
                } finally {
                    setUploadingImage(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateImage = async () => {
        if (!userId) {
            alert("Please sign in to generate images.");
            return;
        }
        if (!aiPrompt.trim()) {
            alert("Please enter a prompt for image generation.");
            return;
        }

        setGeneratingImage(true);
        try {
            const payload = { instances: { prompt: aiPrompt }, parameters: { "sampleCount": 1} };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
                const imageUrl = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
                const memoriesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/memories`);
                await addDoc(memoriesCollectionRef, {
                    imageUrl: imageUrl,
                    prompt: aiPrompt,
                    timestamp: new Date(),
                    userId: userId
                });
                alert("Image generated and saved successfully!");
                setAiPrompt('');
            } else {
                alert("Failed to generate image. Please try a different prompt.");
                console.error("Image generation failed:", result);
            }
        } catch (error) {
            console.error("Error generating image:", error);
            alert("An error occurred during image generation.");
        } finally {
            setGeneratingImage(false);
        }
    };

    const handleDeleteMemory = async (id) => {
        if (!userId) {
            alert("Please sign in to delete memories.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this memory?")) {
            try {
                const docRef = doc(db, `artifacts/${appId}/users/${userId}/memories`, id);
                await deleteDoc(docRef);
                alert("Memory deleted successfully!");
            } catch (error) {
                console.error("Error deleting memory:", error);
                alert("Failed to delete memory. Please try again.");
            }
        }
    };

    const scrollToSection = (sectionId) => {
        const section = sectionRefs.current[sectionId];
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(sectionId);
        }
    };

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * dailyPrompts.length);
        setCurrentPrompt(dailyPrompts[randomIndex]);
    }, []);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * universeMessages.length);
        setCurrentUniverseMessage(universeMessages[randomIndex]);
    }, []);

    if (!userId) {
        return (
            <PageContainer theme={theme}>
                <MainJournalContent>
                    <UnauthenticatedContentWrapper theme={theme}>
                        <h1><GiNotebook /> Mood Journal</h1>
                        <p>Your personal space for reflection, emotional tracking, and self-discovery. Sign in to unlock your journal.</p>
                        <PrimaryJournalButton onClick={() => window.location.href = '/auth'}>
                            Sign In / Register
                        </PrimaryJournalButton>
                        <div className="user-id-display">
                            <p>Current User ID: <span className="id-value">{userId || 'Not Authenticated'}</span></p>
                            <p>App ID: <span className="id-value">{appId}</span></p>
                        </div>
                    </UnauthenticatedContentWrapper>
                </MainJournalContent>
            </PageContainer>
        );
    }

    const today = new Date();
    const currentMonthName = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();

    return (
        <PageContainer theme={theme}>
            <WelcomeOverlay theme={theme}>
                <GiNotebook />
                <p>Welcome to your personal journal!</p>
            </WelcomeOverlay>
            <Sidebar theme={theme}>
                <SidebarItem
                    $active={activeSection === 'newEntry'}
                    onClick={() => scrollToSection('newEntry')}
                    theme={theme}
                >
                    <FaPlus /> New Entry
                </SidebarItem>
                <SidebarItem
                    $active={activeSection === 'entries'}
                    onClick={() => scrollToSection('entries')}
                    theme={theme}
                >
                    <GiNotebook /> My Entries
                </SidebarItem>
                <SidebarItem
                    $active={activeSection === 'calendar'}
                    onClick={() => scrollToSection('calendar')}
                    theme={theme}
                >
                    <FaCalendarAlt /> Mood Calendar
                </SidebarItem>
                <SidebarItem
                    $active={activeSection === 'prompts'}
                    onClick={() => scrollToSection('prompts')}
                    theme={theme}
                >
                    <FaRegLightbulb /> Daily Prompt
                </SidebarItem>
                <SidebarItem
                    $active={activeSection === 'memories'}
                    onClick={() => scrollToSection('memories')}
                    theme={theme}
                >
                    <FaBrain /> Memory Lane
                </SidebarItem>
                <SidebarItem
                    $active={activeSection === 'stats'}
                    onClick={() => scrollToSection('stats')}
                    theme={theme}
                >
                    <FaChartLine /> Journal Stats
                </SidebarItem>
            </Sidebar>

            <MainJournalContent theme={theme}>
                {/* Section: New Journal Entry */}
                <SectionWrapper ref={el => sectionRefs.current['newEntry'] = el} theme={theme}>
                    <SectionTitle theme={theme}>
                        <FaPlus /> New Journal Entry
                    </SectionTitle>
                    <SectionDescription theme={theme}>
                        Capture your thoughts, feelings, and experiences.
                    </SectionDescription>
                    <JournalEntryBox theme={theme}>
                        <JournalTextArea
                            placeholder="What's on your mind today?"
                            value={entryContent}
                            onChange={(e) => setEntryContent(e.target.value)}
                            theme={theme}
                        />

                        {/* Mood Selection */}
                        <MoodSelectorContainer>
                            {Object.entries(moodEmojis).map(([mood, emoji]) => (
                                <MoodButton
                                    key={mood}
                                    $selected={selectedMood === mood}
                                    onClick={() => setSelectedMood(mood)}
                                    theme={theme}
                                >
                                    <span>{emoji}</span> {mood}
                                </MoodButton>
                            ))}
                        </MoodSelectorContainer>

                        {/* Mood Slider */}
                        <MoodSliderContainer theme={theme}>
                            <label htmlFor="mood-slider">Mood Intensity: <span className="slider-value">{moodRating}</span></label>
                            <input
                                type="range"
                                id="mood-slider"
                                min="0"
                                max="100"
                                value={moodRating}
                                onChange={(e) => setMoodRating(parseInt(e.target.value))}
                                theme={theme}
                            />
                        </MoodSliderContainer>

                        {/* Tags Input */}
                        <TagsInputContainer theme={theme}>
                            {tags.map((tag, index) => (
                                <Tag key={index} theme={theme}>
                                    {tag}
                                    <button type="button" onClick={() => handleRemoveTag(tag)}>x</button>
                                </Tag>
                            ))}
                            <input
                                type="text"
                                placeholder="Add tags (e.g., #work, #family, #gratitude)"
                                value={currentTagInput}
                                onChange={(e) => setCurrentTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                theme={theme}
                            />
                        </TagsInputContainer>

                        {/* Removed Drawing Canvas */}

                        <ActionButtons>
                            <PrimaryJournalButton onClick={handleSaveEntry} theme={theme}>
                                <FaSave /> Save Entry
                            </PrimaryJournalButton>
                            <SecondaryJournalButton onClick={() => {
                                setEntryContent('');
                                setSelectedMood('Neutral');
                                setMoodRating(50);
                                setTags([]);
                                // Removed clearCanvas();
                            }} theme={theme}>
                                <FaTrash /> Clear Form
                            </SecondaryJournalButton>
                        </ActionButtons>
                    </JournalEntryBox>
                </SectionWrapper>

                {/* Section: My Entries */}
                <SectionWrapper ref={el => sectionRefs.current['entries'] = el} theme={theme}>
                    <SectionTitle theme={theme}>
                        <GiNotebook /> My Entries
                    </SectionTitle>
                    <SectionDescription theme={theme}>
                        Review and manage your past journal entries.
                    </SectionDescription>
                    <EntriesListContainer>
                        {journalEntries.length > 0 ? (
                            journalEntries.map(entry => (
                                <JournalEntryCard key={entry.id} $expanded={expandedEntryId === entry.id} theme={theme}>
                                    <h3>
                                        {entry.mood} {moodEmojis[entry.mood] || ''}
                                        <div className="entry-actions">
                                            <button onClick={() => handleEditEntry(entry)}><FaEdit /> Edit</button>
                                            <button onClick={() => handleDeleteEntry(entry.id)}><FaTrash /> Delete</button>
                                        </div>
                                    </h3>
                                    <p className="entry-date">
                                        {entry.timestamp ? new Date(entry.timestamp.toDate()).toLocaleString() : 'No Date'}
                                    </p>
                                    <p className="entry-content">
                                        {entry.content}
                                    </p>
                                    {entry.content.length > 100 && (
                                        <button
                                            className="read-more-button"
                                            onClick={() => setExpandedEntryId(expandedEntryId === entry.id ? null : entry.id)}
                                        >
                                            {expandedEntryId === entry.id ? 'Read Less' : 'Read More'}
                                            {expandedEntryId === entry.id ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                    )}
                                    {entry.tags && entry.tags.length > 0 && (
                                        <div className="entry-tags">
                                            {entry.tags.map((tag, idx) => (
                                                <span key={idx} className="tag" theme={theme}>{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    {/* Removed drawing preview */}
                                </JournalEntryCard>
                            ))
                        ) : (
                            <EmptyState theme={theme}>
                                <GiNotebook />
                                <p>No entries yet. Start by creating a new journal entry!</p>
                            </EmptyState>
                        )}
                    </EntriesListContainer>
                </SectionWrapper>

                {/* Section: Mood Calendar */}
                <SectionWrapper ref={el => sectionRefs.current['calendar'] = el} theme={theme}>
                    <SectionTitle theme={theme}>
                        <FaCalendarAlt /> Mood Calendar
                    </SectionTitle>
                    <SectionDescription theme={theme}>
                        Visualize your emotional journey over time.
                    </SectionDescription>
                    <MoodCalendarWrapper theme={theme}>
                        <h3>{currentMonthName} {currentYear} Mood Overview</h3>
                        <CalendarGrid>
                            {/* Weekday headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <CalendarDay key={day} theme={theme}>
                                    <span className="day-number">{day}</span>
                                </CalendarDay>
                            ))}
                            {/* Calendar Days based on entries */}
                            {generateCalendarDays().map((day, index) => {
                                const dateString = day ? `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
                                const entryForDay = moodsByDate[dateString];
                                return (
                                    <CalendarDay key={index} $hasEntry={!!entryForDay} theme={theme}>
                                        <span className="day-number">{day !== null ? day : ''}</span>
                                        {entryForDay && <span className="mood-emoji">{entryForDay.emoji}</span>}
                                    </CalendarDay>
                                );
                            })}
                        </CalendarGrid>
                    </MoodCalendarWrapper>
                </SectionWrapper>

                {/* Section: Daily Prompt */}
                <SectionWrapper ref={el => sectionRefs.current['prompts'] = el} theme={theme}>
                    <SectionTitle theme={theme}>
                        <FaRegLightbulb /> Daily Prompt
                    </SectionTitle>
                    <SectionDescription theme={theme}>
                        Spark your reflection with a thought-provoking question.
                    </SectionDescription>
                    <DailyPromptContainer theme={theme}>
                        <h3>Today's Reflection</h3>
                        <p>{currentPrompt}</p>
                        <PrimaryJournalButton onClick={() => {
                            const randomIndex = Math.floor(Math.random() * dailyPrompts.length);
                            setCurrentPrompt(dailyPrompts[randomIndex]);
                        }} theme={theme}>
                            New Prompt
                        </PrimaryJournalButton>
                    </DailyPromptContainer>
                </SectionWrapper>

                {/* Section: Message from the Universe */}
                <SectionWrapper ref={el => sectionRefs.current['universeMessage'] = el} theme={theme}>
                    <SectionTitle theme={theme}>
                        <FaBrain /> Message from the Universe
                    </SectionTitle>
                    <SectionDescription theme={theme}>
                        Receive a random uplifting message to inspire your day.
                    </SectionDescription>
                    <MessageOfTheUniverseContainer theme={theme}>
                        <span className="icon">✨</span>
                        <p>"{currentUniverseMessage}"</p>
                        <PrimaryJournalButton onClick={() => {
                            const randomIndex = Math.floor(Math.random() * universeMessages.length);
                            setCurrentUniverseMessage(universeMessages[randomIndex]);
                        }} theme={theme}>
                            New Message
                        </PrimaryJournalButton>
                    </MessageOfTheUniverseContainer>
                </SectionWrapper>

                {/* Section: Memory Lane */}
                <SectionWrapper ref={el => sectionRefs.current['memories'] = el} theme={theme}>
                    <SectionTitle theme={theme}>
                        <FaBrain /> Memory Lane
                    </SectionTitle>
                    <SectionDescription theme={theme}>
                        Revisit cherished memories and add new ones via upload or AI generation.
                    </SectionDescription>
                    <MemoryLaneContainer theme={theme}>
                        <h3>Add New Memory</h3>
                        {/* Image Upload */}
                        <FileInputLabel htmlFor="file-upload" theme={theme}>
                            <FaUpload /> Upload Image
                            <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                        </FileInputLabel>
                        {uploadingImage && <p>Uploading image...</p>}

                        {/* AI Image Generation */}
                        <Input
                            type="text"
                            placeholder="Describe the image you want to generate (e.g., 'a serene forest with a hidden waterfall')"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            theme={theme}
                            disabled={generatingImage}
                        />
                        <PrimaryJournalButton onClick={handleGenerateImage} disabled={generatingImage || !aiPrompt.trim()} theme={theme}>
                            {generatingImage ? 'Generating...' : <><FaRegLightbulb /> Generate Image</>}
                        </PrimaryJournalButton>

                        <h3 style={{ marginTop: '40px' }}>Your Saved Memories</h3>
                        {memories.length > 0 ? (
                            <PictureGrid>
                                {memories.map(memory => (
                                    <PictureCard key={memory.id} theme={theme}>
                                        <img src={memory.imageUrl} alt={memory.prompt || "Generated or Uploaded Memory"} />
                                        <div className="picture-info">
                                            <span>{memory.timestamp ? new Date(memory.timestamp.toDate()).toLocaleDateString() : 'No Date'}</span>
                                            <button onClick={() => handleDeleteMemory(memory.id)}><FaTrash /></button>
                                        </div>
                                        {memory.prompt && memory.prompt !== "User uploaded image" && (
                                            <p style={{fontSize: '0.8rem', color: theme.textLight, padding: '0 10px 10px', textAlign: 'center'}}>{memory.prompt}</p>
                                        )}
                                    </PictureCard>
                                ))}
                            </PictureGrid>
                        ) : (
                            <EmptyState theme={theme}>
                                <FaSearch />
                                <p>No memories yet. Upload or generate one!</p>
                            </EmptyState>
                        )}
                    </MemoryLaneContainer>
                </SectionWrapper>

                {/* Section: Journal Stats (Placeholder) */}
                <SectionWrapper ref={el => sectionRefs.current['stats'] = el} theme={theme}>
                    <SectionTitle theme={theme}>
                        <FaChartLine /> Journal Stats
                    </SectionTitle>
                    <SectionDescription theme={theme}>
                        Gain insights into your journaling habits and mood trends.
                    </SectionDescription>
                    <JournalStatsContainer theme={theme}>
                        <h3>Your Journaling Progress</h3>
                        <div className="stat-item">Total Entries: <span>{journalEntries.length}</span></div>
                        {(() => {
                            const moodCounts = {};
                            journalEntries.forEach(entry => {
                                moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
                            });
                            let mostCommonMood = 'N/A';
                            let maxCount = 0;
                            for (const mood in moodCounts) {
                                if (moodCounts[mood] > maxCount) {
                                    maxCount = moodCounts[mood];
                                    mostCommonMood = mood;
                                }
                            }
                            return <div className="stat-item">Most Common Mood: <span>{mostCommonMood} {moodEmojis[mostCommonMood] || ''}</span></div>;
                        })()}
                        {(() => {
                            const totalRating = journalEntries.reduce((sum, entry) => sum + (entry.moodRating || 0), 0);
                            const averageRating = journalEntries.length > 0 ? Math.round(totalRating / journalEntries.length) : 0;
                            return <div className="stat-item">Average Mood Rating: <span>{averageRating}/100</span></div>;
                        })()}
                    </JournalStatsContainer>
                </SectionWrapper>
            </MainJournalContent>
        </PageContainer>
    );
}

export default MoodJournalPage;
    