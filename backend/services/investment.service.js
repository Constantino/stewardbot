const axios = require("axios");

const SUPPORTED_NETWORKS = ["ethereum", "polygon", "arbitrum"];

// NOTE: Constantino, I wasn't sure how to handle this calling another service within a service.
// This was the solution I came up with. I also had to install axios, lmk if there's a better way.

const BASE_URL = process.env.SWAP_SERVICE_URL || "http://localhost:3001/api/v1";

const processInvestment = async (body) => {
  if (!SUPPORTED_NETWORKS.includes(body.network)) {
    return { error: "Unsupported network" };
  }

  if (!body.tokens || !Array.isArray(body.tokens)) {
    return { error: "Invalid tokens format. Expected an array." };
  }

  let investmentResults = [];

  for (const tokenObj of body.tokens) {
    const buyToken = Object.keys(tokenObj)[0]; // Extract token name
    console.log(`Investing in ${buyToken} token...`);

    try {
      // Make a POST request to swapTokens service
      const response = await axios.post(`${BASE_URL}/swapTokens`, {
        buyToken,
        sellToken: "WETH", // NOTE: We are assuming sellToken is always WETH for now
        network: body.network,
        distributionFunds: 50, // NOTE: We are ignoring this for now
      });

      if (response.success) {
        investmentResults.push({
          token: buyToken,
          status: "success",
          transactionHash: response.transactionHash,
        });
      } else {
        investmentResults.push({
          token: buyToken,
          status: "error",
          message: "Unknown error occurred.",
        });
      }
    } catch (error) {
      investmentResults.push({
        token: buyToken,
        status: "error",
        message: error.message || `Failed to invest in ${buyToken}.`,
      });
    }
  }
  return { investments: investmentResults };
};

module.exports = {
  processInvestment,
};
