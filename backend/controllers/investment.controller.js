const { request, response } = require('express');

const {
    processInvestment
} = require ('../services/investment.service')

const invest = async (req = request, res = response) => {
    const query = req.query;

    const msg = processInvestment()

    res.json({
        message: msg
    })
}

module.exports = { 
    invest
}
