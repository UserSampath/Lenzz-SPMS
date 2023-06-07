const express = require("express");
const router = new express.Router();
const projectUser = require('../controllers/ProjectUserController')
const requireAuth = require("../middleware/requireAuth");

router.post("/addUserToProject", projectUser.addUserToProject);
router.post("/removeUserFromProject", projectUser.removeUserFromProject);
router.put("/updateUserProject", projectUser.updateUserProject);
router.get("/getProjectsForUser", requireAuth, projectUser.getProjectsForUser);
router.post("/getRole", requireAuth, projectUser.getRole);

module.exports = router;