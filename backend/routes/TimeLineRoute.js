const express = require("express");
const {
  createTimeLine,
  getTimeline,
  updateTimeline,
  getAllTimelines,
} = require("../controllers/TimeLineController");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

router.post("/createTimeLine", requireAuth, createTimeLine);
router.get("/getTimelines", getAllTimelines);
router.get("/:timelineId", getTimeline);
router.put("/:timelineId", updateTimeline);

module.exports = router;
