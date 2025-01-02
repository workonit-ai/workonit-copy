const User = require("../models/User");

const seedUser = async () => {
	try {
		const user = new User({
			name: "Roee",
			email: "roee@workonit.ai",
		});
		await user.setPassword("Asdf1234");
		user.status = "active";
		user.role = "user";
		await user.save();
		console.log("User Seeded");
	} catch (error) {
		console.log("🚀 error:", error);
	}
};

module.exports = seedUser;
