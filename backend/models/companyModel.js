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
      type: Number,
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
//Company validation
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

  const company = await this.create({
    companyname,

    companyemail,
    contactnumber,
    companyaddress,
    systemAdminId :user_id,
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

module.exports = mongoose.model("Company", companySchema);
