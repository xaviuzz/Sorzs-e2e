import { expect, test } from "@playwright/test";
import { logIn } from "./login";

test("logging in with the seeded user shows the app", async ({ page }) => {
	await logIn(page);

	await expect(page.getByRole("button", { name: "Add Sorz" })).toBeVisible();
});
