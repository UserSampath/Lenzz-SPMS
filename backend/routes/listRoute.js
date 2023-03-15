const express = require("express");
const router = new express.Router();
const ProgressStage = require("../controllers/progressStageController");

router.post("/progressStage/create", ProgressStage.create);
router.get("/progressStage/taskWithPS", ProgressStage.taskWithPS);
router.delete("/deleteList/:id", ProgressStage.deleteList);
router.put("/moveList", ProgressStage.moveList);
router.put("/renameProgressStage/:id", ProgressStage.update);
router.post("/todo", ProgressStage.progress);
router.post("/overall", ProgressStage.overallprogres);
module.exports = router;
