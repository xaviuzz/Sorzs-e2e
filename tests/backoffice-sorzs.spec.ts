import { expect, type Page, test } from "@playwright/test";
import { type Credentials, logIn, xaviuzz } from "./login";

async function addSorz(page: Page, address: string) {
	await page.getByRole("button", { name: "Add Sorz" }).click();
	await page.getByRole("textbox", { name: "URL" }).fill(address);
	await page.getByRole("textbox", { name: "Title" }).fill(address);
	await page.getByRole("button", { name: "Add", exact: true }).click();
	await expect(
		page.getByRole("complementary", { name: "Sorzs" }).getByText(address),
	).toBeVisible();
}

async function registerUser(page: Page, user: Credentials) {
	await page.getByRole("button", { name: "Backoffice" }).click();
	await page.getByRole("button", { name: "Add user" }).click();
	await page.getByLabel("Username").fill(user.username);
	await page.getByLabel("Password").fill(user.password);
	await page.getByRole("button", { name: "Add", exact: true }).click();
	await expect(
		page.getByRole("listitem").filter({ hasText: user.username }),
	).toBeVisible();
	await page.getByRole("button", { name: "Back to Sorzs" }).click();
}

async function logOut(page: Page) {
	await page.getByRole("button", { name: "Log out" }).click();
	await expect(page.getByRole("button", { name: "Enter" })).toBeVisible();
}

test("the admin sees every registered sorz in address order with its users", async ({
	page,
}) => {
	const unique = crypto.randomUUID();
	const first = `https://${unique}-a.example.com`;
	const common = `https://${unique}-b.example.com`;
	const last = `https://${unique}-c.example.com`;
	const friend = { username: `user-${unique}`, password: "a-secret" };
	await logIn(page, xaviuzz);
	await registerUser(page, friend);
	await addSorz(page, first);
	await addSorz(page, common);
	await logOut(page);
	await logIn(page, friend);
	await addSorz(page, common);
	await addSorz(page, last);
	await logOut(page);
	await logIn(page, xaviuzz);

	await page.getByRole("button", { name: "Backoffice" }).click();
	await page.getByRole("button", { name: "Sorzs", exact: true }).click();

	const mine = page.getByRole("listitem").filter({ hasText: unique });
	await expect(mine).toHaveCount(3);
	await expect(mine.nth(0)).toContainText(first);
	await expect(mine.nth(0).getByRole("img", { name: "1 user" })).toBeVisible();
	await expect(mine.nth(1)).toContainText(common);
	await expect(mine.nth(1).getByRole("img", { name: "2 users" })).toBeVisible();
	await expect(mine.nth(2)).toContainText(last);
	await expect(mine.nth(2).getByRole("img", { name: "1 user" })).toBeVisible();
});
