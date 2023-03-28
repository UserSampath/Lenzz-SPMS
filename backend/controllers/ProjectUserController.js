const User = require('../models/memberModel')
const Project = require('../models/projectmodel')
const projectUser = require('../models/projectUserModel')

exports.addUserToProject = async (req, res) => {
    const { userId, projectId, role } = req.body;
    try {
        const existingRecord = await projectUser.findOne({ user_id: userId, project_id: projectId });
        if (existingRecord) {
            return res.status(400).json({ message: "User is already assigned to this project." });
        }
        const projectUserData = new projectUser({
            user_id: userId,
            project_id: projectId,
            role: role
        });
        await projectUserData.save();

        // Update User model
        const user = await User.findById(userId);
        user.projects.push(projectUserData._id);
        await user.save();

        // Update Project model
        const project = await Project.findById(projectId);
        project.users.push(projectUserData._id);
        await project.save();

        res.json(projectUserData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.removeUserFromProject = async (req, res) => {
    const { userId, projectId } = req.params;

    try {
        await ProjectUser.findOneAndDelete({ user_id: userId, project_id: projectId });
        res.json({ message: 'User removed from project' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProjectsForUser = async (req, res) => {
    // const { userId } = req.body;
    const { _id, selectedJob } = req;
    try {
        const projectUserDocs = await projectUser.find({ user_id: _id });
        const userProjects = [];
        for (const projectUserData of projectUserDocs) {
            console.log(projectUserData.project_id);
            const projectData = await Project.find({ _id: projectUserData.project_id });
            console.log(projectData);
            userProjects.push(projectData);
        }
        res.json({ userProject: userProjects });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getUsersForProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId).populate('users.user_id');
        res.json(project.users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};