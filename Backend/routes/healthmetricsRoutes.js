const router = require('express').Router();
const healthmetricsController = require('../controllers/healthmetricsController');
const verifyToken = require('../utils/authMiddleware');

router.post('/createmetric', verifyToken, healthmetricsController.createHealthMetric);
router.get('/getmetrics', verifyToken,  healthmetricsController.getHealthMetrics);
router.put('/updatemetric/:metricId', verifyToken, healthmetricsController.updateHealthMetric);
router.delete('/deletemetric/:metricId', verifyToken, healthmetricsController.deleteHealthMetric);

module.exports = router;