const router = require('express').Router();
const { recommendSong } = require('../controllers/spotifyController');
const verifyToken = require('../utils/authMiddleware');

// Route to recommend a song based on user's chat history sentiment
router.get('/recommend-song', verifyToken, recommendSong);

module.exports = router;