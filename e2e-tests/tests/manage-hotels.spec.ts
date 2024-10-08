import { test, expect } from '@playwright/test';
import path from 'path';


//ME: the first thing we want the test to do is to make it navigate to our homepage
const UI_URL = "http://localhost:5173/"

//before each test that we define below, this code will run
test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("user3@gmail.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
    await page.goto(`${UI_URL}add-hotel`);

    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("This is the description for the Test Hotel");
    await page.locator('[name="pricePerNight"]').fill("100");
    await page.selectOption('select[name="starRating"]', "3");

    await page.getByText("Budget").click();

    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();

    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("4");

    await page.setInputFiles('[name="imageFiles"]', [
        //specifying the directory to our images that we're just added
        path.join(__dirname, "files", "1img.jpg"),
        path.join(__dirname, "files", "2img.jpg"),
        path.join(__dirname, "files", "3img.jpg"),
        path.join(__dirname, "files", "4img.jpg"),
        path.join(__dirname, "files", "5img.jpg"),
        path.join(__dirname, "files", "6img.jpg"),
        
    ]);

    await page.getByRole("button", { name: "Save" }).click();
    // await expect(page.getByText("Hotel Saved!")).toBeVisible({ timeout: 10000 });
    await page.waitForSelector('text="Hotel Saved!"', { state: 'visible' });
});

//ADDING NY HOTELS TEST HERE; coz it's part of the manage hotel feature
test("should display hotels", async({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);
  await expect(page.getByText("NY Ski")).toBeVisible();
  // await page.waitForSelector('text=NY Ski', { state: 'visible' }); 
  // await expect(page.getByText('NY Ski')).toBeVisible();
  await expect(page.getByText('Aenean bibendum felis lorem, nec tincidunt augue aliquam et.')).toBeVisible();
  await expect(page.getByText("NY, USA")).toBeVisible();
  await expect(page.getByText("Ski Resort")).toBeVisible();
  await expect(page.getByText("$200 per night")).toBeVisible();
  await expect(page.getByText("2 adults, 2 children")).toBeVisible();
  await expect(page.getByText("4 Star Rating")).toBeVisible();

  await expect(page.getByRole("link", {name: "View Detail"}).first()).toBeVisible();
});

//EDIT AND UPDATE HOTEL PAGE
test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Test Hotel");
  await page.locator('[name="name"]').fill("Test Hotel  UPDATED");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  await page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue(
    "Test Hotel  UPDATED"
  );
  await page.locator('[name="name"]').fill("Test Hotel");
  await page.getByRole("button", { name: "Save" }).click();
});

