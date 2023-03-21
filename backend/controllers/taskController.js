const Task = require("../models/taskModel");
const ProgressStage = require("../models/progressStageModel");
const { uploadFile, find, deleteOne, downloadOne } = require("../util/s3Service");
module.exports = {
    create: async (req, res) => {
        const newTask = JSON.parse(req.body.json);
        console.log(newTask.progressStage_id);
        console.log("ddddddddddddddddddddddddd", req.body.fileType)
        const results = await uploadFile(req.files);
        console.log("resultsaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", results)
        let file = [];
        if (results.length !== 0) {
            for (let i = 0; i < results.length; i++) {
                let key = results[i].key;
                let location = results[i].Location;
                let f = {
                    "fileName": key,
                    "location": location
                };
                file.push(f);
            }
        }


        const task = await Task.create({
            progressStage_id: newTask.progressStage_id,
            name: newTask.name,
            flag: newTask.flag,
            assign: newTask.assign,
            reporter: newTask.reporter,
            link: newTask.link,
            startDate: newTask.startDate,
            endDate: newTask.endDate,
            description: newTask.description,
            taskIndex: newTask.taskIndex,
            files: file
        });
        const taskData = await task.save();
        return res.send({ "taskData": taskData, "results": results });
    },
    catch(err) {
        res.status(500).json(err)
    },
    updateTaskDetails: async (req, res) => {
        const newTask = JSON.parse(req.body.json);

        // console.log(req.body)
        try {
            const results = await uploadFile(req.files);
            let file = [];
            if (results.length !== 0) {
                for (let i = 0; i < results.length; i++) {
                    let key = results[i].key;
                    let location = results[i].Location;
                    let f = {
                        "fileName": key,
                        "location": location
                    };
                    file.push(f);
                }
            }
            console.log("resultsaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", file)

            const a = await Task.findById(newTask.id);
            if (!a) {
                return res.status(403).json({ message: 'Task not found' })
            }
            const task = await Task.findByIdAndUpdate(newTask.id,
                {
                    $set: {
                        name: newTask.name,
                        flag: newTask.flag,
                        assign: newTask.assign,
                        reporter: newTask.reporter,
                        link: newTask.link,
                        startDate: newTask.startDate,
                        endDate: newTask.endDate,
                        description: newTask.description,
                        taskIndex: newTask.taskIndex,
                    },
                    $push: { files: { $each: file } } // push the new files 
                }, { new: true });
            if (!task) {
                return res.status(405).json({ message: 'Task not found' })
            }
            res.status(200).json({ "task": task, "results": results });
            console.log("xxxxzzzz", task)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAll: async (req, res) => {
        // find all tasks and return the data
        try {
            const tasks = await Task.find();
            return res.json(tasks);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    ,
    moveCardSameList: async (req, res) => {
        const { droppableIndexStart, droppableIndexEnd, list } = req.body;
        try {
            const tasks = await Task.find({ progressStage_id: list });
            if (!tasks || tasks.length === 0) {
                return res.status(404).json({ message: `No tasks found with list id ${list}` });
            }
            tasks.forEach(task => {
                if (task.taskIndex === droppableIndexStart) {
                    task.taskIndex = droppableIndexEnd;
                } else if (droppableIndexStart < droppableIndexEnd && task.taskIndex > droppableIndexStart && task.taskIndex <= droppableIndexEnd) {
                    task.taskIndex--;
                } else if (droppableIndexStart > droppableIndexEnd && task.taskIndex >= droppableIndexEnd && task.taskIndex < droppableIndexStart) {
                    task.taskIndex++;
                }
            });
            for (const task of tasks) { // loop over updated tasks and save each one
                await task.save();
            }
            res.json(tasks);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    moveCard: async (req, res) => {
        const { droppableIdStart, droppableIdEnd, droppableIndexStart, droppableIndexEnd } = req.body;

        try {
            // Get the lists where the drag happened and ended
            const listStart = await ProgressStage.findById(droppableIdStart);
            const listEnd = await ProgressStage.findById(droppableIdEnd);
            if (!listStart || !listEnd) {
                return res.status(404).json({ message: 'One or both lists not found' });
            }
            // Remove the card from the starting list and add it to the ending list
            const [card] = listStart.cards.splice(droppableIndexStart, 1);
            listEnd.cards.splice(droppableIndexEnd, 0, card);
            // Save the changes to the lists
            await listStart.save();
            await listEnd.save();
            res.json({ message: 'Card moved successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' })
        }
    },

    getTaskById: async (req, res) => {
        try {
            // const taskId = req.body.id; // get the task ID from the URL parameter
            const taskId = req.query.id;
            const task = await Task.findById(taskId); // retrieve the task from the database by ID
            res.json(task); // send the task as a JSON response
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    deleteOneTask: async (req, res) => {
        const taskId = req.params.id;
        const { taskIndex, listID } = req.body;
        try {
            const task = await Task.findByIdAndDelete(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            //TODO:
            for (const file of task.files) {
                await deleteOne(file.fileName);
            }


            // update taskIndex values of remaining tasks in the list
            const tasks = await Task.find({ progressStage_id: listID });
            if (tasks) {
                tasks.forEach(async task => {
                    if (task.taskIndex > taskIndex) {
                        task.taskIndex--;
                        await task.save(); // save the changes back to the database
                    }
                })
            }

            return res.status(200).json({ message: 'Task deleted successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    },
    moveCardsAcrossStages: async (req, res) => {
        const { droppableIdStart, droppableIdEnd, droppableIndexStart, droppableIndexEnd, cardId } = req.body;
        try {
            const task = await Task.findById(cardId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            // Remove the task from the source progressStage and update the taskIndex of the affected tasks greater than
            const sourceTasks = await Task.find({ progressStage_id: droppableIdStart, taskIndex: { $gt: droppableIndexStart } });
            sourceTasks.forEach((t) => {
                t.taskIndex -= 1;
                t.save();
            });
            // Insert the task into the target progressStage and update the taskIndex of the affected tasks
            const targetTasks = await Task.find({ progressStage_id: droppableIdEnd, taskIndex: { $gte: droppableIndexEnd } });
            targetTasks.forEach((t) => {
                t.taskIndex += 1;
                t.save();
            });
            // Update the existing task with the new progress stage ID and index
            task.progressStage_id = droppableIdEnd;
            task.taskIndex = droppableIndexEnd;
            await task.save();
            return res.send(task);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    },
    //  { $pull: { arrayField: { fileName: <file-name-to-remove> } } }
    // deleteAttachment: async (req, res) => {
    //     const taskId = req.body.taskId;
    //     const fileName = req.body.fileName;
    //     console.log(req.body.fileName);

    //     try {
    //         // const key = `uploads/${fileName}`
    //         // const result = await deleteOne(key)

    //         const r = await Task.updateOne({
    //             _id: taskId
    //         },
    //             {
    //                 $pull: {
    //                     arrayField: { "fileName": fileName  }}})
    //         console.log(r);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }




    deleteAttachment: async (req, res) => {
        const taskId = req.body.taskId;
        const fileId = req.body.fileId;
        console.log(req.body);

        try {
            const task = await Task.findById(taskId);
            for (let i = 0; i < task.files.length; i++) {

                if (task.files[i]._id.toString() === fileId) {
                    console.log("matched")
                    let t = task.files[i].fileName
                    console.log(t)
                    const result = await deleteOne(t)
                    task.files.pull(task.files[i])


                }
            }
            // task.files = task.files.filter(file => file._id.toString() !== fileId);
            await task.save();
            res.json(task);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }

}
