import { test, expect } from "@playwright/test";

//ME: the first thing we want the test to do is to make it navigate to our homepage
const UI_URL = "http://localhost:5174/";

//ME: I'M GONNA CHANGE HERE
test("should allow the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(
    page.getByRole("heading", { name: "Welcome Back!" })
  ).toBeVisible();

  await page.locator("[name=email]").fill("user1@gmail.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
  await expect(page.getByText("My Bookings")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

//creating a new test
test("should allow user to register", async ({ page }) => {
  const testEmail = `user${
    Math.floor(Math.random() * 90000) + 10000
  }@gmail.com`;
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Register" }).click();
  await expect(
    page.getByRole("heading", { name: "Create An Account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("user3");
  await page.locator("[name=lastName]").fill("test3");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("123456");
  await page.locator("[name=confirmPassword]").fill("123456");

  await page.getByRole("button", { name: "Register" }).click();

  await expect(page.getByText("Registration Success!")).toBeVisible();
  await expect(page.getByText("My Bookings")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
