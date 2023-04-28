const express = require("express");
const {
  loginUser,
  signupUser,
  passwordlink,
  forgotpassword,
  reset,
  updateUserProfile,
  allUsers,
  SendEmail,
  generateOTP,
  resetPassword,
  getUsers,
  checkOTP,
  getUser,
} = require("../controllers/memberController");
const requireAuth = require("../middleware/requireAuth");
const appUserAuthentication = require("../middleware/appUserAuthentication");
const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/sendpasswordlink", passwordlink);
router.post("/verifyEmail", SendEmail);
router.get("/forgotPassword/:id/:token", forgotpassword);
router.post("/:id/:token", reset);
router.post("/update", requireAuth, updateUserProfile);
router.get("/", requireAuth, allUsers);

//app
router.post("/generateOTP", generateOTP);
router.post("/resetPassword", resetPassword);
router.get("/getUsers", appUserAuthentication, getUsers);
router.post("/checkOTP", checkOTP);
router.get("/getUser", requireAuth, getUser);

module.exports = router;
