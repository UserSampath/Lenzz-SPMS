const ProgressStage = require("../models/progressStageModel");
const Task = require("../models/taskModel");


module.exports = {
    create: async (req, res) => {
        try {
            const { title, listIndex } = req.body
            const progressStage = await ProgressStage.create({
                title,
                listIndex
            })

            return res.send(progressStage)
        }

        catch (err) {
            res.status(500).json(err)
        }
    },
    taskWithPS: async (req, res) => {
        try {
            const progressStageData = await ProgressStage.aggregate([
                {
                    $lookup: {
                        from: "tasks",
                        localField: "_id",
                        foreignField: "progressStage_id",
                        as: "cards"
                    }
                },
                {
                    $project: {
                        title: 1,
                        listIndex: 1,
                        cards: 1

                    }
                }
            ]);
            progressStageData.sort((a, b) => a.listIndex - b.listIndex);
            const sortedCards = progressStageData.map(obj => {
                obj.cards.sort((a, b) => a.taskIndex - b.taskIndex);
                return obj;
            });

            res.status(200).send(sortedCards);
        }
        catch (err) {
            res.status(500).json(err)
        }

    },

    moveList: async (req, res) => {
        const { droppableIndexStart, droppableIndexEnd } = req.body;

        try {
            const stages = await ProgressStage.find();

            for (let i = 0; i < stages.length; i++) {
                const stage = stages[i];

                if (stage.listIndex === droppableIndexStart) {
                    stage.listIndex = droppableIndexEnd;
                } else if (droppableIndexStart < droppableIndexEnd && stage.listIndex > droppableIndexStart && stage.listIndex <= droppableIndexEnd) {
                    stage.listIndex--;
                } else if (droppableIndexStart > droppableIndexEnd && stage.listIndex >= droppableIndexEnd && stage.listIndex < droppableIndexStart) {
                    stage.listIndex++;
                }

                await stage.save();
            }

            res.json(stages);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteList: async (req, res) => {
        const listID = req.params.id;
        const { index } = req.body;

        try {
            const list = await ProgressStage.findByIdAndDelete(listID);
            if (!list) {
                return res.status(404).json({ message: 'Task not found' });
            }

            const lists = await ProgressStage.find();
            if (lists) {
                console.log(lists)

                lists.forEach(async list => {
                    if (list.listIndex > index) {
                        list.listIndex--;
                        await list.save(); // save the changes back to the database
                    }
                })
            }

            const result = await Task.deleteMany({ progressStage_id: listID });
            console.log(result)
            return res.status(200).json({ message: `list delete successfully and Deleted ${result.deletedCount} tasks.` });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { title } = req.body;

        try {
            const progressStage = await ProgressStage.findById(id);

            if (!progressStage) {
                return res.status(404).json({ message: 'Progress stage not found' });
            }

            progressStage.title = title;
            await progressStage.save();

            return res.status(200).json({ message: 'Progress stage updated successfully', progressStage });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
    }



}
