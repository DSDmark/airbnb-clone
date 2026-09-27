import { expect, test } from "@playwright/test";

const tour = (page: import("@playwright/test").Page) => page.getByRole("dialog", { name: "Photo tour" });
const viewer = (page: import("@playwright/test").Page) => page.getByRole("dialog", { name: "Photo viewer" });

test.describe("photo tour", () => {
  test("opens from “Show all photos”, deep-links, and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Show all photos" });
    await trigger.click();

    await expect(tour(page)).toBeVisible();
    await expect(page).toHaveURL(/modal=PHOTO_TOUR_SCROLLABLE/);
    await expect(tour(page).getByRole("heading", { name: "Photo tour" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(tour(page)).toBeHidden();
    await expect(page).not.toHaveURL(/modal=/);
    await expect(trigger).toBeFocused();
  });

  test("opens from any hero photo", async ({ page }) => {
    await page.goto("/");
    await page.locator("#photos button").nth(2).click();
    await expect(tour(page)).toBeVisible();
  });

  test("browser Back closes the tour", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all photos" }).click();
    await expect(tour(page)).toBeVisible();
    await page.goBack();
    await expect(tour(page)).toBeHidden();
  });

  test("room tiles scroll to their section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all photos" }).click();
    const tile = tour(page).getByRole("button", { name: /^Scroll to / }).nth(3);
    const name = (await tile.getAttribute("aria-label"))!.replace("Scroll to ", "");
    await tile.click();
    const heading = tour(page).getByRole("heading", { name, exact: true });
    await expect(heading).toBeInViewport();
    // Parks the heading 24px under the 60px bar, as on the reference.
    await expect.poll(async () => Math.round((await heading.boundingBox())!.y)).toBe(84);
  });

  test("“Where you’ll sleep” cards open the tour at their room", async ({ page }) => {
    await page.goto("/");
    await page.locator("section[aria-labelledby=sleep-heading] button").first().click();
    const heading = tour(page).locator("#tour-room-bedroom-title");
    await expect(heading).toBeInViewport();
    // Poll: the sheet is still sliding up for the first 400ms.
    await expect.poll(async () => Math.round((await heading.boundingBox())!.y)).toBe(84);
  });

  test("keeps Tab inside the dialog", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all photos" }).click();
    await expect(tour(page)).toBeVisible();
    for (let i = 0; i < 40; i++) await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => !!document.activeElement?.closest('[aria-label="Photo tour"]'));
    expect(inside).toBe(true);
  });
});

test.describe("lightbox", () => {
  test("navigates with arrows and keyboard, then returns focus to the last photo", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all photos" }).click();
    await tour(page).getByRole("button", { name: /photo 1 of/ }).first().click();

    await expect(viewer(page)).toBeVisible();
    await expect(page).toHaveURL(/modalItem=/);
    const counter = viewer(page).locator("p").filter({ hasText: /^\d+ \/ \d+$/ });
    await expect(counter).toHaveText(/^1 \//);
    await expect(viewer(page).getByRole("button", { name: "Previous photo" })).toBeDisabled();

    await page.keyboard.press("ArrowRight");
    await expect(counter).toHaveText(/^2 \//);
    await viewer(page).getByRole("button", { name: "Next photo" }).click();
    await expect(counter).toHaveText(/^3 \//);
    await page.keyboard.press("ArrowLeft");
    await expect(counter).toHaveText(/^2 \//);

    await page.keyboard.press("Escape");
    await expect(viewer(page)).toBeHidden();
    await expect(tour(page)).toBeVisible();
    await expect(page.locator(":focus")).toHaveAttribute("aria-label", /photo 2 of/);
  });

  test("deep link opens straight into the viewer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all photos" }).click();
    await tour(page).getByRole("button", { name: /photo 1 of/ }).first().click();
    const url = page.url();

    await page.goto(url);
    await expect(viewer(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(tour(page)).toBeVisible();
    await expect(page).toHaveURL(/modal=PHOTO_TOUR_SCROLLABLE$/);
  });
});
