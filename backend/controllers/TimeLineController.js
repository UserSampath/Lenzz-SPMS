const TimeLine = require("../models/TimeLineModal");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const createTimeLine = async (req, res) => {
  const { Topic, Description } = req.body;
  const { id, selectedJob } = req;
  if (selectedJob != "SYSTEM ADMIN") {
    return res.status(401).json({ error: "User is not authorized" });
  }
  try {
    const timeLine = await TimeLine.addTimeLine(Topic, Description);
    res.status(200).json({ timeLine });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllTimelines = async (req, res) => {
  try {
    const timelines = await TimeLine.find();
    res.status(200).json(timelines);
  } catch (error) {
    res.status(404).json({ message: "Timelines not found" });
  }
};
const getTimeline = async (req, res) => {
  try {
    const timeline = await TimeLine.findById(req.params.timelineId);
    res.status(200).json(timeline);
  } catch (error) {
    res.status(404).json({ message: "Timeline not found" });
  }
};

const updateTimeline = async (req, res) => {
  try {
    const updatedTimeline = await TimeLine.findByIdAndUpdate(
      req.params.timelineId,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTimeline);
  } catch (error) {
    res.status(404).json({ message: "Could not update timeline" });
  }
};
module.exports = {
  createTimeLine,
  getTimeline,
  updateTimeline,
  getAllTimelines,
};
