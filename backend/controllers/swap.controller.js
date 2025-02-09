const { request, response } = require("express");

const { executeSwapService } = require("../services/swapTokens.service");

const swapTokens = async (req = request, res = response) => {
  const query = req.query;

  const msg = executeSwapService();

  res.json({
    message: msg,
  });
};

module.exports = {
  swapTokens,
};
