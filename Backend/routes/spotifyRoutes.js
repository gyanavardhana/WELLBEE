const router = require('express').Router();
const { recommendSong } = require('../controllers/spotifyController');
const verifyToken = require('../utils/authMiddleware');

/**
 * @swagger
 * /spotify/recommend-song:
 *   get:
 *     summary: Recommends a song based on user's chat history sentiment
 *     description: Analyzes the user's recent chat history to determine the dominant sentiment and recommends a song that matches this sentiment.
 *     tags:
 *       - Spotify
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Song recommendation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 songName:
 *                   type: string
 *                   description: Name of the recommended song
 *                 artistName:
 *                   type: string
 *                   description: Artist of the recommended song
 *                 previewUrl:
 *                   type: string
 *                   format: uri
 *                   description: Preview URL for the recommended song
 *                 songUrl:
 *                   type: string
 *                   format: uri
 *                   description: Spotify URL for the recommended song
 *                 dominantSentiment:
 *                   type: string
 *                   description: The dominant sentiment identified from the chat history
 *       401:
 *         description: Unauthorized access - Token required
 *       404:
 *         description: No playlist or tracks found for the dominant sentiment
 *       500:
 *         description: Internal Server Error
 */
router.get('/recommend-song', verifyToken, recommendSong);

module.exports = router;
