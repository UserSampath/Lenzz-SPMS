const mongoose = require("mongoose");
const validator = require("validator");
const { isBefore, parseISO } = require("date-fns");
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
      type: Date,
    },
    endDate: {
      type: Date,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

projectSchema.statics.createproject = async function (
  projectname,
  description,
  startDate,
  endDate,
  user_id
) {
  if (!projectname || !description) {
    throw Error("All Field is required");
  }

  const exists = await this.findOne({ projectname });

  if (exists) {
    throw Error("Project Name is already use");
  }
  const currentDate = new Date().toISOString().slice(0, 10);

  const parsedStartDate = parseISO(startDate);
  const parsedCurrentDate = parseISO(currentDate);
  // check if the start date is before the current date
  if (isBefore(parsedStartDate, parsedCurrentDate)) {
    // start date is before current date, so it's invalid
    throw Error("Start date cannot be before the current date");
  } else {
    // start date is valid
    console.log("Start date is valid");
  }
  const project = await this.create({
    projectname,
    description,
    startDate,
    endDate,
    user_id,
  });

  return project;
};

module.exports = mongoose.model("Project", projectSchema);
