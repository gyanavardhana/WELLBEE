const prisma = require('../db/db');
const logger = require("../logger/logger");

// Create an ExerciseTip for a user
const createExerciseTip = async (req, res) => {
    try {
        const userId = req.userId;
        const { tip } = req.body;

        const exerciseTip = await prisma.exerciseTip.create({
            data: {
                userId,
                tip,
            },
        });

        logger.info("Exercise tip created");
        res.status(201).json({ message: "Exercise tip created", exerciseTip });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all exercise tips for a user
const getExerciseTips = async (req, res) => {
    try {
        const userId = req.userId;

        const exerciseTips = await prisma.exerciseTip.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        if (!exerciseTips || exerciseTips.length === 0) {
            logger.error("No exercise tips found");
            return res.status(404).json({ error: "No exercise tips found" });
        }

        logger.info("Exercise tips retrieved");
        res.status(200).json({ exerciseTips });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update a specific exercise tip for a user
const updateExerciseTip = async (req, res) => {
    try {
        const userId = req.userId;
        const { tipId } = req.params;
        const { tip } = req.body;

        const updatedTip = await prisma.exerciseTip.update({
            where: {
                id: tipId,
            },
            data: {
                tip,
            },
        });

        logger.info("Exercise tip updated");
        res.status(200).json({ message: "Exercise tip updated", updatedTip });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a specific exercise tip for a user
const deleteExerciseTip = async (req, res) => {
    try {
        const userId = req.userId;
        const { tipId } = req.params;

        const deletedTip = await prisma.exerciseTip.delete({
            where: {
                id: tipId,
            },
        });

        logger.info("Exercise tip deleted");
        res.status(200).json({ message: "Exercise tip deleted", deletedTip });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createExerciseTip, getExerciseTips, updateExerciseTip, deleteExerciseTip };
