const User = require("../models/memberModel");
const Project = require("../models/projectmodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const createToken = require("../util/createToken");
const validator = require("validator");

const keys = ["firstName", "lastName", "email"];

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
      _id: user._id,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Signup a user
const signupUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, selectedJob, contactnumber } =
    req.body;

  try {
    const user = await User.signup(
      firstName,
      lastName,
      email,
      password,
      selectedJob,
      contactnumber
    );
    const token = createToken(user._id);
    res
      .status(200)
      .json({ email, token, selectedJob: user.selectedJob, _id: user._id });
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
        text: `This link send Hasthiya IT software project management system 
        Change your account password(valid for 2 minutes)
         http://localhost:3000/forgotPassword/${userfind.id}/${setusertoken.verifytoken}`,
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
    const validuser = await User.findOne({
      id: id,
      verifytoken: token,
    });
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
    res.status(400).json({ error: error.message });
  }
};

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    if (!req.body.firstName) {
      res.status(400).json({ error: "First name is required" });
      return;
    }
    if (!req.body.lastName) {
      res.status(400).json({ error: "Last name is required" });
      return;
    }
    if (!validator.isEmail(req.body.email)) {
      res.status(400).json({ error: "Email not valid" });
      return;
    }
    if (!validator.isLength(req.body.firstName, { max: 255 })) {
      res
        .status(400)
        .json({ error: "First name must be between 2 and 255 characters" });
      return;
    }
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.selectedJob = req.body.selectedJob || user.selectedJob;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const profilePictureUpdate = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.profilePicture = req.body.profilePicture;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  // const keyword = req.body.search
  //   ? {
  //     $or: [
  //       { firstName: { $regex: req.body.search, $options: "i" } },
  //       { email: { $regex: req.body.search, $options: "i" } },
  //     ],
  //   }
  //   : {};

  // const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // res.send(users);

  const { id, search } = req.body;
  try {
    const project = await Project.findById(id).populate("users");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    const projectUsers = project.users;
    const members = await Promise.all(
      projectUsers.map(async (user) => {
        const member = await User.findById(user.user_id);
        const ProjectUserObj = {
          projectUserRole: user.role,
          projectUserId: user._id,
        };
        const memberObj = member.toObject();
        const concatenatedObj = Object.assign({}, memberObj, ProjectUserObj);
        return concatenatedObj;
      })
    );

    const a = members.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(search))
    );
    res.status(200).json(a);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
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

const getUser = async (req, res) => {
  try {
    const { _id, selectedJob } = req;
    const user = await User.findById(_id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "No user found" });
    }
  } catch (error) {
    res.status(404).json({ message: "No users found" });
  }
};

const getUserFromCompany = async (req, res) => {
  const companyId = req.body.companyId;
  try {
    const users = await User.find({ companyId: companyId });
    res.status(200).json(users);
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
  profilePictureUpdate,
  allUsers,
  SendEmail,
  generateOTP,
  checkOTP,
  resetPassword,
  getUsers,
  getUser,
  getUserFromCompany,
};
