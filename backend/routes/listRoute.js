const express = require("express");
const router = new express.Router();
const ProgressStage = require("../controllers/progressStageController");

router.post("/progressStage/create", ProgressStage.create);
router.post("/progressStage/taskWithPS", ProgressStage.taskWithPS);
router.delete("/deleteList/:id", ProgressStage.deleteList);
router.put("/moveList", ProgressStage.moveList);
router.put("/renameProgressStage/:id", ProgressStage.update);
router.post("/progressStage/tasksOfProject", ProgressStage.tasksOfProject);
router.post(
  "/progressStage/TotaltasksOfProject",
  ProgressStage.TotaltasksOfProject
);
module.exports = router;
