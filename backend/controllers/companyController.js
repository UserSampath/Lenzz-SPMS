const Company = require("../models/companyModel");
const User = require("../models/memberModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lenzzhasthiyit@gmail.com",
    pass: "mfmpeqgzbjbxkcja",
  },
});

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};

const createCompany = async (req, res) => {
  const { companyname, contactnumber, companyemail, companyaddress } = req.body;
  const { id, selectedJob } = req;
  if (selectedJob !== "SYSTEM ADMIN") {
    return res.status(401).json({ error: "User is not authorized" });
  }

  try {
    const companyKey = generateRandomString(8);
    const user_id = req.user._id;
    const company = await Company.createcompany(
      companyname,
      contactnumber,
      companyaddress,
      companyemail,
      user_id,
      companyKey
    );

    const updatedUser = await User.findByIdAndUpdate(user_id, {
      companyId: company._id,
    });
    console.log(updatedUser);
    const token = createToken(company._id);

    res.status(200).json({ company, companyname, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkcompany = async (req, res) => {
  const { companyKey } = req.body;
  const { _id, selectedJob } = req;
  if (selectedJob === "SYSTEM ADMIN") {
    return res.status(401).json({ error: "User is not authorized" });
  }
  try {
    const company = await Company.findOne({ companyKey });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    console.log(company.companyname);
    console.log(_id);

    const updatedUser = await User.findByIdAndUpdate(_id, {
      companyId: company._id,
    });
    console.log("updatedUser", updatedUser);
    res.status(200).json({ company });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const generateRandomString = (myLength) => {
  try {
    const chars =
      "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );
    const randomString = randomArray.join("");
    return randomString;
  } catch (error) {
    throw new Error("Failed to generate random string.");
  }
};

const randomkey = async (req, res) => {
  try {
    const key = generateRandomString(8);
    res.send(key);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const companyUsers = async (req, res) => {
  try {
    const { _id } = req;
    const user = await User.findById(_id);
    const allUsersInSameCompany = await User.find({
      companyId: user.companyId,
    });
    if (user) {
      console.log(user);
      res.send(allUsersInSameCompany);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (company) {
    res.json(company);
  } else {
    res.status(404).json({ error: error.message });
    res.status(404).json({ message: "company not found" });
  }
});
const updateCompanyData = async (req, res) => {
  const {
    companyname,
    companyKey,
    companyaddress,
    contactnumber,
    companyemail,
    _id,
  } = req.body;
  const { id, selectedJob } = req;
  if (selectedJob !== "SYSTEM ADMIN") {
    return res.status(401).json({ error: "User is not authorized" });
  }
  try {
    const company = await Company.updateCompany(
      companyname,
      companyKey,
      companyaddress,
      contactnumber,
      companyemail,
      _id
    );
    console.log(company);
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sendInvitation = async (req, res) => {
  const company = req.body.company;
  const mail = req.body.mail;
  const companyKey = req.body.companyKey;
  const { id, selectedJob } = req;
  if (selectedJob !== "SYSTEM ADMIN") {
    return res.status(401).json({ error: "User is not authorized" });
  }
  try {
    console.log("company is ", company);
    const mailOptions = {
      from: "lenzzhasthiyit@gmail.com",
      to: mail,
      subject: `Invitation to join ${company}`,
      text: `${company} company is inviting you to join their software project management system.
      Enter "${companyKey}" in the company key field when you register.
      
      Register now: http://localhost:3000/EmailRegister`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      console.log(error);
      if (error) {
        console.log("error", error);
        res.status(201).json({
          status: 201,
          message: "Email not sent",
          error: error.message,
        });
      } else {
        console.log("Email sent", info.response);
        res.status(200).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCompany,
  checkcompany,
  randomkey,
  companyUsers,
  updateCompanyData,
  getCompanyById,
  sendInvitation,
};
