const envUrls = {
	development: {
		api_url: "http://localhost:3000/api",
		// api_url: "http://work-on-it-test-env.us-east-1.elasticbeanstalk.com/api",
		file_url: "http://localhost:3000",
		front_end: "http://localhost:5173",
	},
	preview: {
		// api_url: "https://test.workonit.ai/api", // Used in the code
		api_url: "http://work-on-it-test-env.us-east-1.elasticbeanstalk.com/api",
		file_url: "https://test.workonit.ai/",
		front_end: "http://work-on-it-test-env.us-east-1.elasticbeanstalk.com/",
	},
	production: {
		api_url: "https://www.workonit.ai/api", // Used in the code
		file_url: "https://www.workonit.ai",
		front_end: "https://www.workonit.ai/",
	},
}

const commonUrls = {
	bucketUrl: "/assets/images",
};

const env = import.meta.env.MODE;

export const environmentUrls = {
	...envUrls[env],
	...commonUrls,
};
