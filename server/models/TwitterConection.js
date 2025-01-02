const mongoose = require("mongoose");
const TwitterConectionSchema = new mongoose.Schema(
	{
		codeVerifier:String,
        state:String,
		code:String,
		accessToken:{
			type: String,
			required: false
		},
		 refreshToken:{
			type: String,
			required: false
		},
		userId: {
			ref: 'User',
			type: mongoose.Schema.Types.ObjectId,
			required: true
		}, 
		username:{
			type:String,
			required:false
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("TwitterConection", TwitterConectionSchema);
