const prisma = require('../db/db');
const logger = require("../logger/logger");

// Create a HealthMetric for a user
const createHealthMetric = async (req, res) => {
    try {
        const  userId  = req.userId;
        const { dailySteps, heartRate, sleepHours, waterIntake } = req.body;

        const healthMetric = await prisma.healthMetrics.create({
            data: {
                userId,
                dailySteps: dailySteps || 0, // Default to 0 if not provided
                heartRate,
                sleepHours,
                waterIntake,
            },
        });

        logger.info("Health metric created");
        res.status(201).json({ message: "Health metric created", healthMetric });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all health metrics for a user
const getHealthMetrics = async (req, res) => {
    try {
        const  userId  = req.userId;

        const healthMetrics = await prisma.healthMetrics.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        if (!healthMetrics || healthMetrics.length === 0) {
            logger.error("No health metrics found");
            return res.status(404).json({ error: "No health metrics found" });
        }

        logger.info("Health metrics retrieved");
        res.status(200).json({ healthMetrics });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update a specific health metric for a user
const updateHealthMetric = async (req, res) => {
    try {
        const  userId  = req.userId;  
        const { metricId } = req.params;
        const { dailySteps, heartRate, sleepHours, waterIntake } = req.body;

        const updatedMetric = await prisma.healthMetrics.update({
            where: {
                id: metricId,
            },
            data: {
                dailySteps,
                heartRate,
                sleepHours,
                waterIntake,
            },
        });

        logger.info("Health metric updated");
        res.status(200).json({ message: "Health metric updated", updatedMetric });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a specific health metric for a user
const deleteHealthMetric = async (req, res) => {
    try {
        const  userId  = req.userId; 
        const { metricId } = req.params;

        // Delete the health metric
        await prisma.healthMetrics.delete({
            where: {
                id: metricId,
            },
        });

        logger.info("Health metric deleted");
        res.status(200).json({ message: "Health metric deleted successfully" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createHealthMetric, getHealthMetrics, updateHealthMetric, deleteHealthMetric };
