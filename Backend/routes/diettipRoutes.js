const dietipController = require('../controllers/diettipController');
const verifyToken = require('../utils/authMiddleware');
const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Diet Tips
 *   description: Operations about diet tips
 */

/**
 * @swagger
 * /diet/creatediettip:
 *   post:
 *     summary: Create a DietTip for a user
 *     tags: [Diet Tips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tip:
 *                 type: string
 *                 example: "Eat more fruits and vegetables."
 *     responses:
 *       201:
 *         description: Diet tip created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 dietTip:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     tip:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Internal Server Error
 */
router.post('/creatediettip', verifyToken, dietipController.createDietTip);

/**
 * @swagger
 * /diet/getdiettips:
 *   get:
 *     summary: Get all diet tips for a user
 *     tags: [Diet Tips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved diet tips
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dietTips:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       tip:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No diet tips found
 *       500:
 *         description: Internal Server Error
 */
router.get('/getdiettips', verifyToken, dietipController.getDietTips);

/**
 * @swagger
 * /diet/updatediettip/{tipId}:
 *   put:
 *     summary: Update a specific diet tip for a user
 *     tags: [Diet Tips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: tipId
 *         in: path
 *         required: true
 *         description: The ID of the diet tip to update
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
 *                 example: "Reduce sugar intake."
 *     responses:
 *       200:
 *         description: Diet tip updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedTip:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     tip:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Internal Server Error
 */
router.put('/updatediettip/:tipId', verifyToken, dietipController.updateDietTip);

/**
 * @swagger
 * /diet/deletediettip/{tipId}:
 *   delete:
 *     summary: Delete a specific diet tip for a user
 *     tags: [Diet Tips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: tipId
 *         in: path
 *         required: true
 *         description: The ID of the diet tip to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Diet tip deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedTip:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     tip:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deletediettip/:tipId', verifyToken, dietipController.deleteDietTip);

module.exports = router;
