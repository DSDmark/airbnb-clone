import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the listing essentials", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#photos img")).toHaveCount(5);
  await expect(page.getByRole("button", { name: /Check availability/ }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "What this place offers" })).toBeVisible();
});

test("sticky subnav appears once the photos scroll away", async ({ page }) => {
  await page.goto("/");
  const subnav = page.getByRole("navigation", { name: "Listing sections" });
  await expect(subnav).toBeHidden();
  await page.mouse.wheel(0, 900);
  await expect(subnav).toBeVisible();
  await subnav.getByRole("button", { name: "Reviews" }).click();
  await expect(page.locator("#reviews")).toBeInViewport();
});

test("dialogs trap focus, close on Escape and restore focus", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /Show all \d+ amenities/ });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "What this place offers" });
  await expect(dialog).toBeVisible();

  for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("save toggles and persists", async ({ page }) => {
  await page.goto("/");
  const save = page.getByRole("button", { name: "Add to wishlist" }).first();
  await save.click();
  await expect(page.getByRole("button", { name: "Remove from wishlist" }).first()).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByRole("button", { name: "Remove from wishlist" }).first()).toBeVisible();
});

test("date picker selects a range and prices the stay", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /^Change dates/ }).click();
  const picker = page.getByRole("dialog", { name: "Select dates" });
  await expect(picker).toBeVisible();
  const available = picker.getByRole("button", { name: /Available\.$/ });
  await available.nth(3).click();
  await available.nth(5).click();
  await expect(picker.getByRole("heading", { name: /nights?$/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Reserve" }).first()).toBeVisible();
});

test("keyboard users can reach the hero photos and open the tour", async ({ page }) => {
  await page.goto("/");
  await page.locator("#photos button").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Photo tour" })).toBeVisible();
});

test("has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).exclude("iframe").analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${v.id}: ${v.nodes.length} node(s)`)).toEqual([]);
});

test("photo tour and lightbox have no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Show all photos" }).click();
  await expect(page.getByRole("dialog", { name: "Photo tour" })).toBeVisible();
  let results = await new AxeBuilder({ page }).include('[aria-label="Photo tour"]').analyze();
  expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);

  await page.getByRole("dialog", { name: "Photo tour" }).getByRole("button", { name: /photo 1 of/ }).first().click();
  await expect(page.getByRole("dialog", { name: "Photo viewer" })).toBeVisible();
  results = await new AxeBuilder({ page }).include('[aria-label="Photo viewer"]').analyze();
  expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
});
