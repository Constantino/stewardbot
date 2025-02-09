const { Router } = require("express");
const { swapTokens } = require("../controllers/swap.controller");

const router = Router();

router.get("/", swapTokens);

module.exports = router;
