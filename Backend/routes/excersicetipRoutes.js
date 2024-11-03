// routes/excersicetipRoutes.js

const router = require('express').Router();
const verifyToken = require('../utils/authMiddleware');
const excersicetipController = require('../controllers/excersicetipController');

/**
 * @swagger
 * /excersice/createexcersicetip:
 *   post:
 *     summary: Create an exercise tip
 *     description: Creates a new exercise tip for the authenticated user.
 *     tags: [Exercise Tips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tip:
 *                 type: string
 *                 description: The content of the exercise tip.
 *     responses:
 *       201:
 *         description: Exercise tip created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 exerciseTip:
 *                   type: object
 *       500:
 *         description: Internal Server Error if there is an issue creating the tip.
 */
router.post('/createexcersicetip', verifyToken, excersicetipController.createExerciseTip);

/**
 * @swagger
 * /excersice/getexcersicetips:
 *   get:
 *     summary: Retrieve exercise tips
 *     description: Retrieves all exercise tips for the authenticated user.
 *     tags: [Exercise Tips]
 *     responses:
 *       200:
 *         description: Successfully retrieved exercise tips.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exerciseTips:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No exercise tips found for the user.
 *       500:
 *         description: Internal Server Error if there is an issue retrieving tips.
 */
router.get('/getexcersicetips', verifyToken, excersicetipController.getExerciseTips);

/**
 * @swagger
 * /excersice/updateexcersicetip/{tipId}:
 *   put:
 *     summary: Update an exercise tip
 *     description: Updates a specific exercise tip for the authenticated user.
 *     tags: [Exercise Tips]
 *     parameters:
 *       - in: path
 *         name: tipId
 *         required: true
 *         description: ID of the exercise tip to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tip:
 *                 type: string
 *                 description: The new content for the exercise tip.
 *     responses:
 *       200:
 *         description: Exercise tip updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedTip:
 *                   type: object
 *       500:
 *         description: Internal Server Error if there is an issue updating the tip.
 */
router.put('/updateexcersicetip/:tipId', verifyToken, excersicetipController.updateExerciseTip);

/**
 * @swagger
 * /deleteexcersicetip/{tipId}:
 *   delete:
 *     summary: Delete an exercise tip
 *     description: Deletes a specific exercise tip for the authenticated user.
 *     tags: [Exercise Tips]
 *     parameters:
 *       - in: path
 *         name: tipId
 *         required: true
 *         description: ID of the exercise tip to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise tip deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedTip:
 *                   type: object
 *       500:
 *         description: Internal Server Error if there is an issue deleting the tip.
 */
router.delete('/deleteexcersicetip/:tipId', verifyToken, excersicetipController.deleteExerciseTip);

/**
 * @swagger
 * /getexcersices:
 *   post:
 *     summary: Get exercise recommendations based on BMI
 *     description: Provides exercise recommendations based on the user's height and weight for BMI classification.
 *     tags: [Exercise Tips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: number
 *                 description: User's height in centimeters.
 *               weight:
 *                 type: number
 *                 description: User's weight in kilograms.
 *     responses:
 *       200:
 *         description: Successfully retrieved exercise recommendations based on BMI.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bmi:
 *                   type: number
 *                 category:
 *                   type: string
 *                 recommendedExercises:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal Server Error if there is an issue fetching recommendations.
 */
router.post('/getexcersices', verifyToken, excersicetipController.getExerciseRecommendations);

module.exports = router;
