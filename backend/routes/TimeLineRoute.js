const express = require("express");
const {
  getAllTimelines,
  createTimeline,
  updateTimeline,
  getTimelineById,
  DeleteTimeline,
} = require("../controllers/TimeLineController");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.get("/getAllTimelines", getAllTimelines);
router.post("/createTimeLine", requireAuth, createTimeline);
router.get("/:id", requireAuth, getTimelineById);
router.put("/updateTimeline", requireAuth, updateTimeline);
router.delete("/DeleteTimeline", requireAuth, DeleteTimeline);

module.exports = router;
