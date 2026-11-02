import { expect, type Page } from "@playwright/test";

export interface Credentials {
	username: string;
	password: string;
}

export const xaviuzz: Credentials = {
	username: "xaviuzz",
	password: "p1casso",
};

export const ana: Credentials = { username: "ana", password: "pueblos" };

export async function logIn(page: Page, user: Credentials = xaviuzz) {
	await page.goto("/");
	await page.getByLabel("Username").fill(user.username);
	await page.getByLabel("Password").fill(user.password);
	await page.getByRole("button", { name: "Enter" }).click();
	await expect(
		page.getByRole("status", { name: "Service is up" }),
	).toBeVisible();
}
