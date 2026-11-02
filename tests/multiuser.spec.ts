import { expect, test } from "@playwright/test";
import { ana, logIn, xaviuzz } from "./login";

test("each user sees only their own list after logging out and in", async ({
	page,
}) => {
	const unique = crypto.randomUUID();
	const address = `https://${unique}.example.com`;
	const name = `Source ${unique}`;
	const sideBar = page.getByRole("complementary", { name: "Sources" });
	await logIn(page, xaviuzz);

	await page.getByRole("button", { name: "Add Sorz" }).click();
	await page.getByRole("textbox", { name: "URL" }).fill(address);
	await page.getByRole("textbox", { name: "Title" }).fill(name);
	await page.getByRole("button", { name: "Add", exact: true }).click();
	await expect(sideBar.getByText(name)).toBeVisible();

	await page.getByRole("button", { name: "Log out" }).click();
	await expect(page.getByRole("button", { name: "Enter" })).toBeVisible();

	await logIn(page, ana);
	await expect(sideBar.getByText("You have no sources yet")).toBeVisible();
	await expect(sideBar.getByText(name)).toHaveCount(0);

	await page.getByRole("button", { name: "Log out" }).click();
	await expect(page.getByRole("button", { name: "Enter" })).toBeVisible();
});
