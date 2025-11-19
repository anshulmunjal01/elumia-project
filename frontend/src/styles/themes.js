export const lightTheme = {
    // Backgrounds & Surfaces
    background: '#F0F2F5', // Light grey page background
    cardBackground: '#FFFFFF', // White for cards, boxes
    headerBackground: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white for header/footer
    sidebarBackground: '#f8f8f8', // Added for UpliftmentToolsPage sidebar
    sidebarItemHoverBg: '#e0e0e0', // Added for UpliftmentToolsPage sidebar item hover
    sidebarItemActiveBg: '#e0e0e0', // Added for UpliftmentToolsPage sidebar item active

    // Text Colors
    text: '#333333', // Primary dark text
    textLight: '#4A4A4A', // Lighter grey text for paragraphs (Adjusted for better visibility)
    headerText: '#333333', // Text color for header links/logo
    moodText: '#333333', // Text color for mood buttons (this was already good)
    sidebarText: '#333', // Added for UpliftmentToolsPage sidebar
    sidebarHeader: '#333', // Added for UpliftmentToolsPage sidebar header
    sidebarItemText: '#333', // Added for UpliftmentToolsPage sidebar item text
    sidebarItemHoverText: '#000', // Added for UpliftmentToolsPage sidebar item hover text
    sidebarItemActiveText: '#000', // Added for UpliftmentToolsPage sidebar item active text

    // Primary Brand Colors (for gradients/accents)
    primaryAccent: '#6A82FB', // Blue
    secondaryAccent: '#FC5C7D', // Pink

    // Gradients
    primaryGradient: 'linear-gradient(to right, #6A82FB, #FC5C7D)', // Blue to Pink
    secondaryGradient: 'linear-gradient(to right, #FC5C7D, #6A82FB)', // Pink to Blue (used for hover on secondary button)

    // Shadows
    shadowLight: '0 2px 5px rgba(0, 0, 0, 0.08)',
    shadowMedium: '0 5px 15px rgba(0, 0, 0, 0.1)',
    shadowStrong: '0 10px 30px rgba(0, 0, 0, 0.2)',

    // Buttons
    buttonPrimaryBg: 'linear-gradient(to right, #6A82FB, #FC5C7D)', // Primary button background is a gradient
    buttonPrimaryText: '#FFFFFF', // White text on primary button
    buttonSecondaryBg: 'transparent', // Secondary button background is transparent
    buttonSecondaryText: '#6A82FB', // Secondary button text (blue)
    buttonSecondaryBorder: '#6A82FB', // Secondary button border (blue)

    // Form Elements
    inputBorder: '#D1D9E6', // Light grey border for inputs
    inputBackground: '#FFFFFF', // White background for inputs
    focusOutline: 'rgba(106, 130, 251, 0.4)', // New: specific color for focus outline

    // Mood Colors (for HomePage mood selection)
    moodHappy: '#FFECB3', // Light yellow
    moodCalm: '#C8E6C9', // Light green
    moodSad: '#BBDEFB', // Light blue
    moodAnxious: '#FFCDD2', // Light red/pink
    moodExcited: '#E1BEE7', // Light purple
    moodReflective: '#B2EBF2', // Light cyan
    moodSelectedBorder: '#6A82FB', // Blue border for selected mood

    // NEW JOURNAL-SPECIFIC COLORS
    journalBorder: '#E0E0E0', // Light border for journal entries/forms
    journalEntryBg: '#FAFAFA', // Slightly off-white for text area background
    journalPlaceholder: '#B0B0B0', // Light grey for placeholder text
    canvasBackground: '#FFFFFF', // White canvas for drawing
    moodSliderTrack: '#E0E0E0', // Track color for range sliders
    moodSliderThumb: '#6A82FB', // Thumb color for range sliders
    footerText: '#333333', // Dark text for the footer in light mode
    footerBackground: '#F0F2F5', // Match main background or slightly different

    // AI Chat Message Colors
    userMessageBg: '#E0E0E0', // Light grey for user message bubbles
    userMessageText: '#333333', // Dark text for user messages in light mode (FIX)
    aiMessageBg: '#6A82FB', // Primary accent color for AI message bubbles
    aiMessageText: '#FFFFFF', // White text for AI messages
    userAvatarBg: '#666666', // A slightly darker grey for user avatar in light mode
    aiAvatarBg: '#6A82FB', // Match AI message background for AI avatar
};

export const darkTheme = {
    // Backgrounds & Surfaces
    background: '#2C3E50', // Dark blue page background
    cardBackground: '#34495E', // Slightly lighter dark blue for cards
    headerBackground: 'rgba(52, 73, 94, 0.8)', // Semi-transparent dark blue for header/footer
    sidebarBackground: '#2C3E50', // Added for UpliftmentToolsPage sidebar
    sidebarItemHoverBg: '#3D566E', // Added for UpliftmentToolsPage sidebar item hover
    sidebarItemActiveBg: '#3D566E', // Added for UpliftmentToolsPage sidebar item active

    // Text Colors
    text: '#ECF0F1', // Light grey text
    textLight: '#FFFFFF', // Lighter grey text (Changed to white for better visibility in dark mode)
    headerText: '#ECF0F1', // Text color for header links/logo
    moodText: '#ECF0F1', // Adjusted for dark mode: Mood button text should be light
    sidebarText: '#ECF0F1', // Added for UpliftmentToolsPage sidebar
    sidebarHeader: '#ECF0F1', // Added for UpliftmentToolsPage sidebar header
    sidebarItemText: '#ECF0F1', // Added for UpliftmentToolsPage sidebar item text
    sidebarItemHoverText: '#FFFFFF', // Added for UpliftmentToolsPage sidebar item hover text
    sidebarItemActiveText: '#FFFFFF', // Added for UpliftmentToolsPage sidebar item active text

    // Primary Brand Colors (for gradients/accents)
    primaryAccent: '#7B68EE', // Medium Purple
    secondaryAccent: '#FF6347', // Tomato Red

    // Gradients (adjusted for dark mode visibility)
    primaryGradient: 'linear-gradient(to right, #7B68EE, #FF6347)',
    secondaryGradient: 'linear-gradient(to right, #FF6347, #7B68EE)',

    // Shadows (darker shadows for dark mode)
    shadowLight: '0 2px 5px rgba(0, 0, 0, 0.2)',
    shadowMedium: '0 5px 15px rgba(0, 0, 0, 0.3)',
    shadowStrong: '0 10px 30px rgba(0, 0, 0, 0.4)',

    // Buttons
    buttonPrimaryBg: 'linear-gradient(to right, #7B68EE, #FF6347)',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryBg: 'transparent',
    buttonSecondaryText: '#7B68EE',
    buttonSecondaryBorder: '#7B68EE',

    // Form Elements
    inputBorder: '#4A627B',
    inputBackground: '#3D566E',
    focusOutline: 'rgba(123, 104, 238, 0.6)', // New: specific color for focus outline

    // Mood Colors (can be adjusted for dark mode, currently same as light for contrast)
    moodHappy: '#FFECB3',
    moodCalm: '#C8E6C9',
    moodSad: '#BBDEFB',
    moodAnxious: '#FFCDD2',
    moodExcited: '#E1BEE7',
    moodReflective: '#B2EBF2',
    moodSelectedBorder: '#7B68EE', // Purple border for selected mood

    // NEW JOURNAL-SPECIFIC COLORS
    journalBorder: '#4A627B', // Darker border for journal entries/forms
    journalEntryBg: '#3D566E', // Darker background for text area
    journalPlaceholder: '#666666', // Darker grey for placeholder text
    canvasBackground: '#2C3E50', // Dark canvas for drawing
    moodSliderTrack: '#4A627B',
    moodSliderThumb: '#7B68EE',
    footerText: '#ECF0F1', // Light text for the footer in dark mode
    footerBackground: '#2C3E50', // Match main background or slightly different

    // AI Chat Message Colors
    userMessageBg: '#7B68EE', // Primary accent color for user message bubbles
    userMessageText: '#FFFFFF', // White text for user messages
    aiMessageBg: '#3D566E', // Darker background for AI message bubbles
    aiMessageText: '#ECF0F1', // Light text for AI messages
    userAvatarBg: '#BDC3C7', // A lighter grey for user avatar in dark mode
    aiAvatarBg: '#7B68EE', // Match AI message background for AI avatar
};
