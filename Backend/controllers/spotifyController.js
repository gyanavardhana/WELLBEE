const SpotifyWebApi = require('spotify-web-api-node');
const prisma = require('../db/db');
const logger = require('../logger/logger');

// Set up Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const sentimentScores = {
  sadness: 6,
  disgust: 5,
  surprise: 4,
  fear: 3,
  anger: 2,
  neutral: 0,
  joy: 1,
};

// Function to get the sentiment category based on sentiment score
function getSentimentCategory(score) {
  return Object.keys(sentimentScores).find(key => sentimentScores[key] === score);
}

// Function to initialize Spotify API and get an access token
async function initializeSpotify() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    logger.info('Spotify access token set successfully.');
  } catch (err) {
    logger.error('Failed to retrieve Spotify access token:', err.message);
    throw new Error('Failed to initialize Spotify');
  }
}

// Controller to recommend a song based on user's chat history sentiment
const recommendSong = async (req, res) => {
  const userId = req.userId;  // Retrieve userId from middleware

  try {
    await initializeSpotify();

    // Retrieve the last 10 chat messages for the user
    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    let dominantSentiment = 'neutral'; // Default to 'neutral'

    if (messages.length > 0) {
      // Calculate the frequency of each sentiment
      const sentimentFrequency = {};
      messages.forEach((msg) => {
        const sentiment = getSentimentCategory(msg.sentimentScore) || 'neutral';
        sentimentFrequency[sentiment] = (sentimentFrequency[sentiment] || 0) + 1;
      });

      // Find the dominant sentiment
      dominantSentiment = Object.keys(sentimentFrequency).reduce((a, b) =>
        sentimentFrequency[a] > sentimentFrequency[b] ? a : b
      );
    }

    // Search Spotify for a playlist matching the dominant sentiment
    const playlistData = await spotifyApi.searchPlaylists(`${dominantSentiment} playlist`, { limit: 1 });
    const playlist = playlistData.body.playlists.items[0];

    if (!playlist) {
      logger.error('No playlist found for the dominant sentiment');
      return res.status(404).json({ error: 'No playlist found for the dominant sentiment' });
    }

    // Get tracks from the playlist and select a random one
    const playlistTracks = await spotifyApi.getPlaylistTracks(playlist.id, { limit: 50 });
    const tracks = playlistTracks.body.items;

    if (tracks.length === 0) {
      logger.error('No tracks found in the playlist');
      return res.status(404).json({ error: 'No tracks found in the playlist' });
    }

    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    const songUrl = randomTrack.track.external_urls.spotify;
    const songName = randomTrack.track.name;
    const artistName = randomTrack.track.artists[0].name;
    const previewUrl = randomTrack.track.preview_url;

    logger.info('Song recommendation retrieved successfully');
    res.status(200).json({ songName, artistName, previewUrl, songUrl, dominantSentiment });
  } catch (error) {
    logger.error('Error fetching song recommendation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { recommendSong };

