const express = require("express");
const router = express.Router();

//Get users
router.get("/", (req, res) => res.send("User Route"));

module.exports = router;
