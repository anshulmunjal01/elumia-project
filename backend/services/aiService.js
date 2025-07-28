// C:\Users\AA\Desktop\elumia-project\backend\services\aiService.js

// Import the Google Generative AI SDK
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Remove or comment out this line (as previously discussed):
// require('dotenv').config({ path: '../.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in your .env file! (Checked at aiService level)");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const MODEL_NAME = "gemini-2.0-flash";

async function getLLMResponse(userMessage, chatHistory = [], userMood = 'neutral') {
    // --- DEBUGGING LOGS ---
    console.log('DEBUG (aiService): Entering getLLMResponse');
    console.log('DEBUG (aiService): userMessage received:', userMessage);
    console.log('DEBUG (aiService): typeof userMessage:', typeof userMessage);
    console.log('DEBUG (aiService): chatHistory received:', JSON.stringify(chatHistory, null, 2));
    // --- END DEBUGGING LOGS ---

    try {
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ],
        });

        // --- START OF CORRECTED HISTORY HANDLING ---
        let filteredHistoryForGemini = [];
        if (chatHistory.length > 0) {
            // Identify if the very first message is the specific AI welcome message
            const isInitialAIWelcomeMessage = chatHistory[0].sender === 'ai' &&
                                             chatHistory[0].message === "Hello! I'm Elumia AI, your companion for emotional wellness. How can I help you today?";
            
            let startIndex = isInitialAIWelcomeMessage ? 1 : 0; // Skip if it's the specific AI welcome message

            // Iterate through the rest of the history from the determined start index
            for (let i = startIndex; i < chatHistory.length; i++) {
                const msg = chatHistory[i];
                // Only include messages with non-empty, valid text content
                if (msg.message && String(msg.message).trim().length > 0) {
                    filteredHistoryForGemini.push({
                        role: msg.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: String(msg.message).trim() }]
                    });
                }
            }
        }

        // Add a debug log to see what history is actually being sent to Gemini
        console.log('DEBUG (aiService): History sent to Gemini:', JSON.stringify(filteredHistoryForGemini, null, 2));

        const chat = model.startChat({
            history: filteredHistoryForGemini, // Use the carefully filtered history here
        });
        // --- END OF CORRECTED HISTORY HANDLING ---

        if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
            throw new Error('User message is empty or invalid.');
        }

        console.log('DEBUG (aiService): Sending message to Gemini API...');
        const result = await chat.sendMessage([{text: userMessage.trim()}]);
        const aiResponseContent = result.response.text();
        console.log('DEBUG (aiService): Received response from Gemini API:', aiResponseContent);
        const aiMood = 'neutral';

        return { text: aiResponseContent, aiMood: aiMood };

    } catch (error) {
        console.error('Error calling Gemini API from aiService:', error);

        // --- START OF IMPROVED ERROR PROPAGATION ---
        // Ensure the exact Gemini API error message is passed to the frontend
        if (error.message && error.message.includes('GoogleGenerativeAI Error')) {
            // Extract a more user-friendly part of the error if possible, or send full error
            let userFriendlyError = error.message;
            if (error.message.includes("First content should be with role 'user', got model")) {
                 userFriendlyError = "Gemini API Error: Conversation history sequence is incorrect. Try starting a new chat if issues persist.";
            } else if (error.message.includes("403 Forbidden")) {
                 userFriendlyError = "Gemini API Error: API Key not authorized or project limits exceeded. Check your Google Cloud Project settings.";
            } else if (error.message.includes("400 Bad Request")) {
                 userFriendlyError = "Gemini API Error: Invalid request format or inappropriate content. Please rephrase.";
            } else if (error.message.includes("Quota exceeded")) {
                 userFriendlyError = "Gemini API Error: Daily usage quota exceeded. Please try again later.";
            }
            throw new Error(`Failed to get AI response from backend: ${userFriendlyError}`);
        }
        // --- END OF IMPROVED ERROR PROPAGATION ---

        if (error.message && error.message.includes('GEMINI_API_KEY')) {
            throw new Error('API Key Error: Please check your GEMINI_API_KEY in the .env file.');
        }
        if (error.message && error.message.includes('Network Error') || error.message.includes('fetch')) {
            throw new Error(`Network Error: Could not connect to Gemini API. Check your internet connection. Original: ${error.message}`);
        }
        if (error.message === 'User message is empty or invalid.') {
            throw error;
        }

        throw new Error(`Failed to get AI response from Gemini: ${error.message || 'An unknown error occurred.'}`);
    }
}

// Ensure these functions are correctly defined and not accidentally deleted
async function detectEmotionFromText(text) {
    if (!text || typeof text !== 'string' || text.trim() === '') {
        console.warn('Warning: Text for mood detection is empty or invalid.');
        return 'neutral';
    }
    console.log(`[Mood Detection Placeholder] Detecting mood for: "${text}"`);
    return 'neutral';
}

async function detectEmotionFromAudio(audioData) {
    console.log('[Placeholder] Audio emotion detection requested.');
    throw new Error('Audio emotion detection not implemented.');
}

async function detectEmotionFromFacialExpression(imageData) {
    console.log('[Placeholder] Facial expression detection requested.');
    throw new Error('Facial expression detection not implemented.');
}

async function suggestBasedOnMoodAndContext(mood, context) {
    console.log(`[Placeholder] Suggestions requested for mood: ${mood}, context: ${context}`);
    return ['Suggestion 1 (Placeholder)', 'Suggestion 2 (Placeholder)'];
}

module.exports = {
    getLLMResponse,
    detectEmotionFromText,
    detectEmotionFromAudio,
    detectEmotionFromFacialExpression,
    suggestBasedOnMoodAndContext,
};