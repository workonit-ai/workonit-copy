const User = require("../models/User");

const seedAdmin = async () => {
	try {
		const admin = new User({
			name: "WorkOnIt",
			email: "admin@workonit.ai",
		});
		await admin.setPassword("Asdf1234");
		admin.status = "active";
		admin.role = "admin";
		await admin.save();
		console.log("Admin Seeded");
	} catch (error) {
		console.log("🚀 error:", error);
	}
};

module.exports = seedAdmin;
