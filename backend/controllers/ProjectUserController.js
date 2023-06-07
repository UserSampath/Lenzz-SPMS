const User = require('../models/memberModel')
const Project = require('../models/projectmodel')
const projectUser = require('../models/projectUserModel')

exports.addUserToProject = async (req, res) => {
    const { userId, projectId, role } = req.body;
    console.log(role);
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
    const { userId, projectId } = req.body;
    try {
        // Find the projectUser record
        const projectUserData = await projectUser.findOne({ user_id: userId, project_id: projectId });
        if (!projectUserData) {
            return res.status(400).json({ message: "User is not assigned to this project." });
        }

        // Find the number of system admins in the project
        const systemAdminsCount = await projectUser.countDocuments({ project_id: projectId, role: "SYSTEM ADMIN" });
        if (systemAdminsCount <= 1 && projectUserData.role === "SYSTEM ADMIN") {
            return res.status(400).json({ message: "Member cannot be deleted. At least one system admin is required for the project." });
        }

        // Remove the projectUser record
        await projectUser.deleteOne({ user_id: userId, project_id: projectId });

        // Remove the projectUser reference from User model
        const user = await User.findById(userId);
        user.projects.pull(projectUserData._id);
        await user.save();

        // Remove the projectUser reference from Project model
        const project = await Project.findById(projectId);
        project.users.pull(projectUserData._id);
        await project.save();

        res.json({ message: "User removed from project successfully." });
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

exports.updateUserProject = async (req, res) => {
    const { userId, projectId, role } = req.body;
    try {
        const projectUsersData = await projectUser.find({ project_id: projectId });
        const projectUserData = await projectUser.findOne({ user_id: userId, project_id: projectId });
        if (projectUserData.role == "SYSTEM ADMIN") {
            if (role == "SYSTEM ADMIN") {
                const result = await projectUser.findByIdAndUpdate(projectUserData._id, { role: role }, { new: true })
                res.json(result);
            } else {
                const filteredProjectUsersData = projectUsersData.filter((projectUser) => {
                    return projectUser.role === "SYSTEM ADMIN" && projectUser._id.toString() !== projectUserData._id.toString();
                });
                console.log(filteredProjectUsersData);

                if (filteredProjectUsersData.length > 0) {
                    const result = await projectUser.findByIdAndUpdate(projectUserData._id, { role: role }, { new: true })
                    res.json(result);
                } else {
                    return res.status(400).json({ message: "At least one system admin is required for the project." });

                }
            }
        } else {
            const result = await projectUser.findByIdAndUpdate(projectUserData._id, { role: role }, { new: true })
            res.json(result);
        }


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRole = async (req, res) => {
    const { _id } = req;
    const { projectID } = req.body;
    try {
        const data = await projectUser.findOne({ user_id: _id, project_id: projectID });
        if (!data) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
