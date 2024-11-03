const prisma = require('../db/db');
const logger = require("../logger/logger");
const axios  = require('axios');
// Function to create a new chat message
const createChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.userId; // Extracted from middleware
        const response = await axios.post(`${process.env.FASTAPI_URL}predict-emotion`, {
            text: message,
         });
        const newChatMessage = await prisma.chatMessage.create({
            data: {
                message: response.data.message,
                sentimentScore: response.data.sentiment_score,
                userId,
            },
        });

        logger.info("Chat message created");
        res.status(201).json({ message: "Chat message created", newChatMessage });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Function to get all chat messages for a user
const getUserChatMessages = async (req, res) => {
    try {
        const userId = req.userId; // Extracted from middleware

        const chatMessages = await prisma.chatMessage.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        logger.info("Chat messages retrieved");
        res.status(200).json({ chatMessages });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Function to delete a chat message
const deleteChatMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId; // Extracted from middleware

        const chatMessage = await prisma.chatMessage.findUnique({
            where: { id: messageId },
        });

        if (!chatMessage || chatMessage.userId !== userId) {
            logger.error("Chat message not found or unauthorized");
            return res.status(404).json({ error: "Chat message not found or unauthorized" });
        }

        await prisma.chatMessage.delete({
            where: { id: messageId },
        });

        logger.info("Chat message deleted");
        res.status(200).json({ message: "Chat message deleted" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    createChatMessage,
    getUserChatMessages,
    deleteChatMessage,
};
