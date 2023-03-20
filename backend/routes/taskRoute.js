const express = require('express');
const router = new express.Router();
const Task = require('../controllers/taskController');
const upload = require("../middleware/multerFileUpload")

router.post('/task/create', upload.array("file"), Task.create);
router.get('/task', Task.getAll);
router.put('/moveCardSameList', Task.moveCardSameList)
router.put('/moveCard', Task.moveCard)
router.put('/updateTaskDetails', upload.array("file"), Task.updateTaskDetails)
router.get('/getTaskById', Task.getTaskById)
router.delete('/deleteOneTask/:id', Task.deleteOneTask)
router.put('/moveCardsAcrossStages', Task.moveCardsAcrossStages)
router.delete('/deleteAttachment', Task.deleteAttachment)













module.exports = router;
