// routes/fitbitRoutes.js

const express = require('express');
const router = express.Router();
const fitbitController = require('../controllers/fitbitController');

/**
 * @swagger
 * /fitbit/auth:
 *   get:
 *     summary: Redirect to Fitbit authorization URL
 *     description: Redirects the user to the Fitbit authorization page to grant access to their Fitbit data.
 *     tags: [Fitbit]
 *     responses:
 *       302:
 *         description: Redirects to the Fitbit authorization URL.
 *       500:
 *         description: Internal Server Error if there is an issue redirecting.
 */
router.get('/auth', fitbitController.getAuthUrl);

/**
 * @swagger
 * /fitbit/callback:
 *   get:
 *     summary: Handle Fitbit OAuth callback
 *     description: Handles the callback from Fitbit and retrieves the access token using the provided authorization code.
 *     tags: [Fitbit]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: The authorization code received from Fitbit after user authorization.
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to the profile route after successful access token retrieval.
 *       500:
 *         description: Internal Server Error if there is an issue retrieving the access token.
 */
router.get('/callback', fitbitController.getAccessToken);

/**
 * @swagger
 * /fitbit/profile:
 *   get:
 *     summary: Fetch user profile
 *     description: Retrieves the authenticated user's Fitbit profile information.
 *     tags: [Fitbit]
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's profile information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: The user's profile data from Fitbit.
 *       500:
 *         description: Internal Server Error if there is an issue fetching the profile.
 */
router.get('/profile', fitbitController.getProfile);

/**
 * @swagger
 * /fitbit/activities:
 *   get:
 *     summary: Fetch user activity data
 *     description: Retrieves the authenticated user's activity data from Fitbit.
 *     tags: [Fitbit]
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's activity data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activities:
 *                   type: array
 *                   description: A list of activities recorded by the user.
 *       500:
 *         description: Internal Server Error if there is an issue fetching activity data.
 */
router.get('/activities', fitbitController.getActivityData);

/**
 * @swagger
 * /fitbit/heartrate:
 *   get:
 *     summary: Fetch user heart rate data
 *     description: Retrieves the authenticated user's heart rate data from Fitbit.
 *     tags: [Fitbit]
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's heart rate data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 heartRate:
 *                   type: object
 *                   description: The user's heart rate data.
 *       500:
 *         description: Internal Server Error if there is an issue fetching heart rate data.
 */
router.get('/heartrate', fitbitController.getHeartRateData);

module.exports = router;
