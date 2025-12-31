const express = require("express");
const router = express.Router();
const { predictCrowd } = require("../controllers/predictController");

router.post("/", predictCrowd);

module.exports = router;
