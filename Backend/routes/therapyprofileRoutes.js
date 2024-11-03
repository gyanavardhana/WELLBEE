const router = require('express').Router();
const verifyToken = require('../utils/authMiddleware');
const therapyprofileController = require('../controllers/therapyprofileController');

/**
 * @swagger
 * tags:
 *   name: Therapist Profile
 *   description: API endpoints for managing therapist profiles
 */

/**
 * @swagger
 * /therapy/therapistprofile:
 *   get:
 *     summary: Get therapist profile for current user
 *     description: Retrieves the therapist profile associated with the authenticated user.
 *     tags: [Therapist Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Therapist profile retrieved successfully
 *       404:
 *         description: Therapist profile not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/therapistprofile', verifyToken, therapyprofileController.getTherapistProfile);

/**
 * @swagger
 * /therapy/therapistprofiles:
 *   get:
 *     summary: Get all therapist profiles
 *     description: Retrieves all therapist profiles from the database.
 *     tags: [Therapist Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of therapist profiles retrieved successfully
 *       500:
 *         description: Internal Server Error
 */
router.get('/therapistprofiles', verifyToken, therapyprofileController.getAllTherapistProfiles);

/**
 * @swagger
 * /therapy/therapistprofile:
 *   post:
 *     summary: Create a therapist profile
 *     description: Creates a new therapist profile for the authenticated user.
 *     tags: [Therapist Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *                 description: The specialization of the therapist
 *     responses:
 *       201:
 *         description: Therapist profile created successfully
 *       400:
 *         description: Therapist profile already exists
 *       500:
 *         description: Internal Server Error
 */
router.post('/therapistprofile', verifyToken, therapyprofileController.createTherapistProfile);

/**
 * @swagger
 * /therapy/therapistprofile:
 *   put:
 *     summary: Update therapist profile
 *     description: Updates the specialization or ratings of a therapist profile for the authenticated user.
 *     tags: [Therapist Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *                 description: Updated specialization of the therapist
 *               ratings:
 *                 type: number
 *                 description: Updated ratings for the therapist
 *     responses:
 *       200:
 *         description: Therapist profile updated successfully
 *       404:
 *         description: Therapist profile not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/therapistprofile', verifyToken, therapyprofileController.updateTherapistProfile);

/**
 * @swagger
 * /therapy/therapistprofile/rating:
 *   put:
 *     summary: Update therapist profile by user
 *     description: Updates the specialization or ratings of a specific therapist profile by user ID.
 *     tags: [Therapist Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the therapist profile to update
 *               specialization:
 *                 type: string
 *                 description: Updated specialization of the therapist
 *               ratings:
 *                 type: number
 *                 description: Updated ratings for the therapist
 *     responses:
 *       200:
 *         description: Therapist profile updated successfully
 *       404:
 *         description: Therapist profile not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/therapistprofile/rating', verifyToken, therapyprofileController.updateTherapistProfilebyUser);

/**
 * @swagger
 * /therapy/therapistprofile:
 *   delete:
 *     summary: Delete therapist profile
 *     description: Deletes the therapist profile associated with the authenticated user.
 *     tags: [Therapist Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Therapist profile deleted successfully
 *       404:
 *         description: Therapist profile not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/therapistprofile', verifyToken, therapyprofileController.deleteTherapistProfile);

/**
 * @swagger
 * /therapy/chat:
 *   post:
 *     summary: Handle AI chat interactions
 *     description: Processes user input and interacts with an AI chat model to provide responses.
 *     tags: [Therapist Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userInput:
 *                 type: string
 *                 description: The input message from the user
 *     responses:
 *       200:
 *         description: Chat response returned successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal Server Error
 */
router.post('/chat', therapyprofileController.chatHandler);

module.exports = router;
