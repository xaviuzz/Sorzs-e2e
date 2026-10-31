import { expect, test } from "@playwright/test";

const sampleSite = process.env.SAMPLE_SITE_URL ?? "http://localhost:5373";

test("a source added with no name is shown by its page title and favicon", async ({
	page,
}) => {
	const address = `${sampleSite}/${crypto.randomUUID()}`;
	await page.goto("/");

	await page.getByRole("button", { name: "Add Sorz" }).click();
	await page.getByRole("textbox", { name: "URL" }).fill(address);
	await page.getByRole("textbox", { name: "Title" }).click();
	await expect(page.getByRole("textbox", { name: "Title" })).toHaveValue(
		"Sorzs Sample Page",
	);
	await page.getByRole("button", { name: "Add", exact: true }).click();

	const sideBar = page.getByRole("complementary", { name: "Sources" });
	await expect(sideBar.getByText("Sorzs Sample Page")).toBeVisible();
	await expect(
		sideBar.getByRole("img", { name: "Favicon of Sorzs Sample Page" }),
	).toBeVisible();
});
