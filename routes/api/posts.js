const express = require("express");
const router = express.Router();

//Get Posts
router.get("/", (req, res) => res.send("Posts Route"));

module.exports = router;
