const express = require("express");
const router = new express.Router();
const projectUser = require('../controllers/ProjectUserController')
const requireAuth = require("../middleware/requireAuth");

router.post("/addUserToProject", projectUser.addUserToProject);

router.get("/getProjectsForUser", requireAuth, projectUser.getProjectsForUser);

module.exports = router;