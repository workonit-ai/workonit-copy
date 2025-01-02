const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
    },
    created_on_behalf_of_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cvId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CV",
        required: false,
    },
    company_id:{
        type:String,
        required:false
    },
    seen:{
        type:Boolean,
        required:false
    }
    
    
});

module.exports = mongoose.model("Application", applicationSchema);