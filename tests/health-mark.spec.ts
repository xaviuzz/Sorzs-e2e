import { expect, test } from "@playwright/test";
import { logIn } from "./login";

test("the page shows the service is up", async ({ page }) => {
	await logIn(page);

	const mark = page.getByRole("status", { name: "Service is up" });

	await expect(mark).toBeVisible();
});
