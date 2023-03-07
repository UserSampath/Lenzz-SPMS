const User = require("../models/memberModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
var nodemailer = require("nodemailer");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const keysecret = process.env.SECRET;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lenzzhasthiyit@gmail.com",
    pass: "mfmpeqgzbjbxkcja",
  },
});
// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token, selectedJob: user.selectedJob });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, selectedJob } = req.body;

  try {
    const user = await User.signup(
      firstName,
      lastName,
      email,
      password,
      selectedJob
    );

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token, selectedJob: user.selectedJob });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const passwordlink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.forget(email);
    const userfind = await User.findOne({ email: email, user });
    const token = jwt.sign({ _id: userfind._id }, keysecret, {
      expiresIn: "1d",
    });
    const setusertoken = await User.findByIdAndUpdate(
      { _id: userfind._id },
      { verifytoken: token },
      { new: true }
    );
    if (setusertoken) {
      const mailOptions = {
        from: "lenzzhasthiyit@gmail.com",
        to: email,
        subject: "sending Email for password Reset",
        text: `this link is valid for 2 minutes http://localhost:3000/forgotPassword/${userfind.id}/${setusertoken.verifytoken}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(201).json({ status: 201, message: "email not send" });
        } else {
          console.log("Email sent", info.response);
          res
            .status(201)
            .json({ status: 201, message: "email sent succsfully" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const forgotpassword = async (req, res) => {
  const { id, token } = req.params;
  try {
    const validuser = await User.findOne({ _id: id, verifytoken: token });
    const verifyToken = jwt.verify(token, keysecret);
    console.log(verifyToken);
    if (validuser && verifyToken._id) {
      res.status(201).json({ status: 201, validuser });
    } else {
      res.status(401).json({ status: 401, message: "user not exits" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};

const reset = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const validuser = await User.findOne({ id: id, verifytoken: token });
    const verifyToken = jwt.verify(token, keysecret);

    if (validuser && verifyToken._id) {
      const newpassword = await bcrypt.hash(password, 12);

      const setnewuserpass = await User.findByIdAndUpdate(
        { _id: id },
        { password: newpassword }
      );
      setnewuserpass.save();
      res.status(201).json({ status: 201, setnewuserpass });
    } else {
      res.status(401).json({ status: 401, message: "user not exits" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.serach
    ? {
        $or: [
          { name: { $regex: req.query.serach, $options: "i" } },
          { email: { $regex: req.query.serach, $options: "i" } },
        ],
      }
    : {};

  // Check if req.user exists before accessing its _id property
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = {
  passwordlink,
  signupUser,
  loginUser,
  forgotpassword,
  reset,
  allUsers,
};
