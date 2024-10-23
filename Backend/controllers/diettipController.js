const prisma = require('../db/db');
const logger = require("../logger/logger");

// Create a DietTip for a user
const createDietTip = async (req, res) => {
    try {
        const userId = req.userId;
        const { tip } = req.body;
        const dietTip = await prisma.dietTip.create({
            data: {
                userId,
                tip,
            },
        })

        logger.info("Diet tip created");
        res.status(201).json({ message: "Diet tip created", dietTip });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all diet tips for a user
const getDietTips = async (req, res) => {
    try {
        const userId = req.userId;

        const dietTips = await prisma.dietTip.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        if (!dietTips || dietTips.length === 0) {
            logger.error("No diet tips found");
            return res.status(404).json({ error: "No diet tips found" });
        }

        logger.info("Diet tips retrieved");
        res.status(200).json({ dietTips });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Update a specific diet tip for a user
const updateDietTip = async (req, res) => {
    try {
        const userId = req.userId;
        const { tipId } = req.params;
        const { tip } = req.body;

        const updatedTip = await prisma.dietTip.update({
            where: {
                id: tipId,
            },
            data: {
                tip,
            },
        });

        logger.info("Diet tip updated");
        res.status(200).json({ message: "Diet tip updated", updatedTip });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a specific diet tip for a user
const deleteDietTip = async (req, res) => {
    try {
        const userId = req.userId;
        const { tipId } = req.params;

        const deletedTip = await prisma.dietTip.delete({
            where: {
                id: tipId,
            },
        });

        logger.info("Diet tip deleted");
        res.status(200).json({ message: "Diet tip deleted", deletedTip });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = { createDietTip, getDietTips, updateDietTip, deleteDietTip };