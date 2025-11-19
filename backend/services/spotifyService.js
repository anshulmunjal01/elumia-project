// C:\Users\AA\Desktop\elumia-project\backend\services\spotifyService.js
const axios = require('axios');

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let spotifyAccessToken = null;
let tokenExpiryTime = 0;

// Function to get Spotify Access Token
const getSpotifyAccessToken = async () => {
    if (spotifyAccessToken && Date.now() < tokenExpiryTime) {
        return spotifyAccessToken; // Return existing token if valid
    }

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            `grant_type=client_credentials`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
                }
            }
        );
        spotifyAccessToken = response.data.access_token;
        tokenExpiryTime = Date.now() + (response.data.expires_in * 1000) - 60000; // Expire 1 minute early
        console.log("Spotify access token obtained.");
        return spotifyAccessToken;
    } catch (error) {
        console.error("Error getting Spotify access token:", error.response ? error.response.data : error.message);
        throw new Error("Failed to authenticate with Spotify API.");
    }
};

// Function to search for tracks on Spotify
exports.searchTracks = async (query, limit = 4) => {
    try {
        const token = await getSpotifyAccessToken();
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                q: query,
                type: 'track',
                limit: limit
            }
        });

        return response.data.tracks.items.map(track => ({
            id: track.id,
            title: track.name,
            description: `Artist: ${track.artists.map(artist => artist.name).join(', ')} | Album: ${track.album.name}`,
            category: 'Spotify Music',
            // *** CRITICAL CHANGE: Use Spotify embed URL for iframe compatibility ***
            // This URL allows the Spotify player to be embedded directly.
            // Full playback might still require a Spotify Premium account or opening in a new tab.
            url: `https://open.spotify.com/embed/track/${track.id}`, 
            thumbnail: track.album.images.length > 0 ? track.album.images[0].url : 'https://placehold.co/120x80/cccccc/ffffff?text=Music',
        }));
    } catch (error) {
        console.error("Error searching Spotify tracks:", error.response ? error.response.data : error.message);
        return []; // Return empty array on error
    }
};
