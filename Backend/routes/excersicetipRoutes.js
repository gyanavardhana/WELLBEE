const router = require('express').Router();
const verifyToken = require('../utils/authMiddleware');
const excersicetipController = require('../controllers/excersicetipController');

router.post('/createexcersicetip', verifyToken, excersicetipController.createExerciseTip);
router.get('/getexcersicetips', verifyToken, excersicetipController.getExerciseTips);
router.put('/updateexcersicetip/:tipId', verifyToken, excersicetipController.updateExerciseTip);
router.delete('/deleteexcersicetip/:tipId',verifyToken, excersicetipController.deleteExerciseTip);

module.exports = router;