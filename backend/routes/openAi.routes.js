const { Router } = require('express');
const { 
    getAIResponse,
    getThreadId
} = require('../controllers/openAi.controller');

const router = Router();

router.get('/thread', getThreadId);
router.post('/', getAIResponse);

module.exports = router;