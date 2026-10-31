import { expect, test } from "@playwright/test";

test("a collapsed sidebar shows only the icon of each source", async ({
	page,
}) => {
	const unique = crypto.randomUUID();
	const address = `https://${unique}.example.com`;
	const name = `Source ${unique}`;
	await page.goto("/");
	await page.getByRole("button", { name: "Add Sorz" }).click();
	await page.getByRole("textbox", { name: "Address" }).fill(address);
	await page.getByRole("textbox", { name: "Name" }).fill(name);
	await page.getByRole("button", { name: "Add", exact: true }).click();
	const sideBar = page.getByRole("complementary", { name: "Sources" });
	await expect(sideBar.getByText(name)).toBeVisible();

	await page.getByRole("button", { name: "Toggle Sidebar" }).click();

	await expect(sideBar.getByText(name)).toBeHidden();
	const entry = sideBar.getByRole("listitem").filter({ hasText: name });
	await expect(entry.getByRole("img", { name: "No favicon" })).toBeVisible();
});
