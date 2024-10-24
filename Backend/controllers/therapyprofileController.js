const prisma = require('../db/db');
const logger = require("../logger/logger");

// Create a TherapistProfile for a user (therapist)
const createTherapistProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { specialization } = req.body;

        // Check if the therapist profile already exists for this user
        const existingProfile = await prisma.therapistProfile.findUnique({
            where: { userId }
        });

        if (existingProfile) {
            logger.error("Therapist profile already exists for this user");
            return res.status(400).json({ error: "Therapist profile already exists for this user" });
        }

        const therapistProfile = await prisma.therapistProfile.create({
            data: {
                userId,
                specialization,
            },
        });

        logger.info("Therapist profile created");
        res.status(201).json({ message: "Therapist profile created", therapistProfile });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all therapist profiles

const getAllTherapistProfiles = async (req, res) => {
    try {
        const therapistProfiles = await prisma.therapistProfile.findMany({
            include: { availableSlots: true } // Optionally include available slots
        });

        logger.info("Therapist profiles retrieved");
        res.status(200).json({ therapistProfiles });
    }
    catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get therapist profile for the current user
const getTherapistProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const therapistProfile = await prisma.therapistProfile.findUnique({
            where: { userId },
            include: { availableSlots: true } // Optionally include available slots
        });

        if (!therapistProfile) {
            logger.error("Therapist profile not found");
            return res.status(404).json({ error: "Therapist profile not found" });
        }

        logger.info("Therapist profile retrieved");
        res.status(200).json({ therapistProfile });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update a therapist's profile (specialization or ratings)
const updateTherapistProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { specialization, ratings } = req.body;

        const updatedProfile = await prisma.therapistProfile.update({
            where: {
                userId,
            },
            data: {
                specialization,
                ratings: ratings ? parseFloat(ratings) : undefined, // Optional ratings update
            },
        });

        logger.info("Therapist profile updated");
        res.status(200).json({ message: "Therapist profile updated", updatedProfile });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete therapist profile for a user
const deleteTherapistProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const deletedProfile = await prisma.therapistProfile.delete({
            where: {
                userId,
            },
        });

        logger.info("Therapist profile deleted");
        res.status(200).json({ message: "Therapist profile deleted", deletedProfile });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createTherapistProfile, getAllTherapistProfiles, getTherapistProfile, updateTherapistProfile, deleteTherapistProfile };
