import { defineConfig } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:5273";

export default defineConfig({
	testDir: "tests",
	use: { baseURL },
});
