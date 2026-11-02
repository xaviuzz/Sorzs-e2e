import { expect, type Page } from "@playwright/test";

export async function logIn(page: Page) {
	await page.goto("/");
	await page.getByLabel("Username").fill("xaviuzz");
	await page.getByLabel("Password").fill("p1casso");
	await page.getByRole("button", { name: "Enter" }).click();
	await expect(
		page.getByRole("status", { name: "Service is up" }),
	).toBeVisible();
}
