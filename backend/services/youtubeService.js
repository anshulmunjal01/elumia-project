// C:\Users\AA\Desktop\elumia-project\backend\services\youtubeService.js
const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Function to search for videos on YouTube
exports.searchVideos = async (query, limit = 4) => {
    if (!YOUTUBE_API_KEY) {
        console.warn("YOUTUBE_API_KEY is not set. YouTube search will not work.");
        return [];
    }
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: YOUTUBE_API_KEY,
                q: query,
                part: 'snippet',
                type: 'video',
                maxResults: limit,
                videoEmbeddable: 'true', // Ensure videos can be embedded
                videoSyndicated: 'true', // Ensure videos can be played outside YouTube.com
                relevanceLanguage: 'en', // Prioritize English-language content for relevance
                safeSearch: 'strict', // Filter out potentially restricted content
                // orderBy: 'relevance' // Ordering by relevance can sometimes help, but may require specific indexing.
                                    // For now, let's rely on the default ordering combined with other filters.
            }
        });

        return response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            category: 'YouTube Video',
            url: `https://www.youtube.com/embed/${item.id.videoId}`, // Embeddable URL
            thumbnail: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : 'https://placehold.co/120x80/cccccc/ffffff?text=Video',
        }));
    } catch (error) {
        console.error("Error searching YouTube videos:", error.response ? error.response.data : error.message);
        return []; // Return empty array on error
    }
};
