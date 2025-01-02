const mongoose = require("mongoose");
const Assistant = require("./Assistant");
const NotificationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
        assistantId:{
            type: String,
            ref:"Assistant",
            required:false
            
        },
        title:{
            type:String

        },
        body:{
            type:String
        },
        seen:{
            type:Boolean,
            required:true,
            default:false
        },
        date:{
            type:Date,
            required:false
        }

    })
    module.exports = mongoose.model("Notification", NotificationSchema);