import { expect, test } from "@playwright/test";

const sampleSite = process.env.SAMPLE_SITE_URL ?? "http://localhost:5373";

test("a candidate picked from a deep address is added with its own title", async ({
	page,
}) => {
	const deepAddress = `${sampleSite}/${crypto.randomUUID()}/docs/guide`;
	await page.goto("/");

	await page.getByRole("button", { name: "Add Sorz" }).click();
	await page.getByRole("textbox", { name: "URL" }).fill(deepAddress);
	await page.getByRole("textbox", { name: "Title" }).click();
	await expect(page.getByRole("button", { name: "Sorzs Guide" })).toBeVisible();
	await page.getByRole("button", { name: "Sorzs Home" }).click();
	await expect(page.getByRole("textbox", { name: "URL" })).toHaveValue(
		sampleSite,
	);
	await page.getByRole("button", { name: "Add", exact: true }).click();

	const sideBar = page.getByRole("complementary", { name: "Sources" });
	await expect(sideBar.getByText("Sorzs Home")).toBeVisible();
});
