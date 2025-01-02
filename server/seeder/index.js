const mongoose = require('mongoose');

/* *
 * 
 * 
require('dotenv').config(); // Run the seeder on the production env
 * 
 * 
 * * */
require('dotenv').config({ path: '.env.development.local' }); // Run the seeder for the local env
const {MONGODB_URI, NODE_ENV} = process.env;
const seedAdmin = require('./seedAdmin');
const seedUser = require('./seedUser');

let isProduction = NODE_ENV === 'production';

mongoose
    .connect(`${MONGODB_URI}?retryWrites=false`)
    .catch((err) => {
		console.log(err);
		process.exit(1);
    })
    .then(() => {
		console.log(`connected to db in ${isProduction ? "Prod" : "Dev"} environment`);
		init();
	});


async function init() {
	// await mongoose.connection.db.dropDatabase();
	await seedAdmin();
    await seedUser();
	exit();
}

function exit() {
	console.log("exiting");
	process.exit(1);
}
