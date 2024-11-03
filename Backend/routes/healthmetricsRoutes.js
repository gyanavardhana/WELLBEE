const router = require('express').Router();
const healthmetricsController = require('../controllers/healthmetricsController');
const verifyToken = require('../utils/authMiddleware');

/**
 * @swagger
 * /health/createmetric:
 *   post:
 *     summary: Create a new health metric
 *     description: This endpoint allows a user to create a new health metric, such as weight, blood pressure, etc.
 *     tags: [Health Metrics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metricType:
 *                 type: string
 *                 description: The type of health metric being recorded (e.g., weight, blood pressure).
 *                 example: "weight"
 *               value:
 *                 type: number
 *                 description: The value of the health metric.
 *                 example: 70.5
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date the metric was recorded.
 *                 example: "2024-11-03"
 *     responses:
 *       201:
 *         description: Health metric created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message of metric creation.
 *                   example: "Health metric created successfully"
 *                 healthMetric:
 *                   type: object
 *                   description: The created health metric object.
 *       500:
 *         description: Internal Server Error if there is an issue creating the health metric.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error that occurred.
 *                   example: "Error creating health metric"
 */
router.post('/createmetric', verifyToken, healthmetricsController.createHealthMetric);

/**
 * @swagger
 * /health/getmetrics:
 *   get:
 *     summary: Retrieve all health metrics for the authenticated user
 *     description: This endpoint retrieves a list of all health metrics recorded by the authenticated user.
 *     tags: [Health Metrics]
 *     responses:
 *       200:
 *         description: A list of health metrics for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the health metric.
 *                     example: "12345"
 *                   metricType:
 *                     type: string
 *                     description: The type of health metric recorded.
 *                     example: "weight"
 *                   value:
 *                     type: number
 *                     description: The value of the health metric.
 *                     example: 70.5
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date the metric was recorded.
 *                     example: "2024-11-03"
 *       500:
 *         description: Internal Server Error if there is an issue retrieving health metrics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error that occurred.
 *                   example: "Error retrieving health metrics"
 */
router.get('/getmetrics', verifyToken, healthmetricsController.getHealthMetrics);

/**
 * @swagger
 * /health/updatemetric/{metricId}:
 *   put:
 *     summary: Update an existing health metric
 *     description: This endpoint allows a user to update an existing health metric by its ID.
 *     tags: [Health Metrics]
 *     parameters:
 *       - in: path
 *         name: metricId
 *         required: true
 *         description: The ID of the health metric to update.
 *         schema:
 *           type: string
 *           example: "12345"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metricType:
 *                 type: string
 *                 description: The updated type of health metric.
 *                 example: "weight"
 *               value:
 *                 type: number
 *                 description: The updated value of the health metric.
 *                 example: 72.0
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The updated date the metric was recorded.
 *                 example: "2024-11-04"
 *     responses:
 *       200:
 *         description: Health metric updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message of metric update.
 *                   example: "Health metric updated successfully"
 *       404:
 *         description: Health metric not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error that occurred.
 *                   example: "Health metric not found"
 *       500:
 *         description: Internal Server Error if there is an issue updating the health metric.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error that occurred.
 *                   example: "Error updating health metric"
 */
router.put('/updatemetric/:metricId', verifyToken, healthmetricsController.updateHealthMetric);

/**
 * @swagger
 * /health/deletemetric/{metricId}:
 *   delete:
 *     summary: Delete a health metric
 *     description: This endpoint allows a user to delete a health metric by its ID.
 *     tags: [Health Metrics]
 *     parameters:
 *       - in: path
 *         name: metricId
 *         required: true
 *         description: The ID of the health metric to delete.
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Health metric deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message of metric deletion.
 *                   example: "Health metric deleted successfully"
 *       404:
 *         description: Health metric not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error that occurred.
 *                   example: "Health metric not found"
 *       500:
 *         description: Internal Server Error if there is an issue deleting the health metric.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error that occurred.
 *                   example: "Error deleting health metric"
 */
router.delete('/deletemetric/:metricId', verifyToken, healthmetricsController.deleteHealthMetric);

module.exports = router;
