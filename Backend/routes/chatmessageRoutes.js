const express = require('express');
const router = express.Router();
const chatMessageController = require('../controllers/chatmessageController');
const verifyToken = require('../utils/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Anonymous chat
 *   description: Operations related to anonymous chat messages
 *   x-order: 2
 */

/**
 * @swagger
 * /chat/chatmessages:
 *   post:
 *     summary: Create a new chat message
 *     tags: [Anonymous chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hello, how are you?"
 *     responses:
 *       201:
 *         description: Chat message created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newChatMessage:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     message:
 *                       type: string
 *                     sentimentScore:
 *                       type: number
 *                     userId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Internal Server Error
 */
router.post('/chatmessages', verifyToken, chatMessageController.createChatMessage);

/**
 * @swagger
 * /chat/chatmessages:
 *   get:
 *     summary: Get all chat messages for the authenticated user
 *     tags: [Anonymous chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       message:
 *                         type: string
 *                       sentimentScore:
 *                         type: number
 *                       userId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal Server Error
 */
router.get('/chatmessages', verifyToken, chatMessageController.getUserChatMessages);

/**
 * @swagger
 * /chat/chatmessages/{messageId}:
 *   delete:
 *     summary: Delete a chat message by ID
 *     tags: [Anonymous chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: messageId
 *         in: path
 *         required: true
 *         description: The ID of the chat message to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat message deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Chat message not found or unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete('/chatmessages/:messageId', verifyToken, chatMessageController.deleteChatMessage);

module.exports = router;
