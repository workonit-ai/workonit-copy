const mongoose = require("mongoose");

const UserFileSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	fileName: {
		type: String,
		required: true,
	},
	metadata: {
		type: Object,
	},
	openAIData: {
		type: Object,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	
});
module.exports = mongoose.model("userFile", UserFileSchema);
