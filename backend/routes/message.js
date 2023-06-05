const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
router.use(requireAuth);
router.post("/", sendMessage);
router.get("/:chatId", allMessages);
module.exports = router;
