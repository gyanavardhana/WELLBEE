
const dietipController = require('../controllers/diettipController');
const verifyToken = require('../utils/authMiddleware');
const router = require('express').Router();

router.post('/creatediettip', verifyToken, dietipController.createDietTip);
router.get('/getdiettips', verifyToken, dietipController.getDietTips);
router.put('/updatediettip/:tipId', verifyToken, dietipController.updateDietTip);
router.delete('/deletediettip/:tipId', verifyToken, dietipController.deleteDietTip);

module.exports = router;