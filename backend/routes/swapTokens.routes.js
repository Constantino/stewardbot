const { Router } = require("express");
const { swapTokens } = require("../controllers/swap.controller");

const router = Router();

// Accepts buyToken, sellToken, network, and distributionFunds in the request body
router.post("/", swapTokens);

module.exports = router;
