import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Logout Tests", () => {
    let login: LoginPage;

    const EMAIL = "demo@gmail.com";
    const PASSWORD = "123456";

    test.beforeEach(async ({ page }) => {
        await page.context().clearCookies();
        login = new LoginPage(page);

        await login.openLoginPage();
        await login.login(EMAIL, PASSWORD);
        await login.clickLoginButton();
        await login.verifyLoginSuccess();
    });

    test("Logout-001 - Click Log out link should redirect to Home page", async ({ page }) => {
        await login.logout();

        await expect(page).toHaveURL(/\/$/);

        await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Log out" })).toBeHidden();
    });

    test("Logout-002 - After logout, cannot access previous page by URL", async ({ page }) => {
        const previousUrl = page.url();

        await login.logout();
        await page.goto(previousUrl);

        await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Log out" })).toBeHidden();
    });
});