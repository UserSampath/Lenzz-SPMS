const mongoose = require('mongoose');

const ProgressStageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    listIndex: {
        type:Number
    }
    
}
    , { timestamps: true });

module.exports = mongoose.model('ProgressStage', ProgressStageSchema);


