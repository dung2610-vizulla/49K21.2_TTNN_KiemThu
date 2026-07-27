import { Page, expect } from "@playwright/test";

export class ForgotPasswordPage {

    constructor(private page: Page) { }

    async openForgotPasswordPage() {
        await this.page.click("text=Log in");
        await this.page.click("text=Forgot password?");
    }

    async enterEmail(email: string) {
        await this.page.fill("#Email", email);
    }

    async clickRecoverButton() {
        await this.page.click("button.password-recovery-button");
    }

    async recoverPassword(email: string) {
        await this.enterEmail(email);
        await this.clickRecoverButton();
    }

    async verifyRecoverSuccess() {
        await expect(
            this.page.locator("//p[@class='content']")
        ).toContainText("Email not found.");
    }
}