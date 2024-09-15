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

