const prisma = require('../db/db');
const logger = require("../logger/logger");
const axios = require('axios');
// Create an ExerciseTip for a user

const API_HOST = 'exercisedb.p.rapidapi.com';
const API_KEY = process.env.RAPIDAPI_KEY; // Store API key in an environment variable

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




const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
};

const classifyBMI = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi < 29.9) return 'Overweight';
    return 'Obesity';
};


const getBodyPartsForBMI = (bmiCategory) => {
    switch (bmiCategory) {
        case 'Underweight':
            return ['upper arms', 'back'];
        case 'Normal weight':
            return ['back', 'upper legs'];
        case 'Overweight':
            return ['cardio', 'waist'];
        case 'Obesity':
            return ['lower legs', 'waist'];
        default:
            return ['back', 'cardio'];
    }
};


const getExercisesForBodyParts = async (bodyParts) => {
    try {
        const exercisePromises = bodyParts.map((bodyPart) =>
            axios.get(`https://${API_HOST}/exercises/bodyPart/${bodyPart}`, {
                headers: {
                    'x-rapidapi-host': API_HOST,
                    'x-rapidapi-key': API_KEY,
                },
            })
        );
        const responses = await Promise.all(exercisePromises);
        return responses.flatMap(response => response.data);
    } catch (error) {
        logger.error("Error fetching exercises for body parts: ", error.message);
        throw new Error('Exercise API Error');
    }
};


const getExerciseRecommendations = async (req, res) => {
    try {
        const { height, weight } = req.body;

        const bmi = calculateBMI(height, weight);
        const bmiCategory = classifyBMI(bmi);
        const bodyParts = getBodyPartsForBMI(bmiCategory);
        const exercises = await getExercisesForBodyParts(bodyParts);

        logger.info(`Exercise recommendations provided for BMI category: ${bmiCategory}`);
        res.status(200).json({
            bmi: bmi.toFixed(2),
            category: bmiCategory,
            recommendedExercises: exercises,
        });
    } catch (error) {
        logger.error("Error fetching exercise recommendations: ", error.message);
        res.status(500).json({ error: 'Error fetching exercise recommendations' });
    }
};

module.exports = { createExerciseTip, getExerciseTips, updateExerciseTip, deleteExerciseTip, getExerciseRecommendations };
