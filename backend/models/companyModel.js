const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;
const companySchema = new Schema(
  {
    companyname: {
      type: String,
      required: true,
    },
    companyemail: {
      type: String,
      required: true,
    },
    contactnumber: {
      type: String,
      required: true,
    },
    companyaddress: {
      type: String,
      required: true,
    },
    systemAdminId: {
      type: String,
      required: true,
    },
    companyKey: {
      type: String,
    },
  },
  { timestamps: true }
);

companySchema.statics.createcompany = async function (
  companyname,
  contactnumber,
  companyaddress,
  companyemail,
  user_id,
  companyKey
) {
  if (!companyname || !contactnumber || !companyaddress || !companyemail) {
    const coname = await this.findOne({ companyname });

    if (coname) {
      throw new Error("Company name is already taken");
    }

    if (!validator.isEmail(companyemail)) {
      throw Error("company Email not valid");
    }
    throw Error("All fields must be filled ");
  }
  if (!/^\d{10}$/.test(contactnumber)) {
    throw new Error("Contact number must be 10 digits");
  }
  const company = await this.create({
    companyname,
    companyemail,
    contactnumber,
    companyaddress,
    systemAdminId: user_id,
    companyKey,
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
companySchema.statics.updateCompany = async function (
  companyname,
  companyKey,
  companyaddress,
  contactnumber,
  companyemail,
  _id
) {
  if (
    !companyname ||
    !contactnumber ||
    !companyaddress ||
    !companyemail ||
    !companyKey
  ) {
    throw new Error("All field must be field");
  }

  if (!validator.isEmail(companyemail)) {
    throw Error("company Email not valid");
  }
  if (!/^\d{10}$/.test(contactnumber)) {
    throw new Error("Contact number must be 10 digits");
  }
  console.log("data", companyname);

  const company = await this.findByIdAndUpdate(
    _id,
    {
      companyname,
      companyKey,
      companyaddress,
      contactnumber,
      companyemail,
    },
    { new: true }
  );
  return company;
};
module.exports = mongoose.model("Company", companySchema);
