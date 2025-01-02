const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
	{
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: false,
		},
		role: {
			type: String,
			required: true,
		},
		company: {
			type: String,
			required: true
		},
		experience: {
			type: String,
			required: true
		},
		education: String,
		salary: String,
		availability: String,
		location: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		},
		jobType: String,
		userID: {
			ref: 'User',
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		status: {
			type: String,
			enum: ["Open", "Hired", "Paused"],
			default: "Open",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
