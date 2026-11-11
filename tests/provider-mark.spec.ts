import { expect, type Page, test } from "@playwright/test";
import { logIn, xaviuzz } from "./login";

async function addSorz(page: Page, address: string) {
	await page.getByRole("button", { name: "Add Sorz" }).click();
	await page.getByRole("textbox", { name: "URL" }).fill(address);
	await page.getByRole("textbox", { name: "Title" }).fill(address);
	await page.getByRole("button", { name: "Add", exact: true }).click();
	await expect(
		page.getByRole("complementary", { name: "Sorzs" }).getByText(address),
	).toBeVisible();
}

test("a sorz with a specific provider is marked in the list and the census", async ({
	page,
}) => {
	const unique = crypto.randomUUID().slice(0, 8);
	const reddit = `https://www.reddit.com/r/${unique}`;
	const other = `https://${unique}.example.com`;
	await logIn(page, xaviuzz);
	await addSorz(page, reddit);
	await addSorz(page, other);

	const list = page.getByRole("complementary", { name: "Sorzs" });
	const inList = (address: string) =>
		list.getByRole("listitem").filter({ hasText: address });
	await expect(
		inList(reddit).getByRole("img", { name: "Searched by Reddit" }),
	).toBeVisible();
	await expect(
		inList(other).getByRole("img", { name: "Searched by Reddit" }),
	).toHaveCount(0);

	await page.getByRole("button", { name: "Backoffice" }).click();
	await page.getByRole("button", { name: "Sorzs", exact: true }).click();
	const inCensus = (address: string) =>
		page.getByRole("listitem").filter({ hasText: address });
	await expect(
		inCensus(reddit).getByRole("img", { name: "Searched by Reddit" }),
	).toBeVisible();

	await page.getByRole("switch", { name: "Only generic provider" }).click();

	await expect(inCensus(other)).toBeVisible();
	await expect(inCensus(reddit)).toHaveCount(0);
});
