import { expect, test } from "@playwright/test";
import { logIn } from "./login";

test("a collapsed sidebar shows only the icon of each sorz", async ({
	page,
}) => {
	const unique = crypto.randomUUID();
	const address = `https://${unique}.example.com`;
	const name = `Sorz ${unique}`;
	await logIn(page);
	await page.getByRole("button", { name: "Add Sorz" }).click();
	await page.getByRole("textbox", { name: "URL" }).fill(address);
	await page.getByRole("textbox", { name: "Title" }).fill(name);
	await page.getByRole("button", { name: "Add", exact: true }).click();
	const sideBar = page.getByRole("complementary", { name: "Sorzs" });
	await expect(sideBar.getByText(name)).toBeVisible();

	await page.getByRole("button", { name: "Toggle Sidebar" }).click();

	await expect(sideBar.getByText(name)).toBeHidden();
	const entry = sideBar.getByRole("listitem").filter({ hasText: name });
	await expect(entry.getByRole("img", { name: "No favicon" })).toBeVisible();
});
