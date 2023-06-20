const Project = require("../models/projectmodel");
const jwt = require("jsonwebtoken");
const express = require("express");
const moment = require("moment");
const mongoose = require("mongoose");
const User = require("../models/memberModel");

const app = express();
//create a new project

const project = async (req, res) => {
  const { projectname, description, endDate, companyId } = req.body;
  const { _id, selectedJob } = req;
  if (selectedJob !== "SYSTEM ADMIN") {
    return res.status(401).json({ error: "User is not authorized" });
  }
  console.log(selectedJob);
  try {
    const user_id = req.user._id;
    const project = await Project.createproject(
      projectname,
      description,
      endDate,
      user_id,
      companyId
    );
    console.log(project);
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// router.get('/project/:projectId/chat/users',

const updateProjectData = async (req, res) => {
  const { projectname, description, startDate, endDate, id } = req.body;
  const { _id, selectedJob } = req;
  if (selectedJob !== "SYSTEM ADMIN") {
    return res.status(401).json({ error: "User is not authorized" });
  }

  try {
    const project = await Project.updateProject(
      projectname,
      description,
      startDate,
      endDate,
      id
    );
    console.log(project);
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get all projects
const getProjects = async (req, res) => {
  const projects = await Project.find({}).sort({ createdAt: -1 });
  res.status(200).json(projects);
};
//get single project

const getProject = async (req, res) => {
  const { id } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such project" });
  }
  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ error: "No such project" });
  }
  res.status(200).json({ project });
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such project" });
  }
  const project = await Project.findOneAndDelete({ _id: id });
  if (!project) {
    return res.status(404).json({ error: "No such project" });
  }
  res.status(200).json({ project });
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such project" });
  }

  const project = await Project.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!project) {
    return res.status(404).json({ error: "No such project" });
  }
  res.status(200).json({ project });
};

const changepersentage = async (req, res) => {
  const { id } = req.body;
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such project" });
  }
  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ error: "No such project" });
  }
  const startDate = project.startDate;
  const endDate = project.endDate;
  console.log(startDate, endDate);
  // Check if the start date is the current day
  const currentDay = moment().startOf("day");
  //const isStartDateValid = moment(startDate).isSameOrAfter(currentDay);

  // Check if the end date is after the start date
  const isEndDateValid = moment(endDate).isAfter(startDate);

  if (!isEndDateValid) {
    return res.status(400).json({ error: "Invalid start date or end date" });
  }

  const totalMilliseconds = moment(endDate).diff(startDate);
  console.log(totalMilliseconds / 1000 / 60 / 60 / 24);
  const totaldays = totalMilliseconds / 1000 / 60 / 60 / 24;
  // const remainingMilliseconds = moment(endDate).diff(moment());
  // console.log(remainingMilliseconds / 1000 / 60 / 60 / 24);

  const pastMilliseconds = moment(Date.now()).diff(startDate);
  console.log(pastMilliseconds / 1000 / 60 / 60 / 24);
  const pastdays = pastMilliseconds / 1000 / 60 / 60 / 24;

  console.log((pastdays / totaldays) * 100);
  var percentage = Math.round((pastdays / totaldays) * 100 * 100) / 100;
  if (percentage < 0) {
    percentage = 0;
  }
  res.status(200).json({ id, percentage });
};
const usersOfTheProject = async (req, res) => {
  const { id } = req.body;
  try {
    const project = await Project.findById(id).populate("users");
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectUsers = project.users;

    const members = await Promise.all(
      projectUsers.map(async (user) => {
        const member = await User.findById(user.user_id);
        const ProjectUserObj = {
          projectUserRole: user.role,
          projectUserId: user._id,
        };

        console.log(user);
        const memberObj = member.toObject();
        const concatenatedObj = Object.assign({}, memberObj, ProjectUserObj);

        return concatenatedObj;
      })
    );

    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  project,
  getProjects,
  getProject,
  changepersentage,
  deleteProject,
  updateProject,
  updateProjectData,
  usersOfTheProject,
};
