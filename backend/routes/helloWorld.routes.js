const { Router } = require('express');
const { 
    sayHello,
} = require('../controllers/helloWorld.controller');

const router = Router();

router.get('/', sayHello);

module.exports = router;