const { request, response } = require("express");
const { processStaking } = require("../services/stake.service");

const stakeController = async (req = request, res = response) => {
  try {
    const result = await processStaking(req.body);
    res.json({
      message: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = {
  stakeController,
};
