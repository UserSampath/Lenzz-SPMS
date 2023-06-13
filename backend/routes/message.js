const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  sendMessage,
  allMessages,
  deleteMessages,
} = require("../controllers/messageController");
// router.use(requireAuth);
router.post("/", requireAuth, sendMessage);
router.get("/:chatId", allMessages);
router.delete("/:id", deleteMessages);
module.exports = router;
