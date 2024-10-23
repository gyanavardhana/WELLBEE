const express = require('express');
const router = express.Router();
const chatMessageController = require('../controllers/chatmessageController');
const verifyToken = require('../utils/authMiddleware');
router.post('/chatmessages', verifyToken, chatMessageController.createChatMessage);
router.get('/chatmessages', verifyToken, chatMessageController.getUserChatMessages);
router.delete('/chatmessages/:messageId', verifyToken, chatMessageController.deleteChatMessage);

module.exports = router;
