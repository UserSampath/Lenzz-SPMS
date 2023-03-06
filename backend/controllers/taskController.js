const Task = require("../models/taskModel");
const ProgressStage = require("../models/progressStageModel");
module.exports = {
    create: async (req, res) => {
        const task = await Task.create({
            progressStage_id: req.body.progressStage_id,
            name: req.body.name,
            flag: req.body.flag,
            assign: req.body.assign,
            reporter: req.body.reporter,
            link: req.body.link,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            description: req.body.description,
            taskIndex: req.body.taskIndex,
        });
        const taskData = await task.save();
        return res.send(taskData);
    },
    catch(err) {
        res.status(500).json(err)
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
    updateTaskDetails: async (req, res) => {
        const { name, flag, assign, reporter, link, startDate, endDate, description, taskIndex, id } = req.body
        // console.log(req.body)
        try {
            const a = await Task.findById(id);
            if (!a) {
                console.log(id);
                return res.status(403).json({ message: 'Task not found' })
            }
            const task = await Task.findByIdAndUpdate(id,
                { name, flag, assign, reporter, link, startDate, endDate, description, taskIndex }, { new: true });
            if (!task) {
                return res.status(405).json({ message: 'Task not found' })
            }
            res.status(200).json({ task });
        } catch (error) {
            res.status(500).json({ message: error.message });
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
     deleteOneTask : async (req, res) => {
        const taskId = req.params.id;
        const { taskIndex, listID } = req.body;
        try {
            const task = await Task.findByIdAndDelete(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
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
    }
}
