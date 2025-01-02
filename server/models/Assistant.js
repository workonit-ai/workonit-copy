const mongoose = require("mongoose");

const assistantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    assistant_id: {
        type: String,
        required: false,
    },
    tagline: {
        type: String,
        required: false,
    },
    sampleQuestions: [{
        type: String,
        required: false,
    }],
});

module.exports = mongoose.model("Assistant", assistantSchema);