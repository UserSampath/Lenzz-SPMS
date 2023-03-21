const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    progressStage_id: {
        type: mongoose.Schema.Types.ObjectId,  //
        ref: 'ProgressStage'
    },
    name: {
        type: String,
        required: true
    },
    flag: {
        type: String
    },
    assign: {
        type: String,
        required: true
    },
    reporter: {
        type: String,
        required: true
    },
    link: {
        type: String,
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    taskIndex: {
        type: Number
    },
    files: [{
        fileName: {
            type: String,
            
        },
        location: {
            type: String,
            
        }
    }]

}
    , { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema)
// module.exports = mongoose.model('Staff', StaffSchema);


