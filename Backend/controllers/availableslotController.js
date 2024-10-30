const prisma = require('../db/db');
const logger = require("../logger/logger");

// Create an Available Slot for a therapist
const createAvailableSlot = async (req, res) => {
    try {
        // Get the therapist profile using the userId from the request
        const therapistProfile = await prisma.therapistProfile.findUnique({
            where: { userId: req.userId }
        });

        // Check if the therapist profile exists
        if (!therapistProfile) {
            logger.error("Therapist profile not found");
            return res.status(404).json({ error: "Therapist profile not found" });
        }

        // Extract the therapistProfileId from the fetched therapist profile
        const therapistProfileId = therapistProfile.id;
        const { slot } = req.body;
        console.log(req.body);
        // Create the available slot using the therapistProfileId
        const availableSlot = await prisma.availableSlot.create({
            data: {
                therapistProfileId,
                slot:  new Date(slot), // Ensure slot is a valid Date
            },
        });

        logger.info("Available slot created");
        res.status(201).json({ message: "Available slot created", availableSlot });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Get all available slots for a specific therapist
const getAvailableSlots = async (req, res) => {
    try {
        const therapistProfile = await prisma.therapistProfile.findUnique({
            where: { userId: req.userId }
        });

        // Check if the therapist profile exists
        if (!therapistProfile) {
            logger.error("Therapist profile not found");
            return res.status(404).json({ error: "Therapist profile not found" });
        }

        // Extract the therapistProfileId from the fetched therapist profile
        const therapistProfileId = therapistProfile.id;

        const availableSlots = await prisma.availableSlot.findMany({
            where: { therapistProfileId },
            orderBy: { slot: 'asc' }
        });

        if (!availableSlots || availableSlots.length === 0) {
            logger.error("No available slots found");
            return res.status(404).json({ error: "No available slots found" });
        }

        logger.info("Available slots retrieved");
        res.status(200).json({ availableSlots });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update an Available Slot for a therapist
const updateAvailableSlot = async (req, res) => {
    try {
        const { slotId } = req.params;
        const { slot } = req.body;

        const updatedSlot = await prisma.availableSlot.update({
            where: {
                id: slotId,
            },
            data: {
                slot: new Date(slot), // Ensure slot is a valid Date
            },
        });

        logger.info("Available slot updated");
        res.status(200).json({ message: "Available slot updated", updatedSlot });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete an Available Slot for a therapist
const deleteAvailableSlot = async (req, res) => {
    try {
        const { slotId } = req.params;

        const deletedSlot = await prisma.availableSlot.delete({
            where: {
                id: slotId,
            },
        });

        logger.info("Available slot deleted");
        res.status(200).json({ message: "Available slot deleted", deletedSlot });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all available slots grouped by therapist profile
const getAllSlots = async (req, res) => {
    try {
        // Fetch all therapist profiles along with associated user information
        const therapists = await prisma.therapistProfile.findMany({
            include: {
                user: { // Include user information
                    select: {
                        name: true, // Select the name field
                    },
                },
            },
        });

        if (!therapists || therapists.length === 0) {
            logger.error("No therapists found");
            return res.status(404).json({ error: "No therapists found" });
        }

        // Prepare an array to hold the grouped slots
        const groupedSlots = [];

        // Loop through each therapist profile
        for (const therapist of therapists) {
            // Fetch available slots for the current therapist
            const availableSlots = await prisma.availableSlot.findMany({
                where: { therapistProfileId: therapist.id },
                orderBy: { slot: 'asc' }
            });

            // Push to the groupedSlots array if there are available slots
            if (availableSlots && availableSlots.length > 0) {
                groupedSlots.push({
                    therapistProfile: {
                        ...therapist,
                        userName: therapist.user.name, // Add the user's name
                    },
                    slots: availableSlots,
                });
            }
        }

        // Check if there are any grouped slots
        if (groupedSlots.length === 0) {
            logger.error("No available slots found for any therapists");
            return res.status(404).json({ error: "No available slots found for any therapists" });
        }

        logger.info("Available slots grouped by therapist retrieved");
        res.status(200).json({ groupedSlots });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    createAvailableSlot,
    getAvailableSlots,
    updateAvailableSlot,
    deleteAvailableSlot,
    getAllSlots, // Export the new function
};



