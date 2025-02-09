const { Router } = require('express');
const { 
    invest,
} = require('../controllers/investment.controller');

const router = Router();

router.post('/', invest);

module.exports = router;