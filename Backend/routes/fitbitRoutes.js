// routes/fitbitRoutes.js

const express = require('express');
const router = express.Router();
const fitbitController = require('../controllers/fitbitController');

router.get('/auth', fitbitController.getAuthUrl);
router.get('/callback', fitbitController.getAccessToken);
router.get('/profile', fitbitController.getProfile);
router.get('/activities', fitbitController.getActivityData);
router.get('/heartrate', fitbitController.getHeartRateData);

module.exports = router;
