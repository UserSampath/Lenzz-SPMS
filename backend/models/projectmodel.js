const mongoose = require("mongoose");
const validator = require("validator");
const { isBefore, parseISO } = require("date-fns");
const moment = require("moment");

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    projectname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: String,
      default: Date.now,
    },
    endDate: {
      type: String,
    },
    user_id: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectUser",
      },
    ],
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

projectSchema.statics.createproject = async function (
  projectname,
  description,
  endDate,
  user_id,
  companyId
) {
  if (!projectname || !description) {
    throw Error("All Field is required");
  }

  const exists = await this.findOne({ projectname });

  if (exists) {
    throw Error("Project Name is already use");
  }
  const currentDate = new Date().toISOString().slice(0, 10);

  // const parsedStartDate = parseISO(startDate);
  // const parsedCurrentDate = parseISO(currentDate);
  // //check if the start date is before the current date
  // if (isBefore(parsedStartDate, parsedCurrentDate)) {
  //   // start date is before current date, so it's invalid
  //   throw Error("Start date cannot be before the current date");
  // } else {
  //   // start date is valid
  // }
  const currentDatenow = moment(this.startDate).format("YYYY-MM-DD");
  const project = await this.create({
    projectname,
    description,
    startDate: currentDatenow,
    endDate,
    user_id,
    company_id: companyId,
  });
  // console.log("ddddddddddddddddddddddd",project)
  return project;
};

projectSchema.statics.updateProject = async function (
  projectname,
  description,
  startDate,
  endDate,
  id
) {
  if (!projectname || !description) {
    throw Error("All Field is required");
  }

  const currentDate = new Date().toISOString().slice(0, 10);

  const parsedStartDate = parseISO(startDate);
  const parsedCurrentDate = parseISO(currentDate);
  // check if the start date is before the current date
  // if (isBefore(parsedStartDate, parsedCurrentDate)) {
  //   // start date is before current date, so it's invalid
  //   throw Error("Start date cannot be before the current date");
  // } else {
  //   // start date is valid
  //   console.log("Start date is valid");
  // }
  const project = await this.findByIdAndUpdate(
    id,
    {
      projectname,
      description,
      startDate,
      endDate,
    },
    { new: true }
  );
  return project;
};

module.exports = mongoose.model("Project", projectSchema);
