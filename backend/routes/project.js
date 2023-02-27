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
const AdminAuth = require("../middleware/SystemAdmin");

const router = express.Router();
router.use(AdminAuth);
router.use(requireAuth);
router.post("/creatproject", project);
router.get("/", getProjects);
router.get("/:id", getProject);
router.delete("/:id", deleteProject);
router.patch("/:id", updateProject);
router.post("/changepersentage", changepersentage);

module.exports = router;
