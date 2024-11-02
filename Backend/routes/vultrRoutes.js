const express = require('express');
const router = express.Router();
const { getVultrChatResponse } = require('../controllers/vultrController');

router.post('/chat', getVultrChatResponse);

module.exports = router;