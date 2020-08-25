const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");

//Get Profile of logged in user(current user)
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(401).json({ msg: "There is no profile" });
    }
  } catch (error) {
    console.error("error occured");
    res.status(401).send("Server error");
  }
});

module.exports = router;
