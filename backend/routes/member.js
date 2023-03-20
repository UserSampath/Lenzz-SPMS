const express = require("express");
const {
  loginUser,
  signupUser,
  passwordlink,
  forgotpassword,
  reset,
  updateUserProfile,
  allUsers,
} = require("../controllers/memberController");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/sendpasswordlink", passwordlink);
router.get("/forgotPassword/:id/:token", forgotpassword);
router.post("/:id/:token", reset);
router.post("/update", requireAuth, updateUserProfile);
router.get("/", requireAuth, allUsers);
module.exports = router;
