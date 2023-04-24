
const mongoose = require("mongoose");
const projectUserSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', required: true
    },
    role: {
        type: String
    }
});

module.exports = mongoose.model("ProjectUser", projectUserSchema);