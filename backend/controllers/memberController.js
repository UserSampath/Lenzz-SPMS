const User = require("../models/memberModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};
const otpGenerator = (otpLength) => {
  let otp = "";
  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return Number(otp);
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
    const token = createToken(user._id);
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email,
      token,
      selectedJob: user.selectedJob,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Signup a user
const signupUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, selectedJob, ContactNumber } =
    req.body;

  try {
    const user = await User.signup(
      firstName,
      lastName,
      email,
      password,
      selectedJob,
      ContactNumber
    );
    const token = createToken(user._id);
    res.status(200).json({ email, token, selectedJob: user.selectedJob });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Password Change
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
        subject: "Sending Email for password Reset",
        text: `This link is valid for 2 minutes http://localhost:3000/forgotPassword/${userfind.id}/${setusertoken.verifytoken}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(201).json({ status: 201, message: "Email not send" });
        } else {
          console.log("Email sent", info.response);
          res
            .status(201)
            .json({ status: 201, message: "Email sent succsfully" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//Check the user token
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

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.selectedJob = req.body.selectedJob || user.selectedJob;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      password: updatedUser.password,
      selectedJob: updatedUser.selectedJob,
      token: createToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//Email verification
const SendEmail = async (req, res) => {
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
        subject: "Sending Email for verification",
        text: `This link is valid for 2 minutes `,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(201).json({ status: 201, message: "Email not send" });
        } else {
          console.log("Email sent", info.response);
          res
            .status(201)
            .json({ status: 201, message: "Email sent succsfully" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
///////////////////////////////////////////////////app/////////

const generateOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // const user = await User.forget(email);
    const otp = otpGenerator(6);

    // console.log(otp)
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
    const user = await User.findOne({ email });
    const updateUserDetails = await User.updateOne(
      { email },
      { $set: { otp, otpExpiration: expirationTime } }
    );
    // const userFind = await User.findOne({ email: email });

    if (updateUserDetails.modifiedCount) {
      console.log("otp is ", otp);
      const mailOptions = {
        from: "lenzzhasthiyit@gmail.com",
        to: email,
        subject: "sending Email for password Reset",
        text: `your OTP is ${otp} , the OTP will expire within 5 minutes`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(201).json({ status: 201, message: "email not sent" });
        } else {
          console.log("Email sent", info.response);
          res.status(200).json({ message: "email sent successfully" });
        }
      });
    } else if (!user) {
      res.status(400).json({ error: "Can't find the user" });
    } else {
      res.status(400).json({ error: "Failed to update OTP" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("gdf");

    const user = await User.findOne({ email });
    if (user && user.otp === otp && user.otpExpiration > new Date()) {
      res.status(200).json({ message: "OTP is correct" });
    } else {
      res.status(400).json({ error: "Invalid OTP or OTP expired" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log("gdf");

    const user = await User.resetPassword(email, newPassword);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    if (user) {
      user.password = hash;
      await user.save();
      await User.updateOne(
        { email },
        { $unset: { otp: "", otpExpiration: "" } }
      );
      const token = createToken(user._id);

      res
        .status(200)
        .json({ message: "Password reset successfully", token: token });
    } else {
      res.status(400).json({ error: "Can't find the user " });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    // const { userId } = req.body;
    const userId = req.user._id;
    console.log(userId.toString());

    const users = await User.find();
    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    res.status(404).json({ message: "No users found" });
  }
};

module.exports = {
  passwordlink,
  signupUser,
  loginUser,
  forgotpassword,
  reset,
  updateUserProfile,
  allUsers,
  SendEmail,
  generateOTP,
  checkOTP,
  resetPassword,
  getUsers,
};
