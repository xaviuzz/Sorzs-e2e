import { expect, test } from "@playwright/test";

test("the page shows the service is up", async ({ page }) => {
	await page.goto("/");

	const mark = page.getByRole("status", { name: "Service is up" });

	await expect(mark).toBeVisible();
});
