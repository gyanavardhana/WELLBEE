const router = require('express').Router();
const availableslotController = require('../controllers/availableslotController');
const verifyToken = require('../utils/authMiddleware');


router.post('/createslot', verifyToken, availableslotController.createAvailableSlot);
router.get('/getslots', verifyToken, availableslotController.getAvailableSlots);
router.put('/updateslot/:slotId', verifyToken, availableslotController.updateAvailableSlot);
router.delete('/deleteslot/:slotId', verifyToken, availableslotController.deleteAvailableSlot);

module.exports = router;
