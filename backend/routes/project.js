const express = require("express");
// const appUserAuthentication = require("../middleware/appUserAuthentication");
const {
  project,
  changepersentage,
  getProjects,
  getProject,
  deleteProject,
  updateProject,
  updateProjectData,
  usersOfTheProject,
} = require("../controllers/projectController");
const requireAuth = require("../middleware/requireAuth");
const appUserAuthentication = require("../middleware/appUserAuthentication");
const router = express.Router();

// router.use(requireAuth);
router.post("/creatproject", requireAuth, project);
router.get("/", appUserAuthentication, getProjects);
router.post("/getProject", getProject);
router.delete("/:id", deleteProject);
router.patch("/:id", updateProject);
router.post("/changepersentage", changepersentage);
router.put("/updateProjectData", requireAuth, updateProjectData);
router.post("/usersOfTheProject", usersOfTheProject);
module.exports = router;
