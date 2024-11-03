const express = require('express');
const { getHealthInfo } = require('../controllers/healthController');

const router = express.Router();

/**
 * @swagger
 * /healthinfo/health-info:
 *   post:
 *     summary: Retrieve health information based on food and exercise queries
 *     description: This endpoint fetches nutritional information for a given food item and exercise data based on a user query, then calculates the calories gained and nutritional sums.
 *     tags: [Health]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               foodItem:
 *                 type: string
 *                 description: The name of the food item for which nutritional information is requested.
 *                 example: "banana"
 *               exerciseQuery:
 *                 type: string
 *                 description: The description of the exercise performed for which calorie expenditure is calculated.
 *                 example: "running for 30 minutes"
 *     responses:
 *       200:
 *         description: Successful response with calculated nutritional values.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 caloriesGained:
 *                   type: number
 *                   description: The net calories gained after considering food intake and exercise.
 *                   example: 150
 *                 totalCarbohydrates:
 *                   type: number
 *                   description: Total carbohydrates consumed from the food item(s).
 *                   example: 25
 *                 totalProtein:
 *                   type: number
 *                   description: Total protein consumed from the food item(s).
 *                   example: 5
 *                 totalFiber:
 *                   type: number
 *                   description: Total fiber consumed from the food item(s).
 *                   example: 3
 *                 totalFat:
 *                   type: number
 *                   description: Total fat consumed from the food item(s).
 *                   example: 2
 *       500:
 *         description: Internal Server Error if there is an issue fetching health information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error that occurred.
 *                   example: "Error fetching health information"
 */
router.post('/health-info', getHealthInfo);

module.exports = router;
