const prisma = require('../db/db');
const logger = require("../logger/logger");

const createTherapyAppointment = async (req, res) => {
    try {
        const { therapistId, appointmentDate, googleMeet } = req.body;

        // Check if the therapist exists
        const therapist = await prisma.therapistProfile.findUnique({
            where: { id: therapistId },
        });
        if (!therapist) {
            logger.error("Therapist not found during appointment creation");
            return res.status(404).json({ error: "Therapist not found" });
        }

        // Create the appointment
        const therapyAppointment = await prisma.therapyAppointment.create({
            data: {
                userId: req.userId,
                therapistId: therapist.userId,
                appointmentDate: new Date(appointmentDate),
                googleMeet,
                status: "pending", // Default status is 'pending'
            },
        });

        logger.info("New therapy appointment created successfully");
        res.status(201).json({
            message: "Therapy appointment created",
            therapyAppointment,
        });
    } catch (err) {
        logger.error("Error creating therapy appointment: " + err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getTherapyAppointmentsForUser = async (req, res) => {
    try {
        const therapyAppointments = await prisma.therapyAppointment.findMany({
            where: { userId: req.userId },
            include: { therapist: true }, // Include therapist details
        });

        logger.info("User therapy appointments retrieved successfully");
        res.status(200).json(therapyAppointments);
    } catch (err) {
        logger.error("Error retrieving user therapy appointments: " + err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getTherapyAppointmentsForTherapist = async (req, res) => {
    try {
        // Check if the user is a therapist
        const therapistProfile = await prisma.therapistProfile.findUnique({
            where: { userId: req.userId }
        });

        if (!therapistProfile) {
            logger.error("Unauthorized access attempt to therapist appointments");
            return res.status(403).json({ error: "Not authorized to view appointments" });
        }

        // Fetch all appointments for this therapist
        const therapyAppointments = await prisma.therapyAppointment.findMany({
            where: { therapistId: req.userId },
            include: { user: true }, // Include user details
        });

        logger.info("Therapist appointments retrieved successfully");
        res.status(200).json(therapyAppointments);
    } catch (err) {
        logger.error("Error retrieving therapist appointments: " + err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateTherapyAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;

        // Check if the appointment exists
        const therapyAppointment = await prisma.therapyAppointment.findUnique({
            where: { id: appointmentId },
        });

        if (!therapyAppointment) {
            logger.error("Appointment not found during status update");
            return res.status(404).json({ error: "Appointment not found" });
        }

        // Only the therapist can update the status
        if (therapyAppointment.therapistId !== req.userId) {
            logger.error("Unauthorized status update attempt");
            return res.status(403).json({ error: "Not authorized to update status" });
        }

        // Update the status
        const updatedAppointment = await prisma.therapyAppointment.update({
            where: { id: appointmentId },
            data: { status },
        });

        logger.info("Therapy appointment status updated successfully");
        res.status(200).json({
            message: "Therapy appointment status updated",
            updatedAppointment,
        });
    } catch (err) {
        logger.error("Error updating therapy appointment status: " + err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteTherapyAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        // Check if the appointment exists
        const therapyAppointment = await prisma.therapyAppointment.findUnique({
            where: { id: appointmentId },
        });

        if (!therapyAppointment) {
            logger.error("Appointment not found during deletion");
            return res.status(404).json({ error: "Appointment not found" });
        }

        // Only the user who created the appointment can delete it
        if (therapyAppointment.userId !== req.userId) {
            logger.error("Unauthorized deletion attempt");
            return res.status(403).json({ error: "Not authorized to delete this appointment" });
        }

        // Delete the appointment
        await prisma.therapyAppointment.delete({
            where: { id: appointmentId },
        });

        logger.info("Therapy appointment deleted successfully");
        res.status(200).json({ message: "Therapy appointment deleted" });
    } catch (err) {
        logger.error("Error deleting therapy appointment: " + err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    createTherapyAppointment,
    getTherapyAppointmentsForUser,
    getTherapyAppointmentsForTherapist,
    updateTherapyAppointmentStatus,
    deleteTherapyAppointment,
};
