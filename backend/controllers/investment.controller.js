const { request, response } = require("express");
const { processInvestment } = require("../services/investment.service");

const invest = async (req = request, res = response) => {
  try {
    const result = await processInvestment(req.body);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = {
  invest,
};
