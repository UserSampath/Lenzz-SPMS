const express = require("express");

// controller functions
const {
  loginUser,
  signupUser,
  passwordlink,
  forgotpassword,
  reset,
} = require("../controllers/memberController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

router.post("/sendpasswordlink", passwordlink);

router.get("/forgotPassword/:id/:token", forgotpassword);

router.post("/:id/:token", reset);

module.exports = router;
