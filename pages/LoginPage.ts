import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePages";

export class LoginPage extends BasePage {
    private emailInput = this.page.locator("#Email");
    private passwordInput = this.page.locator("#Password");
    private loginButton = this.page.locator("button.login-button");
    private rememberMeCheckbox = this.page.locator("#RememberMe");
    private forgotPasswordLink = this.page.getByRole("link", { name: "Forgot password?" });
    private showPasswordIcon = this.page.locator("//span[@class='password-eye']").first();

    private emailError = this.page.locator('[data-valmsg-for="Email"]');
    private passwordError = this.page.locator('[data-valmsg-for="Password"]');
    private summaryError = this.page.locator(".message-error.validation-summary-errors");

    constructor(page: Page) {
        super(page);
    }
    async openLoginPage() {
        await this.page.goto("https://demo.nopcommerce.com/login");
        await expect(this.page).toHaveURL(/\/login/);
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async login(email: string, password: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
    }

    async tickRememberMe() {
        await this.rememberMeCheckbox.check();
    }

    async goToForgotPasswordPage() {
        await this.forgotPasswordLink.click();
        await expect(this.page).toHaveURL(/passwordrecovery/);
    }

    async logout() {
        await this.page.getByRole("link", { name: "Log out" }).click();
    }

    async verifyEmailError(message: string) {
        await expect(this.emailError).toHaveText(message);
    }

    async verifyPasswordError(message: string) {
        await expect(this.passwordError).toHaveText(message);
    }

    async verifySummaryError(message: string | RegExp) {
        await expect(this.summaryError).toContainText(message);
    }

    async verifyLoginSuccess() {
        await expect(this.page).toHaveURL(/\/$/);
        await expect(this.page.getByRole("link", { name: "Log out" })).toBeVisible();
    }

    async verifyForgotPasswordMessage() {
        await expect(
            this.page.getByText("Please enter your email address below. You will receive a link to reset your password.")
        ).toBeVisible();
    }

    async clickShowPassword() {
        await this.showPasswordIcon.click();
        await this.showPasswordIcon.scrollIntoViewIfNeeded();
        await this.showPasswordIcon.click({ force: true });
    }

    async verifyPasswordIsMasked() {
        // Kiểm tra type của input password phải là "password"
        await expect(this.passwordInput).toHaveAttribute("type", "password");
    }

    async verifyPasswordIsVisible() {
        // Sau khi click icon, type sẽ đổi thành "text"
        await expect(this.passwordInput).toHaveAttribute("type", "text");
    }

    async pressEnterToLogin() {
        await this.passwordInput.press("Enter");
    }
    async disableBrowserValidation() {
        await this.page.locator('form[action*="login"]').evaluate((form: HTMLFormElement) => {
            form.noValidate = true;
        });
    }
    async blurEmail() {
        await this.emailInput.blur();
    }
}