const { Router } = require("express");
const { stakeController } = require("../controllers/stake.controller");

const router = Router();

router.post("/", stakeController);

module.exports = router;
