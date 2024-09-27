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
})