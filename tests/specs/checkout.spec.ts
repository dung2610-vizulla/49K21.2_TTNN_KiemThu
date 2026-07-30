import { test, expect, type Page } from '@playwright/test';
import { CheckoutPage, VALID_BILLING_ADDRESS, VALID_CREDIT_CARD } from '../../pages/CheckoutPage';
 
async function loginBeforeCart(page: Page) {
    const email = process.env.NOP_EMAIL || 'dunghoang@gmail.com';
    const password = process.env.NOP_PASSWORD || '123456';
 
    await page.goto('https://demo.nopcommerce.com/login');
    await page.locator('#Email').fill(email);
    await page.locator('#Password').fill(password);
    await page.locator("button[class='button-1 login-button']").click();
 
    await page.waitForLoadState('networkidle');
}
 
test.beforeEach(async ({ page }) => {
    await loginBeforeCart(page);
});
 
// NOTE: Navigation to the product (Home -> Computers -> Notebooks -> Asus Laptop -> Cart)
// belongs conceptually to HomePage / ProductPage / ShoppingCartPage, which already exist
// in the project. Once you share those files this helper can be trimmed down to call them
// directly instead of raw locators. `proceedToCheckoutFromCart()` (the part that's actually
// "Checkout") already lives on CheckoutPage.
async function addLaptopToCheckout(page: Page) {
    const checkoutPage = new CheckoutPage(page);
 
    await page.locator(".menu__link[href='/computers']").click();
    await page.locator("h2[class='title'] a[title='Show products in category Notebooks']").click();
    await page.click("//h2[@class='product-title']//a[normalize-space()='Asus Laptop']");
 
    await page.locator("//input[@id='product_enteredQuantity_5']").fill("3");
    await page.locator("//button[@id='add-to-cart-button-5']").click();
    await page.waitForTimeout(5000);
    await checkoutPage.proceedToCheckoutFromCart();
}
 
/** Fills and saves a valid new billing address (used as setup for tests that assume an address already exists). */
async function exitAddress(checkoutPage: CheckoutPage) {
    await checkoutPage.submitNewBillingAddress(VALID_BILLING_ADDRESS);
}
 
// ===================== NEW BILLING ADDRESS =====================
 
test('Checkout-001 - Confirm Billing address successful when no address exists ', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddress(VALID_BILLING_ADDRESS);
    await checkoutPage.expectShippingMethodFormVisible();
});
 
test('Checkout-002 - Confirm Billing address unsuccessful when no address exists by First name is empty ', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, firstName: '' },
        'First name is required.'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-003 - Confirm Billing address unsuccessful when no address exists by First name contains special characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, firstName: 'demo@#$%^' },
        'First name can only contain letters.'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-004 - Confirm Billing address unsuccessful when no address exists by First name contains numbers', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, firstName: 'demo12345' },
        'First name can only contain letters.'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-005 - Confirm Billing address unsuccessful when no address exists by Last name is empty ', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, lastName: '' },
        'Last name is required.'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-006 - Confirm Billing address unsuccessful when no address exists by Last name contains special characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, lastName: 'nopcommerce@#$%' },
        'Last name can only contain letters.'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-007 - Confirm Billing address unsuccessful when no address exists by Last name contains numbers', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, lastName: 'nopcommerce123' },
        'Last name can only contain letters.'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-008 - Confirm Billing address unsuccessful when no address exists by Email is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await page.waitForTimeout(1000);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, email: '' },
        'Email is required.'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-009 - Confirm Billing address unsuccessful when no address exists by Email is not in corect format @', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, email: 'dunghoanggmail.com' },
        'Wrong email'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
    await checkoutPage.expectEmailErrorText('Please enter a valid email address.');
});
 
test('Checkout-010 - Confirm Billing address unsuccessful when no address exists by Email is not in corect format ".com', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, email: 'dunghoang@gmail' },
        'Wrong email'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
    await checkoutPage.expectEmailErrorText('Wrong email');
});
 
test('Checkout-011 - Confirm Billing address unsuccessful when no address exists by Email contains spaces', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, email: 'dung hoang@gmail.com' },
        'Wrong email'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
    await checkoutPage.expectEmailErrorText('Please enter a valid email address.');
});
 
test('Checkout-012 - Confirm Billing address unsuccessful when no address exists by Email contains invalid characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    // No alert fires for this case in the original test — the client-side validator
    // blocks submission silently and only the inline error text appears.
    await checkoutPage.fillBillingAddress({ ...VALID_BILLING_ADDRESS, email: '#$dunghoang@gmail.com' });
 
    await checkoutPage.expectShippingMethodFormHidden();
    await checkoutPage.expectEmailErrorText('Please enter a valid email address.');
});
 
test('Checkout-013 - Confirm Billing address unsuccessful when no address exists by Country not yet selected', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        {
            firstName: VALID_BILLING_ADDRESS.firstName,
            lastName: VALID_BILLING_ADDRESS.lastName,
            email: VALID_BILLING_ADDRESS.email,
            country: 'Select country', // reset back to "not selected"
            city: VALID_BILLING_ADDRESS.city,
            address1: VALID_BILLING_ADDRESS.address1,
            zipCode: VALID_BILLING_ADDRESS.zipCode,
            phone: VALID_BILLING_ADDRESS.phone,
            // state intentionally omitted — never becomes visible/selectable here
        },
        'Country is required.'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-014 - Confirm Billing address unsuccessful when no address exists by State/ province not yet selected', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        {
            firstName: VALID_BILLING_ADDRESS.firstName,
            lastName: VALID_BILLING_ADDRESS.lastName,
            email: VALID_BILLING_ADDRESS.email,
            country: VALID_BILLING_ADDRESS.country,
            city: VALID_BILLING_ADDRESS.city,
            address1: VALID_BILLING_ADDRESS.address1,
            zipCode: VALID_BILLING_ADDRESS.zipCode,
            phone: VALID_BILLING_ADDRESS.phone,
            // state intentionally omitted — left as "not selected"
        },
        'State / province is required.'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-015 - Confirm Billing address unsuccessful when no address exists by City is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, city: '' },
        'City is required'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-016 - Confirm Billing address unsuccessful when no address exists by City contains special characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, city: '@#$% Da Nang' },
        'Please enter a valid City'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-017 - Confirm Billing address unsuccessful when no address exists by City contains numbers', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, city: 'Da Nang 123' },
        'Please enter a valid City'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-018 - Confirm Billing address unsuccessful when no address exists by Address is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, address1: '' },
        'Street address is required'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-019 - Confirm Billing address unsuccessful when no address exists by Address contains special characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, address1: '71 Ngu Hanh Son &^%$' },
        'Please enter a valid Address 1'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-020 - Confirm Billing address unsuccessful when no address exists by Zip/postal code is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, zipCode: '' },
        'Zip / postal code is required'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-021 - Confirm Billing address unsuccessful when no address exists by Zip/postal code contains special characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, zipCode: '50000 &^%$' },
        'Please enter a valid Zip / Total code'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-022 - Confirm Billing address unsuccessful when no address exists by Phone number is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, phone: '' },
        'Phone is required'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-023 - Confirm Billing address unsuccessful when no address exists by Phone number contains special characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, phone: '0932500789&$$*' },
        'Please enter a valid Phone number'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-024 - Confirm Billing address unsuccessful when no address exists by Phone number contains letters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await checkoutPage.submitNewBillingAddressExpectingAlert(
        { ...VALID_BILLING_ADDRESS, phone: '0932500789demo' },
        'Please enter a valid Phone number'
    );
 
    await checkoutPage.expectShippingMethodFormHidden();
});
 
// ===================== EDIT EXISTING BILLING ADDRESS =====================
 
test('Checkout-025 - Edit Billing address successful when address exists', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickEditBillingAddress();
 
    await checkoutPage.fillBillingAddress({ firstName: 'dung' });
    await page.waitForTimeout(2000);
    await checkoutPage.clickSaveEditedBillingAddress();
 
    await checkoutPage.expectBillingAddressSelectedContains('dung');
});
 
test('Checkout-026 - Edit Billing address unsuccessful when address exists by First name is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickEditBillingAddress();
 
    await checkoutPage.fillBillingAddress({ firstName: '' });
    await page.waitForTimeout(1000);
    await checkoutPage.clickSaveEditedBillingAddressExpectingAlert('First name is required.');
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-027 - Edit Billing address unsuccessful when address exists by Last name is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickEditBillingAddress();
 
    await checkoutPage.fillBillingAddress({ lastName: '' });
    await page.waitForTimeout(1000);
    await checkoutPage.clickSaveEditedBillingAddressExpectingAlert('Last name is required.');
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-028 - Edit Billing address unsuccessful when address exists by Email is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickEditBillingAddress();
 
    await checkoutPage.fillBillingAddress({ email: '' });
    await page.waitForTimeout(1000);
    await checkoutPage.clickSaveEditedBillingAddressExpectingAlert('Email is required.');
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-029 - Edit Billing address unsuccessful when address exists by Country not yet selected', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickEditBillingAddress();
 
    await checkoutPage.fillBillingAddress({ country: 'Select country' });
    await checkoutPage.clickSaveEditedBillingAddressExpectingAlert('Country is required.');
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-030 - Edit Billing address unsuccessful when address exists by State/ province not yet selected', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickEditBillingAddress();
 
    await checkoutPage.fillBillingAddress({ state: 'Select state' });
    await checkoutPage.clickSaveEditedBillingAddressExpectingAlert('State / province is required.');
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-031 - Edit Billing address unsuccessful when address exists by City is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickEditBillingAddress();
 
    await checkoutPage.fillBillingAddress({ city: '' });
    await checkoutPage.clickSaveEditedBillingAddressExpectingAlert('City is required');
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-032 - Edit Billing address unsuccessful when address exists by Address is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickEditBillingAddress();
 
    await checkoutPage.fillBillingAddress({ address1: '' });
    await checkoutPage.clickSaveEditedBillingAddressExpectingAlert('Street address is required');
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-033 - Edit Billing address unsuccessful when address exists by Zip/postal code is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickEditBillingAddress();
 
    await checkoutPage.fillBillingAddress({ zipCode: '' });
    await checkoutPage.clickSaveEditedBillingAddressExpectingAlert('Zip / postal code is required');
    await checkoutPage.expectShippingMethodFormHidden();
});
 
test('Checkout-034 - Edit Billing address unsuccessful when address exists by Phone number is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickEditBillingAddress();
 
    await checkoutPage.fillBillingAddress({ phone: '' });
    await checkoutPage.clickSaveEditedBillingAddressExpectingAlert('Phone is required');
    await checkoutPage.expectShippingMethodFormHidden();
});
 
// ===================== DELETE =====================
 
test('Checkout-035 - Delete Billing address when address exists', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.clickDeleteBillingAddress();
    await page.waitForTimeout(2000);
 
    await checkoutPage.expectBillingFormFieldsCleared();
});
 
// ===================== SHIPPING ADDRESS DIFFERENT FROM BILLING =====================
 
test('Checkout-036 - Create Shipping address different Billing address', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
 
    await checkoutPage.selectExistingBillingAddress('New Address');
    await checkoutPage.submitNewBillingAddress({
        firstName: 'new',
        lastName: 'address',
        email: 'dung@gmail.com',
        country: 'Vietnam',
        state: 'Hà Nội',
        city: 'Da Nang',
        address1: '71 Ngu Hanh Son',
        zipCode: '50000',
        phone: '0932500789',
    });
 
    await checkoutPage.expectShippingMethodFormVisible();
});
 
// ===================== SHIPPING METHOD / CONFIRM ORDER =====================
 
test('Checkout-037 - Confirm order successful', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.completeCheckoutWithDefaultShipping();
    await page.waitForTimeout(2000);
 
    await checkoutPage.expectOrderPlacedSuccessfully();
});
 
// ===================== PAYMENT INFORMATION (CREDIT CARD) =====================
 
test('Checkout-038 - Confirm Payment Information successfully By Credit Card', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.clickShippingMethodNextStep();
    await checkoutPage.selectCreditCardPaymentMethod();
    await checkoutPage.clickPaymentMethodNextStep();
 
    await checkoutPage.fillCreditCardInfo(VALID_CREDIT_CARD);
    await page.waitForTimeout(2000);
    await checkoutPage.clickPaymentInfoNextStep();
    await checkoutPage.clickConfirmOrderNextStep();
    
 
    await checkoutPage.expectOrderPlacedSuccessfully();
});
 
test('Checkout-039 - Confirm Payment Information unsuccessfully By Cardholder name is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.clickShippingMethodNextStep();
    await checkoutPage.selectCreditCardPaymentMethod();
    await checkoutPage.clickPaymentMethodNextStep();
 
    await checkoutPage.fillCreditCardInfo({ ...VALID_CREDIT_CARD, cardholderName: '' });
 
    await checkoutPage.clickPaymentInfoNextStep();
    await page.waitForTimeout(2000);
 
    await checkoutPage.expectValidationError('Enter cardholder name');
});
 
test('Checkout-040 - Confirm Payment Information unsuccessfully By Card number is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.clickShippingMethodNextStep();
    await checkoutPage.selectCreditCardPaymentMethod();
    await checkoutPage.clickPaymentMethodNextStep();
 
    await checkoutPage.fillCreditCardInfo({ ...VALID_CREDIT_CARD, cardNumber: '' });
 
    await checkoutPage.clickPaymentInfoNextStep();
    await page.waitForTimeout(2000);
 
    await checkoutPage.expectValidationError('Wrong card number');
});
 
test('Checkout-041 - Confirm Payment Information unsuccessfully By Card number contains characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.clickShippingMethodNextStep();
    await checkoutPage.selectCreditCardPaymentMethod();
    await checkoutPage.clickPaymentMethodNextStep();
 
    await checkoutPage.fillCreditCardInfo({ ...VALID_CREDIT_CARD, cardNumber: '4111 1111 1111 1111demo' });
 
    await checkoutPage.clickPaymentInfoNextStep();
    await page.waitForTimeout(2000);
 
    await checkoutPage.expectValidationError('Wrong card number');
});
 
test('Checkout-042 - Confirm Payment Information unsuccessfully By Card number contains special characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.clickShippingMethodNextStep();
    await checkoutPage.selectCreditCardPaymentMethod();
    await checkoutPage.clickPaymentMethodNextStep();
 
    await checkoutPage.fillCreditCardInfo({ ...VALID_CREDIT_CARD, cardNumber: '4111 1111 1111 1111@$%' });
 
    await checkoutPage.clickPaymentInfoNextStep();
    await page.waitForTimeout(2000);
 
    await checkoutPage.expectValidationError('Wrong card number');
});
 
test('Checkout-043 - Confirm Payment Information unsuccessfully By Expiration date prior to the current date', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.clickShippingMethodNextStep();
    await checkoutPage.selectCreditCardPaymentMethod();
    await checkoutPage.clickPaymentMethodNextStep();
 
    await checkoutPage.fillCreditCardInfo({ ...VALID_CREDIT_CARD, expireYear: '2026' });
 
    await checkoutPage.clickPaymentInfoNextStep();
    await page.waitForTimeout(2000);
 
    await checkoutPage.expectValidationError('Card is expired');
});
 
test('Checkout-044 - Confirm Payment Information unsuccessfully By Card code is empty', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.clickShippingMethodNextStep();
    await checkoutPage.selectCreditCardPaymentMethod();
    await checkoutPage.clickPaymentMethodNextStep();
 
    await checkoutPage.fillCreditCardInfo({ ...VALID_CREDIT_CARD, cardCode: '' });
 
    await checkoutPage.clickPaymentInfoNextStep();
    //await page.waitForTimeout(2000);
 
    await checkoutPage.expectValidationError('Wrong card code');
});
 
test('Checkout-045 - Confirm Payment Information unsuccessfully By Card code contains characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.clickShippingMethodNextStep();
    await checkoutPage.selectCreditCardPaymentMethod();
    await checkoutPage.clickPaymentMethodNextStep();
 
    await checkoutPage.fillCreditCardInfo({ ...VALID_CREDIT_CARD, cardCode: '123demo' });
 
    await checkoutPage.clickPaymentInfoNextStep();
    await page.waitForTimeout(2000);
 
    await checkoutPage.expectValidationError('Wrong card code');
});
 
test('Checkout-046 - Confirm Payment Information unsuccessfully By Card code contains special characters', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.clickShippingMethodNextStep();
    await checkoutPage.selectCreditCardPaymentMethod();
    await checkoutPage.clickPaymentMethodNextStep();
 
    await checkoutPage.fillCreditCardInfo({ ...VALID_CREDIT_CARD, cardCode: '123$%' });
 
    await checkoutPage.clickPaymentInfoNextStep();
    await page.waitForTimeout(2000);
 
    await checkoutPage.expectValidationError('Wrong card code');
});
 
// ===================== ORDER RATE LIMIT / RE-CHECKOUT =====================
 
test('Checkout-047 - Verify that an additional order within a limited timeframe after a successful order placement', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.completeCheckoutWithDefaultShipping();
 
    // Place a second order right away and expect it to be blocked.
    await addLaptopToCheckout(page);
    await checkoutPage.clickShippingMethodNextStep();
    await checkoutPage.clickPaymentMethodNextStep();
    await page.waitForTimeout(2000);
    await checkoutPage.clickPaymentInfoNextStep();
 
    await checkoutPage.clickConfirmOrderExpectingAlert(
        'Please wait several seconds before placing a new order (already placed another order several seconds ago).'
    );
});
 
test('Checkout-048 - Confirm Billing address successful when address exists', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
 
    await addLaptopToCheckout(page);
    await exitAddress(checkoutPage);
 
    await checkoutPage.proceedToCheckoutFromCart();
    await checkoutPage.completeCheckoutWithDefaultShipping();
 
    await checkoutPage.expectOrderPlacedSuccessfully();
});