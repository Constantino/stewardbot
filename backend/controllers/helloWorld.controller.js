const { request, response } = require('express');

const {
    sayHelloService
} = require ('../services/helloWorld.service')

const sayHello = async (req = request, res = response) => {
    const query = req.query;

    const msg = sayHelloService()

    res.json({
        message: msg
    })
}

module.exports = { 
    sayHello
}
