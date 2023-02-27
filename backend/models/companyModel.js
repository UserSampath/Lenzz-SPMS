const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const companySchema = new Schema({
  companyname: {
    type: String,
    required: true,
  },
  companyemail: {
    type: String,
    required: true,
  },
  companykey: {
    type: String,
    required: true,
  },
  contactnumber: {
    type: Number,
    required: true,
  },
  companyaddress: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});

companySchema.statics.createcompany = async function (
  companyname,
  companykey,
  contactnumber,
  companyaddress,
  companyemail,
  user_id
) {
  if (
    !companyname ||
    !companykey ||
    !contactnumber ||
    !companyaddress ||
    !companyemail
  ) {
    throw Error("All fields must be filled ");
  }
  function isValidPhoneNumber(contactnumber) {
    var pattern = /^\d{10}$/;
    return pattern.test(contactnumber);
  }

  if (!isValidPhoneNumber(contactnumber)) {
    throw new Error("company contact number is not valid");
  }
  const coname = await this.findOne({ companyname });

  if (coname) {
    throw new Error("Company name is already taken");
  }
  const cokey = await this.findOne({ companykey });

  if (cokey) {
    throw new Error("Company key is already taken");
  }
  function isStrongCompanyKey(companykey) {
    var pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]{8,}$/;
    return pattern.test(companykey);
  }
  if (!isStrongCompanyKey(companykey)) {
    throw new Error("Invalid company key");
  }
  if (!validator.isEmail(companyemail)) {
    throw Error("company Email not valid");
  }

  const company = await this.create({
    companyname,
    companykey,
    companyemail,
    contactnumber,
    companyaddress,
    user_id,
  });
  return company;
};

companySchema.statics.checkcompany = async function (companykey) {
  if (!companykey) {
    throw Error("companykey must be filled ");
  }
  const key = await this.findOne({ companykey });
  if (!key) {
    throw Error("companykey is incorrect");
  }
  return key;
};

module.exports = mongoose.model("Company", companySchema);
