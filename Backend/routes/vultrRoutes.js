const express = require('express');
const router = express.Router();
const { getVultrChatResponse } = require('../controllers/vultrController');

router.post('/api/chat', getVultrChatResponse);

module.exports = router;