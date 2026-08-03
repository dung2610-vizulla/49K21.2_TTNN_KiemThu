import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePages";
 
export interface BillingAddressData {
    firstName?: string;
    lastName?: string;
    email?: string;
    /** Pass a value (including "Select country") to touch the dropdown, or omit to leave it untouched */
    country?: string;
    /** Pass a value (including "Select state") to touch the dropdown, or omit to leave it untouched */
    state?: string;
    city?: string;
    address1?: string;
    zipCode?: string;
    phone?: string;
}
 
export interface CreditCardData {
    cardType?: string;
    cardholderName?: string;
    cardNumber?: string;
    expireMonth?: string;
    expireYear?: string;
    cardCode?: string;
}
 
// Default "happy path" data — reused across tests, override only the fields under test
export const VALID_BILLING_ADDRESS: Required<BillingAddressData> = {
    firstName: "demo",
    lastName: "nopcommerce",
    email: "dunghoang@gmail.com",
    country: "Vietnam",
    state: "Đà Nẵng",
    city: "Da Nang",
    address1: "71 Ngu Hanh Son",
    zipCode: "50000",
    phone: "0932500789",
};
 
export const VALID_CREDIT_CARD: Required<CreditCardData> = {
    cardType: "Visa",
    cardholderName: "Hoang Phuong Nghi",
    cardNumber: "4111 1111 1111 1111",
    expireMonth: "1",
    expireYear: "2028",
    cardCode: "123",
};
 
export class CheckoutPage extends BasePage {
 
    constructor(page: Page) {
        super(page);
    }
 
    // ---------- Locators ----------
 
    // Cart -> checkout entry
    get cartLabel() { return this.page.locator(".cart-label"); }
    get termsOfServiceCheckbox() { return this.page.locator("//input[@id='termsofservice']"); }
    get checkoutButton() { return this.page.locator("//button[@id='checkout']"); }
 
    // Billing address (new address form)
    get billingFirstNameInput() { return this.page.locator("//input[@id='BillingNewAddress_FirstName']"); }
    get billingLastNameInput() { return this.page.locator("//input[@id='BillingNewAddress_LastName']"); }
    get billingEmailInput() { return this.page.locator("//input[@id='BillingNewAddress_Email']"); }
    get billingEmailErrorText() { return this.page.locator("#BillingNewAddress_Email-error"); }
    get billingCountrySelect() { return this.page.locator("//select[@id='BillingNewAddress_CountryId']"); }
    get billingStateSelect() { return this.page.locator("//select[@id='BillingNewAddress_StateProvinceId']"); }
    get billingCityInput() { return this.page.locator("//input[@id='BillingNewAddress_City']"); }
    get billingAddress1Input() { return this.page.locator("//input[@id='BillingNewAddress_Address1']"); }
    get billingZipInput() { return this.page.locator("//input[@id='BillingNewAddress_ZipPostalCode']"); }
    get billingPhoneInput() { return this.page.locator("//input[@id='BillingNewAddress_PhoneNumber']"); }
    get billingSaveNewAddressButton() { return this.page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']"); }
 
    // Billing address (existing address flow)
    get billingAddressSelect() { return this.page.locator("//select[@id='billing-address-select']"); }
    get billingAddressSelectedOption() { return this.page.locator("#billing-address-select option:checked"); }
    get editBillingAddressButton() { return this.page.locator("//button[@id='edit-billing-address-button']"); }
    get saveEditedBillingAddressButton() { return this.page.locator("(//button[@id='save-billing-address-button'])[1]"); }
    get deleteBillingAddressButton() { return this.page.locator("//button[@id='delete-billing-address-button']"); }
    get billingAddressMethodStepButton(){return this.page.locator('button.button-1.shipping-method-next-step-button'); }

    // Shipping method step
    get shippingMethodForm() { return this.page.locator("//form[@id='co-shipping-method-form']"); }
    get shippingMethodNextStepButton() { return this.page.locator("//button[@class='button-1 shipping-method-next-step-button']"); }
 
    // Payment method step
    get creditCardPaymentLabel() { return this.page.locator("//input[@id='paymentmethod_1']"); }
    get paymentMethodNextStepButton() { return this.page.locator('button[class="button-1 payment-method-next-step-button"]'); }
 
    // Payment info step
    get creditCardTypeSelect() { return this.page.locator(" //select[@id='CreditCardType']"); }
    get cardholderNameInput() { return this.page.locator("//input[@id='CardholderName']"); }
    get cardNumberInput() { return this.page.locator("//input[@id='CardNumber']"); }
    get expireMonthSelect() { return this.page.locator("//select[@id='ExpireMonth']"); }
    get expireYearSelect() { return this.page.locator("//select[@id='ExpireYear']"); }
    get cardCodeInput() { return this.page.locator("//input[@id='CardCode']"); }
    get paymentInfoNextStepButton() { return this.page.locator("//button[@class='button-1 payment-info-next-step-button']"); }
 
    // Confirm order step
    get confirmOrderNextStepButton() { return this.page.locator("//button[normalize-space()='Confirm']"); }
    get orderSuccessHeading() { return this.page.locator("//h2[normalize-space()='Your order has been successfully processed!']"); }
 
    // Shared validation error box (payment info step)
    get validationErrorMessage() { return this.page.locator("div[class='message-error validation-summary-errors'] ul li"); }
 
    // ---------- Cart / entry actions ----------
 
    async proceedToCheckoutFromCart() {
        await this.clickElement(this.cartLabel, "Cart label");
        await this.checkElement(this.termsOfServiceCheckbox, "Terms of service checkbox");
        await this.clickElement(this.checkoutButton, "Checkout button");
    }
 
    // ---------- Billing address (new address) ----------
 
    /**
     * Fills only the fields present in `data`. Fields omitted are left untouched,
     * which lets tests reproduce edge cases like "country not yet selected".
     */
    async fillBillingAddress(data: BillingAddressData = {}) {
        if (data.firstName !== undefined) {
            await this.inputText(this.billingFirstNameInput, data.firstName, "Billing First Name");
            await expect(this.billingFirstNameInput).toHaveValue(data.firstName);
}
        if (data.lastName !== undefined) {
            await this.inputText(this.billingLastNameInput, data.lastName, "Billing Last Name");
            //await expect(this.billingFirstNameInput).toHaveValue(data.lastName);
        }
        if (data.email !== undefined) {
            await this.inputText(this.billingEmailInput, data.email, "Billing Email");
        }
        if (data.country !== undefined) {
            await this.waitFor(this.billingCountrySelect);
            await this.page.waitForTimeout(1000);
            await this.billingCountrySelect.scrollIntoViewIfNeeded();
            await this.selectOption(this.billingCountrySelect, data.country, "Billing Country");
            await this.page.waitForTimeout(1000);
        }
        if (data.state !== undefined) {
            await this.waitFor(this.billingStateSelect);
            await this.page.waitForTimeout(1000);
            await this.billingStateSelect.scrollIntoViewIfNeeded();
            await this.selectOption(this.billingStateSelect, data.state, "Billing State/Province");
            await this.page.waitForTimeout(1000);
        }
        if (data.city !== undefined) {
            await this.inputText(this.billingCityInput, data.city, "Billing City");
        }
        if (data.address1 !== undefined) {
            await this.inputText(this.billingAddress1Input, data.address1, "Billing Address 1");
        }
        if (data.zipCode !== undefined) {
            await this.inputText(this.billingZipInput, data.zipCode, "Billing Zip/Postal Code");
        }
        if (data.phone !== undefined) {
            await this.inputText(this.billingPhoneInput, data.phone, "Billing Phone Number");
        }
        //await this.page.waitForTimeout(1000);
    }
 
    async clickSaveNewBillingAddress() {
        await this.clickElement(this.billingSaveNewAddressButton, "Save new billing address button");
    }
 
    /** Fills the form and saves it — happy-path flow expecting the shipping form to appear. */
    async submitNewBillingAddress(data: BillingAddressData = {}) {
        await this.fillBillingAddress(data);
        await this.clickSaveNewBillingAddress();
        await expect(this.shippingMethodNextStepButton).toBeEnabled();
    }
 
    async expectAlertOnSave(saveAction: () => Promise<void>, expectedMessage: string) {
        const dialogPromise = this.page.waitForEvent("dialog");
        await saveAction();
        const dialog = await dialogPromise;
        expect(dialog.type()).toBe("alert");
        expect(dialog.message()).toBe(expectedMessage);
        await dialog.accept();
    }

    /**
     * Fills the form, clicks save, and asserts the resulting native `alert` dialog
     * (nopCommerce's client-side validation) matches `expectedMessage`.
     */
    async submitNewBillingAddressExpectingAlert(data: BillingAddressData, expectedMessage: string) {
        await this.fillBillingAddress(data);
        await this.expectAlertOnSave(() => this.clickSaveNewBillingAddress(), expectedMessage);
    }

    async clickSaveEditedBillingAddressExpectingAlert(expectedMessage: string) {
        await this.expectAlertOnSave(() => this.clickSaveEditedBillingAddress(), expectedMessage);
    }
 
    // ---------- Billing address (existing address: select / edit / delete) ----------
 
    async selectExistingBillingAddress(value: string) {
        await this.waitFor(this.billingAddressSelect);
       // await this.page.waitForTimeout(1000);
        await this.billingAddressSelect.scrollIntoViewIfNeeded();
        await this.selectOption(this.billingAddressSelect, value, "Billing address select");
        await this.page.waitForTimeout(1000);
    }

 
    async clickEditBillingAddress() {
        await this.clickElement(this.editBillingAddressButton, "Edit billing address button");
    }
 
    async clickSaveEditedBillingAddress() {
        await this.clickElement(this.saveEditedBillingAddressButton, "Save edited billing address button");
    }
 
    async clickDeleteBillingAddress() {
        await this.clickElement(this.deleteBillingAddressButton, "Delete billing address button");
    }
    //-----------Billing address method step -----------

    async clickBilillingMethodStep(){
        await this.clickElement(this.billingAddressMethodStepButton, "Billing method next step button")
    }
 
    // ---------- Shipping method step ----------
 
    async clickShippingMethodNextStep() {
        await this.clickElement(this.shippingMethodNextStepButton, "Shipping method next step button");
    }
 
    // ---------- Payment method step ----------
 
    async selectCreditCardPaymentMethod() {
        await this.checkElement(this.creditCardPaymentLabel, "Credit Card payment method");
    }
 
    async clickPaymentMethodNextStep() {
        await this.clickElement(this.paymentMethodNextStepButton, "Payment method next step button");
    }
 
    // ---------- Payment info step ----------
 
    async fillCreditCardInfo(data: CreditCardData = {}) {
        if (data.cardType !== undefined) {
            await this.waitFor(this.creditCardTypeSelect);
           // await this.page.waitForTimeout(1000);
            await this.creditCardTypeSelect.scrollIntoViewIfNeeded();
            await this.selectOption(this.creditCardTypeSelect, data.cardType, "Credit card type");
            //await this.page.waitForTimeout(1000);
        }
        if (data.cardholderName !== undefined) {
            await this.inputText(this.cardholderNameInput, data.cardholderName, "Cardholder name");
        }
        if (data.cardNumber !== undefined) {
            await this.inputText(this.cardNumberInput, data.cardNumber, "Card number");
        }
        if (data.expireMonth !== undefined) {
            await this.waitFor(this.expireMonthSelect);
            await this.page.waitForTimeout(1000);
            await this.expireMonthSelect.scrollIntoViewIfNeeded();
            await this.selectOption(this.expireMonthSelect, data.expireMonth, "Expire month");
            //await this.page.waitForTimeout(1000);
        }
        if (data.expireYear !== undefined) {
            await this.waitFor(this.expireYearSelect);
            //await this.page.waitForTimeout(1000);
            await this.expireYearSelect.scrollIntoViewIfNeeded();
            await this.selectOption(this.expireYearSelect, data.expireYear, "Expire year");
            //await this.page.waitForTimeout(1000);
        }
        if (data.cardCode !== undefined) {
            await this.inputText(this.cardCodeInput, data.cardCode, "Card code (CVV)");
        }
    }
 
    async clickPaymentInfoNextStep() {
        await this.clickElement(this.paymentInfoNextStepButton, "Payment info next step button");
    }
 
    // ---------- Confirm order step ----------
 
    async clickConfirmOrderNextStep() {
        await this.clickElement(this.confirmOrderNextStepButton, "Confirm order next step button");
    }
 
    async clickConfirmOrderExpectingAlert(expectedMessage: string) {
        const dialogPromise = this.page.waitForEvent("dialog");
        await this.clickConfirmOrderNextStep();
        const dialog = await dialogPromise;
        expect(dialog.type()).toBe("alert");
        expect(dialog.message()).toBe(expectedMessage);
        await dialog.accept();
    }
 
    // ---------- Convenience end-to-end flows ----------
 
    /** Goes through shipping method + payment method(free choice) + payment info + confirm order using defaults. */
    // async completeCheckoutWithDefaultShipping() {
    //     await this.clickBilillingMethodStep();
        
    //     await this.clickShippingMethodNextStep();
       
    //     await this.page.waitForTimeout(1000);
    //     await this.clickPaymentMethodNextStep();
        
    //     await this.clickPaymentInfoNextStep();
        
    //     await this.clickConfirmOrderNextStep();
    // }
 
    /** Goes through shipping method + Credit Card payment + card info + confirm order. */
    async completeCheckoutWithCreditCard(cardData: CreditCardData = VALID_CREDIT_CARD) {
        await this.clickShippingMethodNextStep();
        await this.selectCreditCardPaymentMethod();
        await this.clickPaymentMethodNextStep();
        await this.fillCreditCardInfo(cardData);
        await this.clickPaymentInfoNextStep();
        await this.clickConfirmOrderNextStep();
    }
 
    // ---------- Assertions ----------
 
    async expectShippingMethodFormVisible() {
        await expect(this.shippingMethodForm).toBeVisible();
    }
 
    async expectShippingMethodFormHidden() {
        await expect(this.shippingMethodForm).not.toBeVisible();
    }
 
    async expectEmailErrorText(message: string) {
        await expect(this.billingEmailErrorText).toContainText(message);
    }
 
    async expectBillingAddressSelectedContains(text: string) {
        await expect(this.billingAddressSelectedOption).toContainText(text);
    }
 
    async expectBillingFormFieldsCleared() {
        await expect(this.billingCityInput).toHaveValue("");
        await expect(this.billingAddress1Input).toHaveValue("");
        await expect(this.billingZipInput).toHaveValue("");
        await expect(this.billingPhoneInput).toHaveValue("");
    }
 
    async expectOrderPlacedSuccessfully() {
        await expect(this.orderSuccessHeading).toContainText("Your order has been successfully processed!");
    }
 
    async expectValidationError(message: string) {
        await expect(this.validationErrorMessage).toContainText(message);
    }
}
 