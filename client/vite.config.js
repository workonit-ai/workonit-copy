import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: "0.0.0.0",
	},
	resolve: {
		alias: {
			"@constants": "/src/constants",
			"@transformers": "/src/transformers",
			"@utils": "/src/utils",
			"@services": "/src/services",
			"@components": "/src/components",
		},
	},
});
