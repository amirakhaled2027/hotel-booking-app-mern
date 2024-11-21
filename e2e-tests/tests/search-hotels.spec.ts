import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5174/";

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
  
test("Should show hotel search results", async ({page}) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("Type Location").fill("USA");
    await page.getByRole("button", {name: "Search"}).click();

    await expect(page.getByText("Hotel found in USA")).toBeVisible();
    await expect(page.getByText("Stilwell Hotel (Hotel)")).toBeVisible();
});

//Test for showing a hotel page after clicking on the Sign In to Book Button 
test("should show hotel detail", async({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Type Location").fill("USA");
  await page.getByRole("button", {name: "Search"}).click();

  await page.getByText("Stilwell Hotel (Hotel)").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", {name: "Book Now"})).toBeVisible();
}); 


//Test for booking hotels
test("should book hotel", async ({page}) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("where are you going?").fill("London");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", {name: "Search"}).click();

  await page.getByText("The Gate London City").click();
  await page.getByRole("button", {name: "Book now"}).click();

  await expect(page.getByText("Total Cost: $630.00"));

  //for filling in the stripe form
  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame
    .locator('[placeholder="Card number"]')
    .fill("4242424242424242 ");
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("23/25");
  await stripeFrame.locator('[placeholder="CVC"]').fill("454");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("44567");

  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Booking Saved!")).toBeVisible();

  //For My Booking Page
  await page.getByRole("link", { name: "My Bookings"}).click();
  await expect(page.getByText("The Gate London City")).toBeVisible();
});