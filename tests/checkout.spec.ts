import { test, expect, type Page } from '@playwright/test';
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

async function addLaptopToCheckout(page: Page) {
    await page.goto("https://demo.nopcommerce.com/");

    await page.locator(".menu__link[href='/computers']").click();
    await page.locator("h2[class='title'] a[title='Show products in category Notebooks']").click();

    await page.click("//h2[@class='product-title']//a[normalize-space()='Asus Laptop']");

    await page.locator("#product_enteredQuantity_5").fill("1");
    await page.locator("#add-to-cart-button-5").click();

    await page.locator(".cart-label").click();

    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
}


async function exitAddress (page: Page){
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
}
test('Checkout-001 - Confirm Billing address successful when no address exists ', async ({ page }) => {

    await addLaptopToCheckout(page);

    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
     // Expected result
    await expect(page.locator("#co-shipping-method-form")).toBeVisible();
});

test('Checkout-002 - Confirm Billing address unsuccessful when no address exists by First name is empty ', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);
    
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("First name is required.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-003 - Confirm Billing address unsuccessful when no address exists by First name contains special characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo@#$%^");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);
    
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("First name can only contain letters.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-004 - Confirm Billing address unsuccessful when no address exists by First name contains numbers', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo12345");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);
    
    const dialogPromise = page.waitForEvent("dialog");
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("First name can only contain letters.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-005 - Confirm Billing address unsuccessful when no address exists by Last name is empty ', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);
    
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Last name is required.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-006 - Confirm Billing address unsuccessful when no address exists by Last name contains special characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce@#$%");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);
    
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Last name can only contain letters.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-007 - Confirm Billing address unsuccessful when no address exists by Last name contains numbers', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce123");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);
    
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Last name can only contain letters.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-008 - Confirm Billing address unsuccessful when no address exists by Email is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);
    
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Email is required.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-009 - Confirm Billing address unsuccessful when no address exists by Email is not in corect format @', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoanggmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);
    
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Wrong email");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();

    await expect(page.locator("#BillingNewAddress_Email-error")).toContainText("Please enter a valid email address.");
});

test('Checkout-010 - Confirm Billing address unsuccessful when no address exists by Email is not in corect format ".com', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);
    
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Wrong email");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();

    await expect(page.locator("#BillingNewAddress_Email-error")).toContainText("Wrong email");
});

test('Checkout-011 - Confirm Billing address unsuccessful when no address exists by Email contains spaces', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dung hoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);
    
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Wrong email");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();

    await expect(page.locator("#BillingNewAddress_Email-error")).toContainText("Please enter a valid email address.");
});

test('Checkout-012 - Confirm Billing address unsuccessful when no address exists by Email contains invalid characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("#$dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();

    await expect(page.locator("#BillingNewAddress_Email-error")).toContainText("Please enter a valid email address.");
});

test('Checkout-013 - Confirm Billing address unsuccessful when no address exists by Country not yet selected', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Select country");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

     //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Country is required.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
  
});

test('Checkout-014 - Confirm Billing address unsuccessful when no address exists by State/ province not yet selected', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("State / province is required.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-015 - Confirm Billing address unsuccessful when no address exists by City is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("City is required");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-016 - Confirm Billing address unsuccessful when no address exists by City contains special characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("@#$% Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Please enter a valid City");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-017 - Confirm Billing address unsuccessful when no address exists by City contains numbers', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang 123");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Please enter a valid City");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-018 - Confirm Billing address unsuccessful when no address exists by Address is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Street address is required");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-019 - Confirm Billing address unsuccessful when no address exists by Address contains special characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son &^%$");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Please enter a valid Address 1");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-020 - Confirm Billing address unsuccessful when no address exists by Zip/postal code is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Zip / postal code is required");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-021 - Confirm Billing address unsuccessful when no address exists by Zip/postal code contains special characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000 &^%$");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Please enter a valid Zip / Total code");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-022 - Confirm Billing address unsuccessful when no address exists by Phone number is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Phone is required");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-023 - Confirm Billing address unsuccessful when no address exists by Phone number contains special characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789&$$*");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Please enter a valid Phone number");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-024 - Confirm Billing address unsuccessful when no address exists by Phone number contains letters', async ({ page }) => {

    await addLaptopToCheckout(page);
    
    await page.locator(" #BillingNewAddress_FirstName").fill("demo");
    await page.locator(" #BillingNewAddress_LastName").fill("nopcommerce");
    await page.locator(" #BillingNewAddress_Email").fill("dunghoang@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Đà Nẵng");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789demo");
    await page.waitForTimeout(1000);

    //Result expect
    const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Please enter a valid Phone number");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

//EDIT

test('Checkout-025 - Edit Billing address successful when address exists', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#edit-billing-address-button").click();

    await page.locator("#BillingNewAddress_FirstName").fill("dung");
    await page.waitForTimeout(2000);

    await page.locator("#save-billing-address-button").click();
    //Result expect
    await expect(page.locator("#billing-address-select option:checked")).toContainText("dung")
});

test('Checkout-026 - Edit Billing address unsuccessful when address exists by First name is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#edit-billing-address-button").click();

    await page.locator("#BillingNewAddress_FirstName").fill("");
    await page.waitForTimeout(2000);

    await page.locator("#save-billing-address-button").click();
    //Result expect
     const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("First name is required.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-027 - Edit Billing address unsuccessful when address exists by Last name is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#edit-billing-address-button").click();

    await page.locator("#BillingNewAddress_LastName").fill("");
    await page.waitForTimeout(2000);

    await page.locator("#save-billing-address-button").click();
    //Result expect
     const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Last name is required.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-028 - Edit Billing address unsuccessful when address exists by Email is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#edit-billing-address-button").click();

    await page.locator("#BillingNewAddress_Email").fill("");
    await page.waitForTimeout(2000);

    await page.locator("#save-billing-address-button").click();
    //Result expect
     const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Email is required.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-029 - Edit Billing address unsuccessful when address exists by Country not yet selected', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#edit-billing-address-button").click();

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Select country");
    await page.waitForTimeout(1000);

    await page.locator("#save-billing-address-button").click();
    //Result expect
     const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Country is required.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-030 - Edit Billing address unsuccessful when address exists by State/ province not yet selected', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#edit-billing-address-button").click();

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Select state");
    await page.waitForTimeout(1000);

    await page.locator("#save-billing-address-button").click();
    //Result expect
     const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("State / province is required.");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-031 - Edit Billing address unsuccessful when address exists by City is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#edit-billing-address-button").click();

    await page.locator("#BillingNewAddress_City").fill("");
    await page.waitForTimeout(2000);

    await page.locator("#save-billing-address-button").click();
    //Result expect
     const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("City is required");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-032 - Edit Billing address unsuccessful when address exists by Address is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#edit-billing-address-button").click();

    await page.locator("#BillingNewAddress_Address1").fill("");
    await page.waitForTimeout(2000);

    await page.locator("#save-billing-address-button").click();
    //Result expect
     const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Street address is required");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-033 - Edit Billing address unsuccessful when address exists by Zip/postal code is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#edit-billing-address-button").click();

    await page.locator("#BillingNewAddress_ZipPostalCode").fill("");
    await page.waitForTimeout(2000);

    await page.locator("#save-billing-address-button").click();
    //Result expect
     const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Zip / postal code is required");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

test('Checkout-034 - Edit Billing address unsuccessful when address exists by Phone number is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#edit-billing-address-button").click();

    await page.locator("#BillingNewAddress_PhoneNumber").fill("");
    await page.waitForTimeout(2000);

    await page.locator("#save-billing-address-button").click();
    //Result expect
     const dialogPromise = page.waitForEvent("dialog");

    // Act
    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Phone is required");
    await dialog.accept();

    await expect(page.locator("#co-shipping-method-form")).not.toBeVisible();
});

//DELETE
test('Checkout-035 - Delete Billing address when address exists', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);
    
    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();
    await page.locator("#delete-billing-address-button").click();

    await page.waitForTimeout(2000);

    //Result expect
    await expect(page.locator("#BillingNewAddress_City")).toHaveValue("");
    await expect(page.locator("#BillingNewAddress_Address1")).toHaveValue("");
    await expect(page.locator("#BillingNewAddress_ZipPostalCode")).toHaveValue("");
    await expect(page.locator("#BillingNewAddress_PhoneNumber")).toHaveValue("");
    
});

test('Checkout-036 - Create Shipping address different Billing address', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();

    await page.waitForSelector("#billing-address-select", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#billing-address-select").scrollIntoViewIfNeeded();
    await page.locator("#billing-address-select").selectOption("New Address");
    await page.waitForTimeout(1000);

    await page.locator(" #BillingNewAddress_FirstName").fill("new");
    await page.locator(" #BillingNewAddress_LastName").fill("address");
    await page.locator(" #BillingNewAddress_Email").fill("dung@gmail.com");

    await page.waitForSelector("#BillingNewAddress_CountryId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_CountryId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_CountryId").selectOption("Vietnam");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#BillingNewAddress_StateProvinceId", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#BillingNewAddress_StateProvinceId").scrollIntoViewIfNeeded();
    await page.locator("#BillingNewAddress_StateProvinceId").selectOption("Hà Nội");
    await page.waitForTimeout(1000);

    await page.locator("#BillingNewAddress_City").fill("Da Nang");
    await page.locator("#BillingNewAddress_Address1").fill("71 Ngu Hanh Son");
    await page.locator(" #BillingNewAddress_ZipPostalCode").fill("50000");
    await page.locator(" #BillingNewAddress_PhoneNumber").fill("0932500789");
    await page.waitForTimeout(1000);

    await page.locator("//button[@onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();

    //Result expect
    await expect(page.locator("#co-shipping-method-form")).toBeVisible();
});

test('Checkout-037 - Confirm order successful', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();
    await page.waitForTimeout(2000);
    await page.locator(".button-1.payment-info-next-step-button").click();

    await page.locator(".button-1.confirm-order-next-step-button").click();
    await page.waitForTimeout(2000);
    //Result expect
    await expect(page.locator("//h2[normalize-space()='Your order has been successfully processed!']")).toContainText("Your order has been successfully processed!");
});

test('Checkout-038 - Confirm Payment Information successfully By Credit Card', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();

    await page.locator("//label[normalize-space()='Credit Card']").check();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();

    await page.waitForSelector("#CreditCardType", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator(" #CreditCardType").scrollIntoViewIfNeeded();
    await page.locator(" #CreditCardType").selectOption("Visa");
    
    await page.locator("#CardholderName").fill("Hoang Phuong Nghi");
    await page.locator(" #CardNumber").fill("4111 1111 1111 1111");

    await page.waitForSelector("#ExpireMonth", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireMonth").scrollIntoViewIfNeeded();
    await page.locator("#ExpireMonth").selectOption("1");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#ExpireYear", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireYear").scrollIntoViewIfNeeded();
    await page.locator("#ExpireYear").selectOption("2028");
    await page.waitForTimeout(1000);

    await page.locator("#CardCode").fill("123");

    await page.locator(".button-1.payment-info-next-step-button").click();
    await page.locator(".button-1.confirm-order-next-step-button").click();
    await page.waitForTimeout(2000);
    //Result expect
    await expect(page.locator("//h2[normalize-space()='Your order has been successfully processed!']")).toContainText("Your order has been successfully processed!");
});

test('Checkout-039 - Confirm Payment Information unsuccessfully By Cardholder name is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();

    await page.locator("//label[normalize-space()='Credit Card']").check();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();

    await page.waitForSelector("#CreditCardType", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator(" #CreditCardType").scrollIntoViewIfNeeded();
    await page.locator(" #CreditCardType").selectOption("Visa");
    
    await page.locator("#CardholderName").fill("");
    await page.locator(" #CardNumber").fill("4111 1111 1111 1111");

    await page.waitForSelector("#ExpireMonth", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireMonth").scrollIntoViewIfNeeded();
    await page.locator("#ExpireMonth").selectOption("1");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#ExpireYear", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireYear").scrollIntoViewIfNeeded();
    await page.locator("#ExpireYear").selectOption("2028");
    await page.waitForTimeout(1000);

    await page.locator("#CardCode").fill("123");

    await page.locator(".button-1.payment-info-next-step-button").click();

    await page.waitForTimeout(2000);
    //Result expect
    await expect(page.locator("div[class='message-error validation-summary-errors'] ul li")).toContainText("Enter cardholder name");
});

test('Checkout-040 - Confirm Payment Information unsuccessfully By Card number is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();

    await page.locator("//label[normalize-space()='Credit Card']").check();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();

    await page.waitForSelector("#CreditCardType", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator(" #CreditCardType").scrollIntoViewIfNeeded();
    await page.locator(" #CreditCardType").selectOption("Visa");
    
    await page.locator("#CardholderName").fill("Hoang Phuong Nghi");
    await page.locator(" #CardNumber").fill("");

    await page.waitForSelector("#ExpireMonth", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireMonth").scrollIntoViewIfNeeded();
    await page.locator("#ExpireMonth").selectOption("1");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#ExpireYear", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireYear").scrollIntoViewIfNeeded();
    await page.locator("#ExpireYear").selectOption("2028");
    await page.waitForTimeout(1000);

    await page.locator("#CardCode").fill("123");

    await page.locator(".button-1.payment-info-next-step-button").click();
    
    await page.waitForTimeout(2000);
    //Result expect
    await expect(page.locator("div[class='message-error validation-summary-errors'] ul li")).toContainText("Wrong card number");
});

test('Checkout-041 - Confirm Payment Information unsuccessfully By Card number contains characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();

    await page.locator("//label[normalize-space()='Credit Card']").check();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();

    await page.waitForSelector("#CreditCardType", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator(" #CreditCardType").scrollIntoViewIfNeeded();
    await page.locator(" #CreditCardType").selectOption("Visa");
    
    await page.locator("#CardholderName").fill("Hoang Phuong Nghi");
    await page.locator(" #CardNumber").fill("4111 1111 1111 1111demo");

    await page.waitForSelector("#ExpireMonth", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireMonth").scrollIntoViewIfNeeded();
    await page.locator("#ExpireMonth").selectOption("1");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#ExpireYear", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireYear").scrollIntoViewIfNeeded();
    await page.locator("#ExpireYear").selectOption("2028");
    await page.waitForTimeout(1000);

    await page.locator("#CardCode").fill("123");

    await page.locator(".button-1.payment-info-next-step-button").click();
    
    await page.waitForTimeout(2000);
    //Result expect
    await expect(page.locator("div[class='message-error validation-summary-errors'] ul li")).toContainText("Wrong card number");
});

test('Checkout-042 - Confirm Payment Information unsuccessfully By Card number contains special characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();

    await page.locator("//label[normalize-space()='Credit Card']").check();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();

    await page.waitForSelector("#CreditCardType", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator(" #CreditCardType").scrollIntoViewIfNeeded();
    await page.locator(" #CreditCardType").selectOption("Visa");
    
    await page.locator("#CardholderName").fill("Hoang Phuong Nghi");
    await page.locator(" #CardNumber").fill("4111 1111 1111 1111@$%");

    await page.waitForSelector("#ExpireMonth", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireMonth").scrollIntoViewIfNeeded();
    await page.locator("#ExpireMonth").selectOption("1");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#ExpireYear", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireYear").scrollIntoViewIfNeeded();
    await page.locator("#ExpireYear").selectOption("2028");
    await page.waitForTimeout(1000);

    await page.locator("#CardCode").fill("123");

    await page.locator(".button-1.payment-info-next-step-button").click();
    
    await page.waitForTimeout(2000);
    //Result expect
    await expect(page.locator("div[class='message-error validation-summary-errors'] ul li")).toContainText("Wrong card number");
});

test('Checkout-043 - Confirm Payment Information unsuccessfully By Expiration date prior to the current date', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();

    await page.locator("//label[normalize-space()='Credit Card']").check();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();

    await page.waitForSelector("#CreditCardType", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator(" #CreditCardType").scrollIntoViewIfNeeded();
    await page.locator(" #CreditCardType").selectOption("Visa");
    
    await page.locator("#CardholderName").fill("Hoang Phuong Nghi");
    await page.locator(" #CardNumber").fill("4111 1111 1111 1111");

    await page.waitForSelector("#ExpireMonth", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireMonth").scrollIntoViewIfNeeded();
    await page.locator("#ExpireMonth").selectOption("1");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#ExpireYear", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireYear").scrollIntoViewIfNeeded();
    await page.locator("#ExpireYear").selectOption("2026");
    await page.waitForTimeout(1000);

    await page.locator("#CardCode").fill("123");

    await page.locator(".button-1.payment-info-next-step-button").click();

    await page.waitForTimeout(2000);
    //Result expect
    await expect(page.locator("div[class='message-error validation-summary-errors'] ul li")).toContainText("Card is expired");
});

test('Checkout-044 - Confirm Payment Information unsuccessfully By Card code is empty', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();

    await page.locator("//label[normalize-space()='Credit Card']").check();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();

    await page.waitForSelector("#CreditCardType", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator(" #CreditCardType").scrollIntoViewIfNeeded();
    await page.locator(" #CreditCardType").selectOption("Visa");
    
    await page.locator("#CardholderName").fill("Hoang Phuong Nghi");
    await page.locator(" #CardNumber").fill("4111 1111 1111 1111");

    await page.waitForSelector("#ExpireMonth", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireMonth").scrollIntoViewIfNeeded();
    await page.locator("#ExpireMonth").selectOption("1");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#ExpireYear", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireYear").scrollIntoViewIfNeeded();
    await page.locator("#ExpireYear").selectOption("2028");
    await page.waitForTimeout(1000);

    await page.locator("#CardCode").fill("");

    await page.locator(".button-1.payment-info-next-step-button").click();

    await page.waitForTimeout(2000);
    //Result expect
    await expect(page.locator("div[class='message-error validation-summary-errors'] ul li")).toContainText("Wrong card code");
});

test('Checkout-045 - Confirm Payment Information unsuccessfully By Card code contains characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();

    await page.locator("//label[normalize-space()='Credit Card']").check();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();

    await page.waitForSelector("#CreditCardType", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator(" #CreditCardType").scrollIntoViewIfNeeded();
    await page.locator(" #CreditCardType").selectOption("Visa");
    
    await page.locator("#CardholderName").fill("Hoang Phuong Nghi");
    await page.locator(" #CardNumber").fill("4111 1111 1111 1111");

    await page.waitForSelector("#ExpireMonth", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireMonth").scrollIntoViewIfNeeded();
    await page.locator("#ExpireMonth").selectOption("1");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#ExpireYear", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireYear").scrollIntoViewIfNeeded();
    await page.locator("#ExpireYear").selectOption("2028");
    await page.waitForTimeout(1000);

    await page.locator("#CardCode").fill("123demo");

    await page.locator(".button-1.payment-info-next-step-button").click();

    await page.waitForTimeout(2000);
    //Result expect
    await expect(page.locator("div[class='message-error validation-summary-errors'] ul li")).toContainText("Wrong card code");
});

test('Checkout-046 - Confirm Payment Information unsuccessfully By Card code contains special characters', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();

    await page.locator("//label[normalize-space()='Credit Card']").check();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();

    await page.waitForSelector("#CreditCardType", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator(" #CreditCardType").scrollIntoViewIfNeeded();
    await page.locator(" #CreditCardType").selectOption("Visa");
    
    await page.locator("#CardholderName").fill("Hoang Phuong Nghi");
    await page.locator(" #CardNumber").fill("4111 1111 1111 1111");

    await page.waitForSelector("#ExpireMonth", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireMonth").scrollIntoViewIfNeeded();
    await page.locator("#ExpireMonth").selectOption("1");
    await page.waitForTimeout(1000);

    await page.waitForSelector("#ExpireYear", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#ExpireYear").scrollIntoViewIfNeeded();
    await page.locator("#ExpireYear").selectOption("2028");
    await page.waitForTimeout(1000);

    await page.locator("#CardCode").fill("123$%");

    await page.locator(".button-1.payment-info-next-step-button").click();

    await page.waitForTimeout(2000);
    //Result expect
    await expect(page.locator("div[class='message-error validation-summary-errors'] ul li")).toContainText("Wrong card code");
});

test('Checkout-047 - Verify that an additional order within a limited timeframe after a successful order placement', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();
    await page.waitForTimeout(2000);

    await page.locator(".button-1.payment-info-next-step-button").click();
    await page.locator(".button-1.confirm-order-next-step-button").click();

    await page.locator(".menu__link[href='/computers']").click();
    await page.locator("h2[class='title'] a[title='Show products in category Notebooks']").click();

    await page.click("//h2[@class='product-title']//a[normalize-space()='Asus Laptop']");

    await page.locator("#product_enteredQuantity_5").fill("1");
    await page.locator("#add-to-cart-button-5").click();

    await page.locator(".cart-label").click();

    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();

     await page.locator("button[onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();

    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();
    await page.waitForTimeout(2000);

    await page.locator(".button-1.payment-info-next-step-button").click();
   
    //Result expect
    const dialogPromise = page.waitForEvent("dialog");
    // Act
     await page.locator(".button-1.confirm-order-next-step-button").click();
    // Expected result
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("Please wait several seconds before placing a new order (already placed another order several seconds ago).");
    await dialog.accept();
});

test('Checkout-048 - Confirm Billing address successful when address exists', async ({ page }) => {

    await addLaptopToCheckout(page);
    await exitAddress(page);

    await page.locator(".cart-label").click();
    await page.locator("#termsofservice").check();
    await page.locator("#checkout").click();

    await page.locator("button[onclick='if (!window.__cfRLUnblockHandlers) return false; Billing.save()']").click();
    await page.locator("//button[@class='button-1 shipping-method-next-step-button']").click();
    await page.locator("//button[@class='button-1 payment-method-next-step-button']").click();
    await page.locator(".button-1.payment-info-next-step-button").click();
    await page.locator(".button-1.confirm-order-next-step-button").click();

    //Result expect
    await expect(page.locator("//h2[normalize-space()='Your order has been successfully processed!']")).toContainText("Your order has been successfully processed!");
});

