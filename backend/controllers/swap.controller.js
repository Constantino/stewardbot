const { request, response } = require("express");
const { executeSwapService } = require("../services/swapTokens.service");

const swapTokens = async (req = request, res = response) => {
  try {
    const { buyToken, sellToken, network, distributionFunds } = req.body; // Extract params from request body

    // Validate required parameters
    if (
      !buyToken ||
      !sellToken ||
      !network ||
      distributionFunds === undefined
    ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // Validate percentage range
    if (distributionFunds < 1 || distributionFunds > 100) {
      return res
        .status(400)
        .json({ error: "distributionFunds must be between 1 and 100" });
    }

    // Execute swap
    const result = await executeSwapService({
      buyToken,
      sellToken,
      network,
      percentage: distributionFunds,
    });

    // Respond with transaction result
    res.json({
      success: true,
      transactionHash: result.transactionHash,
    });
  } catch (error) {
    console.error("Swap error:", error);
    res
      .status(500)
      .json({ error: error.message || "An error occurred during the swap" });
  }
};

module.exports = {
  swapTokens,
};
