const router = require('express').Router();
const verifyToken = require('../utils/authMiddleware');
const therapyappointmentController = require('../controllers/therapyappointmentController');

/**
 * @swagger
 * tags:
 *   name: Therapy Appointment
 *   description: API endpoints for managing therapy appointments
 */

/**
 * @swagger
 * /appointment/createappointment:
 *   post:
 *     summary: Create a therapy appointment
 *     description: Creates a new therapy appointment for the authenticated user.
 *     tags: [Therapy Appointment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               therapistId:
 *                 type: string
 *                 description: The ID of the therapist for the appointment
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time of the appointment
 *               googleMeet:
 *                 type: string
 *                 description: Google Meet link for the appointment
 *     responses:
 *       201:
 *         description: Therapy appointment created successfully
 *       404:
 *         description: Therapist not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/createappointment', verifyToken, therapyappointmentController.createTherapyAppointment);

/**
 * @swagger
 * /appointment/getuserappointments:
 *   get:
 *     summary: Get appointments for the authenticated user
 *     description: Retrieves all therapy appointments associated with the authenticated user.
 *     tags: [Therapy Appointment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of therapy appointments retrieved successfully
 *       500:
 *         description: Internal Server Error
 */
router.get('/getuserappointments', verifyToken, therapyappointmentController.getTherapyAppointmentsForUser);

/**
 * @swagger
 * /appointment/gettherapistappointments:
 *   get:
 *     summary: Get appointments for the authenticated therapist
 *     description: Retrieves all therapy appointments associated with the authenticated therapist.
 *     tags: [Therapy Appointment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of therapist appointments retrieved successfully
 *       403:
 *         description: Not authorized to view appointments
 *       500:
 *         description: Internal Server Error
 */
router.get('/gettherapistappointments', verifyToken, therapyappointmentController.getTherapyAppointmentsForTherapist);

/**
 * @swagger
 * /appointment/updateappointment/{appointmentId}:
 *   put:
 *     summary: Update the status of a therapy appointment
 *     description: Updates the status of a specific therapy appointment.
 *     tags: [Therapy Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: appointmentId
 *         in: path
 *         required: true
 *         description: The ID of the appointment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the appointment
 *               googleMeet:
 *                 type: string
 *                 description: Updated Google Meet link for the appointment
 *     responses:
 *       200:
 *         description: Therapy appointment status updated successfully
 *       404:
 *         description: Appointment not found
 *       403:
 *         description: Not authorized to update the appointment
 *       500:
 *         description: Internal Server Error
 */
router.put('/updateappointment/:appointmentId', verifyToken, therapyappointmentController.updateTherapyAppointmentStatus);

/**
 * @swagger
 * /appointment/deleteappointment/{appointmentId}:
 *   delete:
 *     summary: Delete a therapy appointment
 *     description: Deletes a specific therapy appointment for the authenticated user.
 *     tags: [Therapy Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: appointmentId
 *         in: path
 *         required: true
 *         description: The ID of the appointment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Therapy appointment deleted successfully
 *       404:
 *         description: Appointment not found
 *       403:
 *         description: Not authorized to delete the appointment
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteappointment/:appointmentId', verifyToken, therapyappointmentController.deleteTherapyAppointment);

module.exports = router;
