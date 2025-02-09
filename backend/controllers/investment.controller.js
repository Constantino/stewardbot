const { request, response } = require("express");

const { processInvestment } = require("../services/investment.service");

const invest = async (req = request, res = response) => {
  const body = req.body;

  const msg = processInvestment(body);

  res.json({
    message: msg,
  });
};

module.exports = {
  invest,
};
