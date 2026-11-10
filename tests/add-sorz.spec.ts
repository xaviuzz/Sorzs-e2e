import { expect, test } from "@playwright/test";
import { logIn } from "./login";

test("a sorz added through the dialog is still listed after a reload", async ({
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

	await page.reload();

	await expect(sideBar.getByText(name)).toHaveAttribute("title", address);
});
