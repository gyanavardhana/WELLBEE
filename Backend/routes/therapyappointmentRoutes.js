const router = require('express').Router();
const verifyToken = require('../utils/authMiddleware');
const therapyappointmentController = require('../controllers/therapyappointmentController');

router.post('/createappointment', verifyToken, therapyappointmentController.createTherapyAppointment);
router.get('/getuserappointments', verifyToken, therapyappointmentController.getTherapyAppointmentsForUser);
router.get('/gettherapistappointments', verifyToken, therapyappointmentController.getTherapyAppointmentsForTherapist);
router.put('/updateappointment/:appointmentId', verifyToken, therapyappointmentController.updateTherapyAppointmentStatus);
router.delete('/deleteappointment/:appointmentId', verifyToken, therapyappointmentController.deleteTherapyAppointment);


module.exports = router;