import { expect, test } from "@playwright/test";
import { logIn, xaviuzz } from "./login";

test("the admin sees the users, adds one and that user enters with the password given", async ({
	page,
}) => {
	const username = `user-${crypto.randomUUID()}`;
	const password = "a-secret";
	await logIn(page, xaviuzz);

	await page.getByRole("button", { name: "Backoffice" }).click();

	const admin = page.getByRole("listitem").filter({ hasText: "xaviuzz" });
	await expect(admin).toContainText("admin");
	const ana = page.getByRole("listitem").filter({ hasText: "ana" });
	await expect(ana).toContainText("user");

	await page.getByRole("button", { name: "Add user" }).click();
	await page.getByLabel("Username").fill(username);
	await page.getByLabel("Password").fill(password);
	await page.getByRole("button", { name: "Add", exact: true }).click();
	const added = page.getByRole("listitem").filter({ hasText: username });
	await expect(added).toContainText("user");

	await page.getByRole("button", { name: "Log out" }).click();
	await expect(page.getByRole("button", { name: "Enter" })).toBeVisible();

	await logIn(page, { username, password });
	await expect(page.getByRole("button", { name: "Add Sorz" })).toBeVisible();
});
