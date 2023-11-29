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

const ProjectTimelines = async (req, res) => {
  const { projectId } = req.body;

  try {
    const timelines = await TimeLine.find({ projectId });
    res.status(200).json(timelines);
  } catch (error) {
    res.status(404).json({ message: "Timelines not found" });
  }
};

const createTimeline = asyncHandler(async (req, res) => {
  const { Topic, Description, projectId } = req.body;
  const { _id, selectedJob } = req;
  if (
    selectedJob !== "SYSTEM ADMIN" &&
    selectedJob !== "PROJECT MANAGER" &&
    selectedJob !== "TECH LEAD"
  ) {
    return res.status(401).json({ error: "You are not authorized" });
  }
  try {
    const checktimeline = await TimeLine.addTimeLine(
      Topic,
      Description,
      projectId
    );

    res.status(201).json(checktimeline);
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
  const { _id, selectedJob } = req;
  if (
    selectedJob !== "SYSTEM ADMIN" &&
    selectedJob !== "PROJECT MANAGER" &&
    selectedJob !== "TECH LEAD"
  ) {
    return res.status(401).json({ error: "You are not authorized" });
  }
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
  const { _id, selectedJob } = req;
  if (
    selectedJob !== "SYSTEM ADMIN" &&
    selectedJob !== "PROJECT MANAGER" &&
    selectedJob !== "TECH LEAD"
  ) {
    return res.status(401).json({ error: "You are not authorized" });
  }
  if (timeline) {
    const deletedTimeLine = await timeline.remove();

    res.json({
      message: "Timeline deleted successfully",
      deletedTimeLine: deletedTimeLine,
    });
  } else {
    res.status(404).json({ message: "Timeline not found" });
  }
});

module.exports = {
  getAllTimelines,
  createTimeline,
  getTimelineById,
  updateTimeline,
  DeleteTimeline,
  ProjectTimelines,
};
