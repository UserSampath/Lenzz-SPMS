const mongoose = require("mongoose");

const ProgressStageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    listIndex: {
      type: Number,
    },
    // projectId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Project'
    // }
    projectId: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProgressStage", ProgressStageSchema);
