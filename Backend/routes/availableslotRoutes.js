const router = require('express').Router();
const availableslotController = require('../controllers/availableslotController');
const verifyToken = require('../utils/authMiddleware');

/**
 * @swagger
 * /slot/createslot:
 *   post:
 *     summary: Create an available slot for a therapist
 *     description: Allows a therapist to create an available slot for booking.
 *     tags:
 *       - Available Slots
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slot:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the available slot
 *     responses:
 *       201:
 *         description: Available slot created
 *       401:
 *         description: Unauthorized access - Token required
 *       500:
 *         description: Internal Server Error
 */
router.post('/createslot', verifyToken, availableslotController.createAvailableSlot);

/**
 * @swagger
 * /slot/getallslots:
 *   get:
 *     summary: Retrieve all available slots grouped by therapist
 *     description: Fetches all available slots for all therapists, grouped by therapist profile.
 *     tags:
 *       - Available Slots
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available slots grouped by therapist
 *       401:
 *         description: Unauthorized access - Token required
 *       404:
 *         description: No available slots found
 *       500:
 *         description: Internal Server Error
 */
router.get('/getallslots', verifyToken, availableslotController.getAllSlots);

/**
 * @swagger
 * /slot/getslots:
 *   get:
 *     summary: Retrieve available slots for a specific therapist
 *     description: Fetches available slots for the authenticated therapist.
 *     tags:
 *       - Available Slots
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available slots for the therapist
 *       401:
 *         description: Unauthorized access - Token required
 *       404:
 *         description: No available slots found for the therapist
 *       500:
 *         description: Internal Server Error
 */
router.get('/getslots', verifyToken, availableslotController.getAvailableSlots);

/**
 * @swagger
 * /slot/updateslot/{slotId}:
 *   put:
 *     summary: Update an available slot for a therapist
 *     description: Updates an existing available slot with a new date and time.
 *     tags:
 *       - Available Slots
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the slot to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slot:
 *                 type: string
 *                 format: date-time
 *                 description: New date and time for the available slot
 *     responses:
 *       200:
 *         description: Available slot updated
 *       401:
 *         description: Unauthorized access - Token required
 *       404:
 *         description: Slot not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/updateslot/:slotId', verifyToken, availableslotController.updateAvailableSlot);

/**
 * @swagger
 * /slot/deleteslot/{slotId}:
 *   delete:
 *     summary: Delete an available slot for a therapist
 *     description: Removes an available slot by its ID.
 *     tags:
 *       - Available Slots
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the slot to be deleted
 *     responses:
 *       200:
 *         description: Available slot deleted
 *       401:
 *         description: Unauthorized access - Token required
 *       404:
 *         description: Slot not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteslot/:slotId', verifyToken, availableslotController.deleteAvailableSlot);

module.exports = router;
