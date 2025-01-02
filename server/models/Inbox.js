const mongoose = require("mongoose");

const inboxSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	assistantId: {
		type: String,
		ref: "Agent",
		required: true,
	},
	threadId: {
		type: String,
		required: true,
	},
	lastRunId: {
		type: String,
		required: false,
	},
	lastModified: {
		type: Date,
		default: Date.now(),
	},
	// name: {
	// 	type: String
	// }, todo
});

inboxSchema.index({
	userId: 1,
	assistantId: 1,
	lastModified: -1
})

inboxSchema.pre(/update/, async function(next) {
	this.lastModified = Date.now();
	next();
});

module.exports = mongoose.model("Inbox", inboxSchema);
