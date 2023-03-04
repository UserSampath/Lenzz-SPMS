const Company = require("../models/companyModel");
const User = require("../models/memberModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const createCompany = async (req, res) => {
  const {
    companyname,
    companykey,
    contactnumber,
    companyemail,
    companyaddress,
    Member_id,
  } = req.body;

  try {
    const user_id = req.user._id;

    const company = await Company.createcompany(
      companyname,
      companykey,
      contactnumber,
      companyaddress,
      companyemail,
      user_id,
      Member_id
    );
    const token = createToken(company._id);
    res.status(200).json({ company, token, Member_id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkcompany = async (req, res) => {
  const { companykey } = req.body;

  try {
    const company = await Company.checkcompany(companykey);
    const token = createToken(company._id);
    res.status(200).json({ companykey, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getCompany = async (req, res) => {
  const { id, token } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    if (user) {
      res.status(401).json({ status: 401, message: "user not exits" });
    }
    const company = await Company.find();
    res.status(200).json({ company });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCompany = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Company" });
  }

  const company = await Company.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!company) {
    return res.status(404).json({ error: "No company project" });
  }
  res.status(200).json({ company });
};
module.exports = {
  createCompany,
  checkcompany,
  getCompany,
  updateCompany,
};
