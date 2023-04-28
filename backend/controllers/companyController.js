const Company = require("../models/companyModel");
const User = require("../models/memberModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const createCompany = async (req, res) => {
  const { companyname, contactnumber, companyemail, companyaddress } = req.body;
  const { id, selectedJob } = req;
  if (selectedJob != "SYSTEM ADMIN") {
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
    console.log("dsss", company);
    const updatedUser = await User.findByIdAndUpdate(user_id, {
      companyId: company._id,
    });
    res.status(200).json({ company, companyname });
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
const updateCompany = asyncHandler(async (req, res) => {
  const {
    companyname,
    companyKey,
    companyaddress,
    contactnumber,
    companyemail,
    _id,
  } = req.body;

  if (
    !companyname ||
    !companyKey ||
    !companyaddress ||
    !contactnumber ||
    !companyemail
  ) {
    res.status(400).json({ error: "Can't find the user " });
  }

  const company = await Company.findById(_id);
  if (company) {
    company.companyname = companyname;
    company.companyemail = companyemail;
    company.companyKey = companyKey;
    company.companyaddress = companyaddress;
    company.contactnumber = contactnumber;
    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } else {
    throw new Error("Company not found");
  }
});

module.exports = {
  createCompany,
  checkcompany,
  randomkey,
  companyUsers,
  updateCompany,
  getCompanyById,
};
