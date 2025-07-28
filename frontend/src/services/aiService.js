// C:\Users\AA\Desktop\elumia-project\frontend\src\services\aiService.js

const API_BASE_URL = 'http://localhost:5000/api/ai'; // Base URL for your backend AI routes

// Function to get AI chat response
async function getAIChatResponse(message, history, userMood) {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, history, userMood }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'AI chat response failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting AI chat response:', error);
        throw error; // Re-throw to be handled by the calling component
    }
}

// Function to detect mood from text
async function detectMoodFromText(text) {
    try {
        // --- CORRECTED ENDPOINT ---
        const response = await fetch(`${API_BASE_URL}/detect-emotion-text`, { // Changed from /detect-mood
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Mood detection failed');
        }

        const data = await response.json();
        return data.mood; // Assuming the backend returns { mood: 'neutral' }
    } catch (error) {
        console.error('Error detecting mood:', error);
        throw error; // Re-throw to be handled by the calling component
    }
}

// Placeholder for other AI services (adjust if you implement them)
async function getAISuggestions(mood, context) {
    try {
        const response = await fetch(`${API_BASE_URL}/suggest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mood, context }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'AI suggestions failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting AI suggestions:', error);
        throw error;
    }
}

// Export all functions
const aiService = {
    getAIChatResponse,
    detectMoodFromText,
    getAISuggestions,
    // Add other functions if implemented, e.g., detectMoodFromAudio, detectMoodFromFacial
};

export default aiService;