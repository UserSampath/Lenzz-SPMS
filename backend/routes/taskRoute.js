const express = require('express');
const router = new express.Router();
const Task = require('../controllers/taskController');


router.post('/task/create', Task.create);
router.get('/task', Task.getAll);
router.put('/moveCardSameList', Task.moveCardSameList)
router.put('/moveCard', Task.moveCard)
router.put('/updateTaskDetails', Task.updateTaskDetails)
router.get('/getTaskById', Task.getTaskById)
router.delete('/deleteOneTask/:id', Task.deleteOneTask)
router.put('/moveCardsAcrossStages', Task.moveCardsAcrossStages)












module.exports = router;
