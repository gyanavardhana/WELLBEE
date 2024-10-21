const SpotifyWebApi = require('spotify-web-api-node');

// Set up Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: '',
  clientSecret: '',
});

async function recommendSongBasedOnSentiment(userMessage) {
    // Perform a basic sentiment analysis (dummy sentiment for example)
    const sentiment = 1;  // Example: positive sentiment
  
    let mood;
    if (sentiment > 0) {
      mood = 'happy';
    } else if (sentiment < 0) {
      mood = 'calm';
    } else {
      mood = 'neutral';
    }
  
    // Query Spotify for playlists based on mood
    try {
      const data = await spotifyApi.searchPlaylists(`${mood} playlist`, { limit: 1 });
      const playlist = data.body.playlists.items[0];
      console.log('Recommended Playlist:', playlist.external_urls.spotify);
    } catch (err) {
      console.error('Error fetching playlist:', err);
    }
  }

// Get the access token
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('Access token retrieved:', data.body['access_token']);
    
    // Save the access token so that it can be used in future requests
    spotifyApi.setAccessToken(data.body['access_token']);

    // Now call the function to recommend a song
    recommendSongBasedOnSentiment('I feel really tired and stressed.');
  },
  function(err) {
    console.log('Failed to retrieve access token', err);
  }
);
