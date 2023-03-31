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
  },
  { timestamps: true }
);

TimeLineSchema.statics.addTimeLine = async function (Topic, Description) {
  if (!Topic || !Description) {
    throw new Error("All fields must be field");
  }

  const topic = await this.findOne({ Topic });
  if (topic) {
    throw new Error("Topic is already taken");
  }

  const timeline = await this.create({ Topic, Description });
  return timeline;
};
module.exports = mongoose.model("TimeLine", TimeLineSchema);
