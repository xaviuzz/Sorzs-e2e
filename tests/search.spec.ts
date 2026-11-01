import { expect, test } from "@playwright/test";

test("a search shows a Google link limited to the site of the added source", async ({
	page,
}) => {
	const unique = crypto.randomUUID();
	const host = `${unique}.example.com`;
	const name = `Source ${unique}`;
	const query = `sorzs ${unique}`;
	await page.goto("/");
	await page.getByRole("button", { name: "Add Sorz" }).click();
	await page.getByRole("textbox", { name: "URL" }).fill(`https://${host}/docs`);
	await page.getByRole("textbox", { name: "Title" }).fill(name);
	await page.getByRole("button", { name: "Add", exact: true }).click();
	const sideBar = page.getByRole("complementary", { name: "Sources" });
	await expect(sideBar.getByText(name)).toBeVisible();

	await page.getByRole("textbox", { name: "Query" }).fill(query);
	await page.getByRole("button", { name: "Search" }).click();

	const result = page.getByRole("link", { name });
	await expect(result).toHaveAttribute(
		"href",
		`https://www.google.com/search?q=${encodeURIComponent(query)}%20site:${host}/docs`,
	);
});
