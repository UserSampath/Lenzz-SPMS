const express= require("express");
const {removeFromGroup,accesChat,fetchChats,createGroupChat,renameGroup,addToGroup} = require("../controllers/chatControllers");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();
router.use(requireAuth);
router.post("/",accesChat);
router.get("/",fetchChats);
router.post("/group",createGroupChat);
router.put("/rename",renameGroup);
router.put("/groupadd",addToGroup)
router.put("/groupremove",removeFromGroup)
module.exports = router;