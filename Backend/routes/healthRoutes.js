const express = require('express');
const { getHealthInfo } = require('../controllers/healthController');

const router = express.Router();


router.post('/health-info', getHealthInfo);

module.exports = router;