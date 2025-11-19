// C:\Users\AA\Desktop\elumia-project\backend\controllers\upliftmentController.js
const spotifyService = require('../services/spotifyService');
const youtubeService = require('../services/youtubeService');

// Mock data (can be replaced with database fetches or more dynamic API calls)
const picsumImageUrls = [
    'https://picsum.photos/id/10/300/200', 'https://picsum.photos/id/20/300/200',
    'https://picsum.photos/id/30/300/200', 'https://picsum.photos/id/40/300/200',
    'https://picsum.photos/id/50/300/200', 'https://picsum.photos/id/60/300/200',
    'https://picsum.photos/id/70/300/200', 'https://picsum.photos/id/80/300/200',
    'https://picsum.photos/id/90/300/200', 'https://picsum.photos/id/100/300/200',
    'https://picsum.photos/id/101/300/200', 'https://picsum.photos/id/102/300/200',
    'https://picsum.photos/id/103/300/200', 'https://picsum.photos/id/104/300/200',
    'https://picsum.photos/id/105/300/200', 'https://picsum.photos/id/106/300/200',
    'https://picsum.photos/id/107/300/200', 'https://picsum.photos/id/108/300/200',
    'https://picsum.photos/id/109/300/200', 'https://picsum.photos/id/110/300/200',
];

const mockBaseContent = {
    music: [
        { id: 'm1', title: 'Relaxing Piano', description: 'Calm piano melodies for relaxation.', category: 'Ambient', url: 'https://www.youtube.com/embed/eu02b4y_2mQ', thumbnail: 'https://i.ytimg.com/vi/eu02b4y_2mQ/hqdefault.jpg' },
        { id: 'm2', title: 'Chill Lo-Fi Beats', description: 'Smooth beats for studying or chilling.', category: 'Lo-Fi', url: 'https://www.youtube.com/embed/5qap5aO4i9A', thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg' },
        { id: 'm3', title: 'Nature Sounds: Rain & Thunder', description: 'Immersive sounds of a thunderstorm.', category: 'Nature', url: 'https://www.youtube.com/embed/nDqK0N4rY_g', thumbnail: 'https://i.ytimg.com/vi/nDqK0N4rY_g/hqdefault.jpg' },
        { id: 'm4', title: 'Classical Study Music', description: 'Focus with classical masterpieces.', category: 'Classical', url: 'https://www.youtube.com/embed/f2M2h4g150M', thumbnail: 'https://i.ytimg.com/vi/f2M2h4g150M/hqdefault.jpg' },
    ],
    videos: [
        { id: 'v1', title: 'Mindfulness Meditation for Beginners', description: 'A gentle introduction to mindfulness.', category: 'Guided', url: 'https://www.youtube.com/embed/inpohN5gq2E', thumbnail: 'https://i.ytimg.com/vi/inpohN5gq2E/hqdefault.jpg' },
        { id: 'v2', title: 'Beautiful Ocean Waves 4K', description: 'Soothing visuals of the sea.', category: 'Visuals', url: 'https://www.youtube.com/embed/bn_h6g1z17I', thumbnail: 'https://i.ytimg.com/vi/bn_h6g1z17I/hqdefault.jpg' },
        { id: 'v3', title: 'Funny Animal Bloopers', description: 'Laugh out loud with hilarious animals.', category: 'Humor', url: 'https://www.youtube.com/embed/y2Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q', thumbnail: 'https://i.ytimg.com/vi/y2Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q/hqdefault.jpg' },
        { id: 'v4', title: 'Short Inspirational Story', description: 'A quick boost of motivation.', category: 'Inspiration', url: 'https://www.youtube.com/embed/y2Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q', thumbnail: 'https://i.ytimg.com/vi/y2Q_Q_Q_Q_Q_Q_Q_Q_Q_Q_Q/hqdefault.jpg' },
    ],
    meditations: [
        { id: 'med1', title: '5-Minute Breath Awareness', description: 'Quick grounding exercise for stress relief.', category: 'Guided', url: 'https://www.youtube.com/embed/inpohN5gq2E', thumbnail: 'https://i.ytimg.com/vi/inpohN5gq2E/hqdefault.jpg' },
        { id: 'med2', title: 'Deep Sleep Hypnosis', description: 'Relax and drift into peaceful sleep.', category: 'Sleep Aid', url: 'https://www.youtube.com/embed/bn_h6g1z17I', thumbnail: 'https://i.ytimg.com/vi/bn_h6g1z17I/hqdefault.jpg' },
        { id: 'med3', title: 'Walking Meditation Guide', description: 'Practice mindfulness on the go.', category: 'Guided', url: 'https://www.youtube.com/embed/eu02b4y_2mQ', thumbnail: 'https://i.ytimg.com/vi/eu02b4y_2mQ/hqdefault.jpg' },
        { id: 'med4', title: 'Loving-Kindness Meditation', description: 'Cultivate compassion and warmth.', category: 'Affirmation', url: 'https://www.youtube.com/embed/5qap5aO4i9A', thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg' },
    ],
    games: [
        { id: 'g1', title: 'Calming Color by Number', description: 'Relaxing digital coloring experience.', category: 'Creative', url: 'https://www.example.com/game1', thumbnail: 'https://placehold.co/120x80/A78BFA/FFFFFF?text=Game' },
        { id: 'g2', title: 'Zen Jigsaw Puzzles', description: 'Beautiful nature-themed puzzles.', category: 'Puzzle', url: 'https://www.example.com/game2', thumbnail: 'https://placehold.co/120x80/C4B5FD/FFFFFF?text=Game' },
        { id: 'g3', title: 'Memory Match: Nature Sounds', description: 'Gentle memory game with soothing audio.', category: 'Memory', url: 'https://www.example.com/game3', thumbnail: 'https://placehold.co/120x80/8B5CF6/FFFFFF?text=Game' },
        { id: 'g4', title: 'Digital Zen Garden', description: 'Rake sand and arrange stones virtually.', category: 'Simulation', url: 'https://www.example.com/game4', thumbnail: 'https://placehold.co/120x80/A78BFA/FFFFFF?text=Game' },
    ],
    books: [
        { id: 'b1', title: 'The Comfort Book', description: 'Matt Haig\'s collection of notes on hope.', category: 'Self-Help', url: 'https://openlibrary.org/works/OL25056779W/The_Comfort_Book', thumbnail: 'https://placehold.co/120x80/C4B5FD/FFFFFF?text=Book' },
        { id: 'b2', title: 'Wherever You Go, There You Are', description: 'Jon Kabat-Zinn on mindfulness meditation.', category: 'Mindfulness', url: 'https://openlibrary.org/works/OL1584311W/Wherever_You_Go_There_You_Are', thumbnail: 'https://placehold.co/120x80/8B5CF6/FFFFFF?text=Book' },
        { id: 'b3', title: 'Atomic Habits', description: 'Small changes, remarkable results.', category: 'Productivity', url: 'https://openlibrary.org/works/OL20353406W/Atomic_Habits', thumbnail: 'https://placehold.co/120x80/A78BFA/FFFFFF?text=Book' },
        { id: 'b4', title: 'The Alchemist', description: 'Paulo Coelho\'s inspiring fable.', category: 'Fiction', url: 'https://openlibrary.org/works/OL1524310W/The_Alchemist', thumbnail: 'https://placehold.co/120x80/C4B5FD/FFFFFF?text=Book' },
    ],
};

const mockUniverseMessages = [
    "The universe whispers, 'You are exactly where you need to be.'",
    "A gentle reminder: Your strength is greater than any struggle.",
    "Embrace the quiet moments; they hold profound wisdom.",
    "Today, let your heart lead the way to new possibilities.",
    "You are a masterpiece in progress. Be kind to yourself.",
    "The stars align for those who believe in their own magic.",
    "Breathe in courage, breathe out doubt. You've got this.",
    "Every sunrise is an invitation to begin anew.",
    "Your intuition is a compass; trust its gentle guidance.",
    "The greatest adventure is the one you create within.",
];

// Helper to generate more content (simulating database fetch)
const generateMoreContent = (type, currentCount = 0, count = 4) => {
    const newItems = [];
    for (let i = 0; i < count; i++) {
        const uniqueId = `${type}-${Date.now()}-${Math.random().toFixed(5)}`;
        const itemIndex = currentCount + i; // To make titles unique

        if (type === 'images') {
            const imageUrl = picsumImageUrls[Math.floor(Math.random() * picsumImageUrls.length)];
            newItems.push({ id: uniqueId, url: imageUrl });
        } else {
            const baseItem = mockBaseContent[type][Math.floor(Math.random() * mockBaseContent[type].length)];
            newItems.push({
                ...baseItem,
                id: uniqueId,
                title: `${baseItem.title} (More ${itemIndex + 1})`, // Make title unique
                description: `${baseItem.description} (Additional content loaded.)`
            });
        }
    }
    return newItems;
};

// Controller functions
exports.getUpliftmentContent = async (req, res) => {
    const mood = req.query.mood;
    let content = JSON.parse(JSON.stringify(mockBaseContent)); // Deep copy to avoid modifying original

    // Simulate mood-based filtering (more complex logic would be here)
    if (mood === 'Happy') {
        content.music = content.music.filter(item => item.category === 'Lo-Fi');
        content.videos = content.videos.filter(item => item.category === 'Humor');
    } else if (mood === 'Anxious') {
        content.music = content.music.filter(item => item.category === 'Ambient' || item.category === 'Nature');
        content.meditations = content.meditations.filter(item => item.category === 'Guided');
    }

    // Add initial images to the content response
    content.images = generateMoreContent('images', 0, 8); // Always send initial 8 images

    // Integrate real API calls for music and videos if mood is not specified or for specific moods
    try {
        // Example: If mood is 'Happy', get pop music from Spotify
        if (mood === 'Happy') {
            const spotifyTracks = await spotifyService.searchTracks('happy pop', 4);
            content.music = [...content.music, ...spotifyTracks];
        } else if (mood === 'Calm') {
            const youtubeMeditationVideos = await youtubeService.searchVideos('guided meditation', 4);
            content.meditations = [...content.meditations, ...youtubeMeditationVideos];
        }

        // Always include some general music/videos from APIs for variety
        const generalSpotifyTracks = await spotifyService.searchTracks('instrumental relaxation', 2);
        content.music = [...content.music, ...generalSpotifyTracks];

        const generalYoutubeVideos = await youtubeService.searchVideos('nature documentary', 2);
        content.videos = [...content.videos, ...generalYoutubeVideos];

    } catch (apiError) {
        console.error("Error fetching from external APIs:", apiError);
        // Continue with mock data if API calls fail
    }

    res.json(content);
};

exports.loadMoreContent = (req, res) => {
    const type = req.query.type;
    const currentCount = parseInt(req.query.currentCount || 0);
    const newItems = generateMoreContent(type, currentCount, 4); // Generate 4 new items

    res.json({ type, newItems });
};

exports.getUniverseMessage = (req, res) => {
    const randomIndex = Math.floor(Math.random() * mockUniverseMessages.length);
    res.json({ message: mockUniverseMessages[randomIndex] });
};