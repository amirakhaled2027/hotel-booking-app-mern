import { test, expect } from '@playwright/test';
import path from 'path';

const UI_URL = "http://localhost:5174/"

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Welcome Back!" })).toBeVisible();

  await page.locator("[name=email]").fill("user1@gmail.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
    await page.goto(`${UI_URL}add-hotel`);

    await page.locator('[name="name"]').fill("Test2 Hotel");
    await page.locator('[name="city"]').fill("Test2 City");
    await page.locator('[name="country"]').fill("Test2 Country");
    await page.locator('[name="description"]').fill("This is the description for the Test Hotel");
    await page.locator('[name="pricePerNight"]').fill("100");
    await page.selectOption('select[name="starRating"]', "3");

    await page.getByText("Budget").click();

    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();

    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("4");

    await page.setInputFiles('[name="imageFiles"]', [
        //specifying the directory to the images that I've just added
        path.join(__dirname, "files", "1img.jpg"),
        path.join(__dirname, "files", "2img.jpg"),
        path.join(__dirname, "files", "3img.jpg"),
        path.join(__dirname, "files", "4img.jpg"),
        path.join(__dirname, "files", "5img.jpg"),
        path.join(__dirname, "files", "6img.jpg"),
    ]);

    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForSelector('text="Hotel Saved!"', { state: 'visible' });
});

//ADDING MY HOTELS TEST HERE; coz it's part of the manage hotel feature
test("should display hotels", async({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);
  await expect(page.getByText("Carmel, United States of America")).toBeVisible();
  await expect(page.getByText('Located 1 mile away from Carmel Beach')).toBeVisible();
  await expect(page.getByText("Carmel, United States of America")).toBeVisible();
  await expect(page.getByText("Beach Resort")).toBeVisible();
  await expect(page.getByText("$220 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 7 children")).toBeVisible();
  await expect(page.getByText("1 Star Rating")).toBeVisible();

  await expect(page.getByRole("link", {name: "View Details"}).first()).toBeVisible();
});

//EDIT AND UPDATE HOTEL PAGE
test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Horizon Inn & Ocean View Lodge");
  await page.locator('[name="name"]').fill("Horizon Inn & Ocean View Lodge: UPDATED");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  await page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue(
    "Horizon Inn & Ocean View Lodge: UPDATED"
  );
  await page.locator('[name="name"]').fill("Horizon Inn & Ocean View Lodge");
  await page.getByRole("button", { name: "Save" }).click();
});