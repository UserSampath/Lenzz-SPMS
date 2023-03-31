const TimeLine = require("../models/TimeLineModal");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const asyncHandler = require("express-async-handler");

const getAllTimelines = async (req, res) => {
  try {
    const timelines = await TimeLine.find();
    res.status(200).json(timelines);
  } catch (error) {
    res.status(404).json({ message: "Timelines not found" });
  }
};

const createTimeline = asyncHandler(async (req, res) => {
  const { Topic, Description } = req.body;
  try {
    const checktimeline = await TimeLine.addTimeLine(Topic, Description);
    const timline = new TimeLine({
      Topic,
      Description,
      checktimeline,
    });
    const createTimeline = await timline.save();
    res.status(201).json(createTimeline);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const getTimelineById = asyncHandler(async (req, res) => {
  const timeline = await TimeLine.findById(req.params.id);
  if (timeline) {
    res.json(timeline);
  } else {
    res.status(404).json({ error: error.message });
    res.status(404).json({ message: "time line not found" });
  }
});

const updateTimeline = asyncHandler(async (req, res) => {
  const { Topic, Description, id } = req.body;

  const timeline = await TimeLine.findById(id);
  if (timeline) {
    timeline.Topic = Topic;
    timeline.Description = Description;
    const updatedTimeline = await timeline.save();
    res.json(updatedTimeline);
  } else {
    res.status(404).json({ error: error.message });
    throw new Error("Timeline not found");
  }
});

const DeleteTimeline = asyncHandler(async (req, res) => {
  const timeline = await TimeLine.findById(req.body.id);
  if (timeline) {
    const deletedTimeLine = await timeline.remove();
    console.log(deletedTimeLine);
    res.json({
      message: "Timeline deleted successfully",
      deletedTimeLine: deletedTimeLine,
    });
  } else {
    res.status(404).json({ message: "Timeline not found" });
  }
});
/*
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
};*/
module.exports = {
  getAllTimelines,
  createTimeline,
  getTimelineById,
  updateTimeline,
  DeleteTimeline,
};
