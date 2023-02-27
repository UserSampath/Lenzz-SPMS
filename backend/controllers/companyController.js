const Company = require("../models/companyModel");
const User = require("../models/memberModel");
const jwt = require("jsonwebtoken");
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
  } = req.body;

  try {
    const user_id = req.user._id;
    const company = await Company.createcompany(
      companyname,
      companykey,
      contactnumber,
      companyaddress,
      companyemail,
      user_id
    );
    const token = createToken(company._id);
    res.status(200).json({ company, companyname, token });
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
module.exports = {
  createCompany,
  checkcompany,
};
