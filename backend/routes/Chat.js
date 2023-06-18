const express = require("express");
const {
  removeFromGroup,
  accesChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  ProjectChats,
  fetchChatsOnly,
} = require("../controllers/chatControllers");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
router.use(requireAuth); //only logged user can access
router.post("/", accesChat); //creating chat
router.get("/", fetchChats);
router.get("/project/:id", ProjectChats);
router.get("/projectChat/:id", fetchChatsOnly); //get chat from database
router.post("/group", createGroupChat);
router.put("/rename", renameGroup);
router.put("/groupadd", addToGroup);
router.put("/groupremove", removeFromGroup);
module.exports = router;
