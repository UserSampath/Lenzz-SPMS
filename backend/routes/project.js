const express = require("express");
const {
  project,
  changepersentage,
  getProjects,
  getProject,
  deleteProject,
  updateProject,
} = require("../controllers/projectController");
const requireAuth = require("../middleware/requireAuth");
const appUserAuthentication=require("../middleware/appUserAuthentication")
const router = express.Router();

// router.use(requireAuth);
router.post("/creatproject", requireAuth, project);
router.get("/", appUserAuthentication, getProjects);
router.get("/:id", requireAuth, getProject);
router.delete("/:id", requireAuth, deleteProject);
router.patch("/:id", requireAuth, updateProject);
router.post("/changepersentage", requireAuth, changepersentage);

module.exports = router;
