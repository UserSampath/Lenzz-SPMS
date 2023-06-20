const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimeLineSchema = new Schema(
  {
    Topic: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

TimeLineSchema.statics.addTimeLine = async function (
  Topic,
  Description,
  projectId
) {
  if (!Topic || !Description) {
    throw new Error("All fields must be field");
  }

  const timeline = await this.create({ Topic, Description, projectId });
  return timeline;
};
module.exports = mongoose.model("TimeLine", TimeLineSchema);