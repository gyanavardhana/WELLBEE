const router = require('express').Router();
const verifyToken = require('../utils/authMiddleware');
const therapyprofileController = require('../controllers/therapyprofileController');

router.get('/therapistprofile', verifyToken, therapyprofileController.getTherapistProfile);
router.get('/therapistprofiles', verifyToken, therapyprofileController.getAllTherapistProfiles);
router.post('/therapistprofile', verifyToken, therapyprofileController.createTherapistProfile);
router.put('/therapistprofile', verifyToken, therapyprofileController.updateTherapistProfile);
router.put('/therapistprofile/rating', verifyToken, therapyprofileController.updateTherapistProfilebyUser);
router.post('/chat', therapyprofileController.chatHandler);
router.delete('/therapistprofile', verifyToken, therapyprofileController.deleteTherapistProfile);

module.exports = router;