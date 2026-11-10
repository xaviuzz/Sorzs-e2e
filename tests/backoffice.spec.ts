import { expect, test } from "@playwright/test";
import { logIn, xaviuzz } from "./login";

test("the admin enters the backoffice, switches sections and goes back", async ({
	page,
}) => {
	await logIn(page, xaviuzz);

	await page.getByRole("button", { name: "Backoffice" }).click();
	await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();

	await page.getByRole("button", { name: "Sorzs", exact: true }).click();
	await expect(
		page.getByRole("heading", { name: "Sorzs", level: 2 }),
	).toBeVisible();

	await page.getByRole("button", { name: "Back to Sorzs" }).click();
	await expect(
		page.getByRole("complementary", { name: "Sorzs" }),
	).toBeVisible();
});
