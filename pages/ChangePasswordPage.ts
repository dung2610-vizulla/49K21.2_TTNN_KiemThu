import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePages";

export class ChangePasswordPage extends BasePage {
    private oldPasswordInput = this.page.locator("#OldPassword");
    private newPasswordInput = this.page.locator("#NewPassword");
    private confirmPasswordInput = this.page.locator("#ConfirmNewPassword");
    private changePasswordButton = this.page.locator("button[class='button-1 change-password-button']");

    private oldPasswordError = this.page.locator("//span[@id='OldPassword-error']");
    private newPasswordError = this.page.locator("//span[@id='NewPassword-error']");
    private confirmPasswordError = this.page.locator("//span[@id='ConfirmNewPassword-error']");
    private successMessage = this.page.locator(".result, .bar-notification.success, .message-success");
    private summaryError = this.page.locator(".message-error");

    constructor(page: Page) {
        super(page);
    }

    async openChangePasswordPage() {
        await this.page.goto("https://demo.nopcommerce.com/customer/changepassword");
    }

    async fillOldPassword(password: string) {
        await this.oldPasswordInput.fill(password);
    }

    async fillNewPassword(password: string) {
        await this.newPasswordInput.fill(password);
    }

    async fillConfirmPassword(password: string) {
        await this.confirmPasswordInput.fill(password);
    }

    async clickChangePasswordButton() {
        await this.changePasswordButton.click();
    }

    async changePassword(oldPass: string, newPass: string, confirmPass: string) {
        await this.fillOldPassword(oldPass);
        await this.fillNewPassword(newPass);
        await this.fillConfirmPassword(confirmPass);
        await this.clickChangePasswordButton();
    }

    async verifySuccessMessage() {
        await expect(this.page.getByText("Password was changed")).toBeVisible();
    }

    async verifyOldPasswordError(message: string | RegExp) {
        await expect(this.oldPasswordError).toBeVisible();
        await expect(this.oldPasswordError).toContainText(message);
    }

    async verifyNewPasswordError(message: string | RegExp) {
        await expect(this.newPasswordError).toBeVisible();
        await expect(this.newPasswordError).toContainText(message);
    }

    async verifyConfirmPasswordError(message: string | RegExp) {
        await expect(this.confirmPasswordError).toBeVisible();
        await expect(this.confirmPasswordError).toContainText(message);
    }

    async verifySummaryError(message: string | RegExp) {
        await expect(this.summaryError).toBeVisible();
        await expect(this.summaryError).toContainText(message);
    }
}