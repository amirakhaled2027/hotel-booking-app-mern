import { test, expect } from '@playwright/test';
import path from 'path';


//ME: the first thing we want the test to do is to make it navigate to our homepage
const UI_URL = "http://localhost:5173/";

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
  

  //write a test that: 
  //will fill in our search bar
  //a search that we have arrived on the search page
  //and that our test hotel that lives in pur test database gets displayed in the search result
test("Should show hotel search results", async ({page}) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("London");
    await page.getByRole("button", {name: "Search"}).click();

    await expect(page.getByText("Hotels found in London")).toBeVisible();
    await expect(page.getByText("The Gate London City")).toBeVisible();
});

//Test for showing a hotel page after clicking on the Sign In to Book Button 
test("should show hotel detail", async({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("where are you going?").fill("London");
  await page.getByRole("button", {name: "Search"}).click();

  await page.getByText("The Gate London City").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", {name: "Book now"})).toBeVisible();
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
});