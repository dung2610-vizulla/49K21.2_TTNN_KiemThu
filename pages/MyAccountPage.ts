import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePages";

export class MyAccountPage extends BasePage {
    // ===== Customer Info =====
    private firstNameInput = this.page.locator("#FirstName");
    private lastNameInput = this.page.locator("#LastName");
    private emailInput = this.page.locator("#Email");
    private companyInput = this.page.locator("#Company");
    private saveButton = this.page.locator("button[name='save-info-button']");

    private firstNameError = this.page.locator('[data-valmsg-for="FirstName"]');
    private lastNameError = this.page.locator('[data-valmsg-for="LastName"]');
    private emailError = this.page.locator("//span[@id='Email-error']");
    private companyError = this.page.locator('[data-valmsg-for="Company"]');
    private successMessage = this.page.locator(".bar-notification.success, .result");

    // ===== Addresses =====
    private addNewAddressButton = this.page.locator('.button-1.add-address-button');
    private addressFirstName = this.page.locator("//input[@id='Address_FirstName']");
    private addressLastName = this.page.locator("#Address_LastName");
    private addressEmail = this.page.locator("#Address_Email");
    private addressCountry = this.page.locator("#Address_CountryId");
    private addressStateProvince = this.page.locator("//select[@id='Address_StateProvinceId']");
    private addressCity = this.page.locator("#Address_City");
    private addressAddress1 = this.page.locator("#Address_Address1");
    private addressZip = this.page.locator("#Address_ZipPostalCode");
    private addressPhone = this.page.locator("#Address_PhoneNumber");
    private saveAddressButton = this.page.locator("//button[normalize-space()='Save']");
    private summaryError = this.page.locator("//li[normalize-space()='The email address is already in use']");
    private addressFirstNameError = this.page.locator('[data-valmsg-for="Address.FirstName"]');

    constructor(page: Page) {
        super(page);
    }

    async openCustomerInfo() {
        await this.page.goto("https://demo.nopcommerce.com/customer/info");
    }

    async openAddresses() {
        await this.page.goto("https://demo.nopcommerce.com/customer/addresses");
    }

    // ===== Customer Info methods =====
    async fillCustomerInfo(data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        company?: string;
    }) {
        if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
        if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
        if (data.email !== undefined) await this.emailInput.fill(data.email);
        if (data.company !== undefined) await this.companyInput.fill(data.company);
    }

    async clickSaveInfo() {
        await this.saveButton.click();
    }

    async verifySuccessMessage(message: string | RegExp) {
        await expect(this.page.getByText(message)).toBeVisible();
    }

    async verifyFirstNameError(msg: string | RegExp) {
        await expect(this.firstNameError).toContainText(msg);
    }

    async verifyLastNameError(msg: string | RegExp) {
        await expect(this.lastNameError).toContainText(msg);
    }

    async verifyEmailError(msg: string | RegExp) {
        await expect(this.emailError).toContainText(msg);
    }

    async verifySummaryError(msg: string | RegExp) {
        await expect(this.summaryError).toContainText(msg);
    }

    // ===== Address methods =====
    async clickAddNewAddress() {
        await this.addNewAddressButton.click();
    }

    async fillAddress(data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        country?: string;
        stateProvince?: string;
        city?: string;
        address1?: string;
        zip?: string;
        phone?: string;
    }) {
        if (data.firstName !== undefined) await this.addressFirstName.fill(data.firstName);
        if (data.lastName !== undefined) await this.addressLastName.fill(data.lastName);
        if (data.email !== undefined) await this.addressEmail.fill(data.email);

        if (data.country !== undefined) {
            if (data.country === "") {
                await this.addressCountry.selectOption({ index: 0 });
            } else {
                await this.addressCountry.selectOption({ label: data.country });
            }
            await expect(this.addressCountry).toBeVisible();
        }

        if (data.stateProvince && data.country) {
            await this.addressStateProvince.selectOption({ label: data.stateProvince });
        }

        if (data.city !== undefined) await this.addressCity.fill(data.city);
        if (data.address1 !== undefined) await this.addressAddress1.fill(data.address1);
        if (data.zip !== undefined) await this.addressZip.fill(data.zip);
        if (data.phone !== undefined) await this.addressPhone.fill(data.phone);
    }

    async clickSaveAddress() {
        await this.saveAddressButton.click();
    }

    async fillAddressFirstNameWithSpaces() {
        await expect(this.addressFirstName).toBeVisible();
        await expect(this.addressFirstName).toBeEditable();

        await this.addressFirstName.fill("");

        await this.addressFirstName.pressSequentially("   ", { delay: 100 });

        await expect(this.addressFirstName).toHaveValue("   ");

        await this.addressFirstName.blur();
    }
}