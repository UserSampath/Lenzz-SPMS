const express = require("express");
const {
  loginUser,
  signupUser,
  passwordlink,
  forgotpassword,
  reset,
  updateUserProfile,
  profilePictureUpdate,
  allUsers,
  SendEmail,
  generateOTP,
  resetPassword,
  getUsers,
  checkOTP,
  getUser,
  getUserFromCompany

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
router.post("/profilePictureUpdate", requireAuth, profilePictureUpdate);


router.post("/", requireAuth, allUsers);

//app
router.post("/generateOTP", generateOTP);
router.post("/resetPassword", resetPassword);
router.get("/getUsers", appUserAuthentication, getUsers);
router.post("/checkOTP", checkOTP);
router.get("/getUser", requireAuth, getUser);
router.post("/getUserFromCompany", getUserFromCompany);


module.exports = router;
