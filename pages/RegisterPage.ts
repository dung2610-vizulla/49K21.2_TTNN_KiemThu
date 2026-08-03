import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePages";

export class registerPage extends BasePage {
    private firstnameInput = this.page.locator("//input[@id='FirstName']");
    private lastnameInput = this.page.locator("//input[@id='LastName']");
    private emailInput = this.page.locator("//input[@id='Email']");
    private companyInput = this.page.locator("//input[@id='Company']");
    private passwordInput = this.page.locator("//input[@id='Password']");
    private confirmpasswordInput = this.page.locator("//input[@id='ConfirmPassword']");
    private registerButton = this.page.locator("//button[@id='register-button']");
    private genderMale = this.page.locator("//input[@id='gender-male']");
    private newsletterCheckbox = this.page.locator("//input[@id='NewsLetterSubscriptions_0__IsActive']");
    private successMessage = this.page.locator("//div[@class='result']");
    private firstNameError = this.page.locator('[data-valmsg-for="FirstName"]');
    private lastNameError = this.page.locator('[data-valmsg-for="LastName"]');
    private emailError = this.page.locator('[data-valmsg-for="Email"]');
    private confirmpasswordError = this.page.locator('[data-valmsg-for="ConfirmPassword"]');
    private passwordError = this.page.locator('[data-valmsg-for="Password"]');
    private emailExits = this.page.locator("div[class='message-error validation-summary-errors'] ul li");
    private triggerclick = this.page.locator("section:nth-child(2) h2:nth-child(1)");


    constructor(page: Page) {
        super(page);
    }

    async openRegisterPage() {
        await this.page.goto('https://demo.nopcommerce.com/register');
        await expect(this.page).toHaveURL(/\/register\/?$/);
    }

    async clickRegisterLink() {
        const registerLink = this.page.locator("//a[normalize-space()='Register']");
        await expect(registerLink).toBeVisible();
        await registerLink.click();
    }

    async chooseGenderMale() {
        await expect(this.genderMale).toBeVisible();
        await this.genderMale.check();
        await expect(this.genderMale).toBeChecked();
    }

    async fillFirstName(firstName: string) {
        await expect(this.firstnameInput).toBeVisible();
        await this.firstnameInput.fill(firstName);
        await expect(this.firstnameInput).toHaveValue(firstName);
    }

    async fillLastName(lastName: string) {
        await expect(this.lastnameInput).toBeVisible();
        await this.lastnameInput.fill(lastName);
        await expect(this.lastnameInput).toHaveValue(lastName);
    }

    async fillEmail(email: string) {
        await expect(this.emailInput).toBeVisible();
        await this.emailInput.fill(email);
        await expect(this.emailInput).toHaveValue(email);
    }

    async fillCompany(company: string) {
        await this.companyInput.fill(company);
        await expect(this.companyInput).toHaveValue(company);
    }

    async subscribeNewsletter() {
        await this.newsletterCheckbox.check();
        await expect(this.newsletterCheckbox).toBeChecked();
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
        await expect(this.passwordInput).toHaveValue(password);
    }

    async fillConfirmPassword(confirmPassword: string) {
        await this.confirmpasswordInput.fill(confirmPassword);
        await expect(this.confirmpasswordInput).toHaveValue(confirmPassword);
    }

    async clickRegisterButton() {
        await this.registerButton.click();
    }

    async verifySuccessMessage() {
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toHaveText(/Your registration completed/);
    }

    async verifyFirstNameError(expectedMessage: string) {
        await expect(this.firstNameError).toBeVisible();
        await expect(this.firstNameError).toHaveText(expectedMessage);
    }

    async verifyLastNameError(expectedMessage: string) {
        await expect(this.lastNameError).toBeVisible();
        await expect(this.lastNameError).toHaveText(expectedMessage);
    }
    async verifytriggerclick() {
        await expect(this.triggerclick).toBeVisible();
        await this.triggerclick.click();
    }

    async verifyEmailError(expectedMessage: string) {
        // await expect(this.emailError).toBeVisible({ timeout: 1000});
        
        await expect(this.emailError).toHaveText(expectedMessage);
    }

    async verifyEmailExists(expectedMessage: string) {
        await expect(this.emailExits).toBeVisible();
        await expect(this.emailExits).toHaveText(expectedMessage);
    }

    async verifyPasswordError(expectedMessage: string) {
        await expect(this.passwordError).toBeVisible();
        await expect(this.passwordError).toHaveText(expectedMessage);
    }

    async verifyConfirmPasswordError(expectedMessage: string) {
        await expect(this.confirmpasswordError).toBeVisible();
        await expect(this.confirmpasswordError).toHaveText(expectedMessage);
    }

    async verifyPasswordFieldsAreMasked() {
        await expect(this.passwordInput).toHaveAttribute("type", "password");
        await expect(this.confirmpasswordInput).toHaveAttribute("type", "password");
    }

    async fillRegisterForm(data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        company?: string;
        password?: string;
        confirmPassword?: string;
        genderMale?: boolean;
        newsletter?: boolean;
    }) {
        if (data.genderMale) await this.chooseGenderMale();
        if (data.firstName !== undefined) await this.fillFirstName(data.firstName);
        if (data.lastName !== undefined) await this.fillLastName(data.lastName);
        if (data.email !== undefined) await this.fillEmail(data.email);
        if (data.company !== undefined) await this.fillCompany(data.company);
        if (data.newsletter) await this.subscribeNewsletter();
        if (data.password !== undefined) await this.fillPassword(data.password);
        if (data.confirmPassword !== undefined) await this.fillConfirmPassword(data.confirmPassword);
    }
    async registerAccount(data: {
        firstName: string;
        lastName: string;
        email: string;
        company?: string;
        password: string;
        confirmPassword: string;
    }) {
        await this.fillRegisterForm({
            ...data,
            genderMale: true,
            newsletter: true,
            company: data.company || "Company"
        });
        await this.clickRegisterButton();
        await this.verifySuccessMessage();
    }
    async disableBrowserValidation() {
        await this.page.locator('form[action*="register"]').evaluate((form: HTMLFormElement) => {
            form.noValidate = true;
        });
    }
}