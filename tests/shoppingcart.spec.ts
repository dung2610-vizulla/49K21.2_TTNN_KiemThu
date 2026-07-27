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

async function asusLaptop_5(page: Page) {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/computers']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Notebooks']").click();

    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Asus Laptop']");
    await page.waitForTimeout(1000);

}

// async function womenTShirt_30(page:Page){
//     await page.goto('https://demo.nopcommerce.com/');

//     await page.locator(".menu__link[href='/apparel']").click();
//     await page.waitForTimeout(1000);

//     await page.locator("h2[class='title'] a[title='Show products in category Clothing']").click();
//     await page.waitForTimeout(1000);
    
//     // Open product detail
//     await page.click("//h2[@class='product-title']//a[normalize-space()='Oversized Women T-Shirt']");
//     await page.waitForTimeout(1000);
// }
//QUANTITY
test('AddProduct-001 - Add product to cart with quantity = 1', async ({ page }) => {
    await asusLaptop_5(page);
    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("1");
    await page.locator(" #add-to-cart-button-5").click();
    // Expected result
    await expect(page.locator(".bar-notification.success")).toContainText("The product has been added to your shopping cart");
    await page.waitForTimeout(2000);
});


test('AddProduct-002 - Add product to cart with quantity = 10000', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/computers']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Notebooks']").click();

    // ]Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'HP Envy 15.6-Inch Sleekbook')]");
    await page.waitForTimeout(1000);

    // Enter quantity = 10000
    await page.locator("#product_enteredQuantity_8").fill("10000");
    await page.locator("#add-to-cart-button-8").click();

    // Expected result
    await expect(page.locator(".bar-notification.success")).toContainText("The product has been added to your shopping cart");
    await page.waitForTimeout(2000);
});


test('AddProduct-003 - Add product to cart with  quantity is empty', async ({ page }) => {
    await asusLaptop_5(page);
    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("");
    await page.locator(" #add-to-cart-button-5").click();

    // Expected result
    await expect(page.locator(" .content")).toContainText("Quantity should be positive");
    await page.waitForTimeout(2000);
});

test('AddProduct-004 - Add product to cart with quantity less than 1', async ({ page }) => {
    await asusLaptop_5(page);

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("-1");
    await page.locator(" #add-to-cart-button-5").click();

    // Expected result
    await expect(page.locator(" .content")).toContainText("Quantity should be positive");
    await page.waitForTimeout(2000);
});

test('AddProduct-005 - Add product to cart with quantity of 0', async ({ page }) => {
    await asusLaptop_5(page);

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("0");
    await page.locator(" #add-to-cart-button-5").click();

    // Expected result
    await expect(page.locator(" .content")).toContainText("Quantity should be positive");
    await page.waitForTimeout(2000);
});

test('AddProduct-006 - Add product to cart with quantity is decimal numbers', async ({ page }) => {
    await asusLaptop_5(page);

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("9.5");
    await page.locator(" #add-to-cart-button-5").click();

    // Expected result
    await expect(page.locator(" .content")).toContainText("Quantity should be positive");
    await page.waitForTimeout(2000);
});

test('AddProduct-007 - Add product to cart with quantity greater than 10000', async ({ page }) => {
    await asusLaptop_5(page);

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("10001");
    await page.locator(" #add-to-cart-button-5").click();

    // Expected result
    await expect(page.locator(" .content")).toContainText("The maximum quantity allowed for purchase is 10000.");
    await page.waitForTimeout(2000);
});

test('AddProduct-008 - Add product to cart with quantity is not number', async ({ page }) => {
    await asusLaptop_5(page);
    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("abc");
    await page.locator(" #add-to-cart-button-5").click();

    // Expected result
    await expect(page.locator(" .content")).toContainText("Quantity should be positive");
    await page.waitForTimeout(2000);
});

// PRODUCT WITH VARIANTS (SIZE, COLOR, TYPE)
test('AddProduct-009 - Product with variants(size, color, type) successfully added to cart.', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/apparel']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Shoes']").click();
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Nike Floral Roshe Customized Running Shoes']");
    await page.waitForTimeout(1000);

    // select size
    await page.waitForSelector("#product_attribute_6", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_6").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_6").selectOption("8");
    await page.waitForTimeout(1000);

    // Select Color 
    await page.waitForSelector("#product_attribute_7", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_7").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_7").selectOption("White/Blue");
    await page.waitForTimeout(1000);

    // Select Print = Natural
    await page.locator("//label[@for='product_attribute_8_19']//span[@class='attribute-square']").check();

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_26").fill("1");
    await page.locator("#add-to-cart-button-26").click();

    // Expected result
    await expect(
        page.locator(".bar-notification.success")
    ).toContainText(
        "The product has been added to your shopping cart"
    );
    await page.waitForTimeout(2000);
});

test('AddProduct-010 - No Size selected', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/apparel']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Shoes']").click();
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Nike Floral Roshe Customized Running Shoes']");
    await page.waitForTimeout(1000);

    // Select Color 
    await page.waitForSelector("#product_attribute_7", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_7").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_7").selectOption("White/Blue");
    await page.waitForTimeout(1000);

    // Select Print = Natural
    await page.locator("//label[@for='product_attribute_8_19']//span[@class='attribute-square']").check();

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_26").fill("1");
    await page.locator("#add-to-cart-button-26").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Please select Size");
    await page.waitForTimeout(2000);
});

test('AddProduct-011 - No Color selected', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/apparel']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Shoes']").click();
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Nike Floral Roshe Customized Running Shoes']");
    await page.waitForTimeout(1000);

    // select size
    await page.waitForSelector("#product_attribute_6", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_6").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_6").selectOption("8");
    await page.waitForTimeout(1000);

    // Select Print = Natural
    await page.locator("//label[@for='product_attribute_8_19']//span[@class='attribute-square']").check();

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_26").fill("1");
    await page.locator("#add-to-cart-button-26").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Please select Color");
    await page.waitForTimeout(2000);
});

test('AddProduct-012 - No Print selected', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/apparel']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Shoes']").click();
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Nike Floral Roshe Customized Running Shoes']");
    await page.waitForTimeout(1000);

    // select size
    await page.waitForSelector("#product_attribute_6", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_6").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_6").selectOption("8");
    await page.waitForTimeout(1000);

    // Select Color 
    await page.waitForSelector("#product_attribute_7", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_7").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_7").selectOption("White/Blue");
    await page.waitForTimeout(1000);

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_26").fill("1");
    await page.locator("#add-to-cart-button-26").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Please select Print");
    await page.waitForTimeout(2000);
});

 
// PRODUCT WITH VARIANTS (PROCESSOR, RAM, HDD, OS, SOFTWARE)
test('AddProduct-013 - Product with variants(Processor, RAM, HDD, OS, Software) successfully added to cart.', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/computers']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Desktops']").click();
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Build your own computer']");
    await page.waitForTimeout(1000);

    // select processor
    await page.waitForSelector("#product_attribute_1", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_1").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_1").selectOption("2.2 GHz Intel Pentium Dual-Core E2200");
    await page.waitForTimeout(1000);

    // Select RAM
    await page.waitForSelector(" #product_attribute_2", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_2").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_2").selectOption("2 GB");
    await page.waitForTimeout(1000);

    // Select HDD
    await page.locator("label[for='product_attribute_3_6']").click();

    // Select OS
    await page.locator("label[for='product_attribute_4_9']").check();

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_1").fill("1");
    await page.locator("#add-to-cart-button-1").click();

    // Expected result
    await expect(
        page.locator(".bar-notification.success")
    ).toContainText(
        "The product has been added to your shopping cart"
    );
    await page.waitForTimeout(2000);
});

test('AddProduct-014 - No Processor selected', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/computers']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Desktops']").click();
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Build your own computer']");
    await page.waitForTimeout(1000);

    // select processor
    await page.waitForSelector("#product_attribute_1", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_1").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_1").selectOption("Please select");
    await page.waitForTimeout(1000);

    // Select RAM
    await page.waitForSelector(" #product_attribute_2", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_2").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_2").selectOption("2 GB");
    await page.waitForTimeout(1000);

    // Select HDD
    await page.locator("label[for='product_attribute_3_6']").click();

    // Select OS
    await page.locator("label[for='product_attribute_4_9']").check();

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_1").fill("1");
    await page.locator("#add-to-cart-button-1").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Please select Processor");
    await page.waitForTimeout(2000);
});

test('AddProduct-015 - No RAM selected', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/computers']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Desktops']").click();
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Build your own computer']");
    await page.waitForTimeout(1000);

    // select processor
    await page.waitForSelector("#product_attribute_1", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_1").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_1").selectOption("2.2 GHz Intel Pentium Dual-Core E2200");
    await page.waitForTimeout(1000);

    // Select HDD
    await page.locator("label[for='product_attribute_3_6']").click();

    // Select OS
    await page.locator("label[for='product_attribute_4_9']").check();

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_1").fill("1");
    await page.locator("#add-to-cart-button-1").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Please select RAM");
    await page.waitForTimeout(2000);
});

test('AddProduct-016 - No HDD selected', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/computers']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Desktops']").click();
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Build your own computer']");
    await page.waitForTimeout(1000);

    // select processor
    await page.waitForSelector("#product_attribute_1", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_1").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_1").selectOption("2.2 GHz Intel Pentium Dual-Core E2200");
    await page.waitForTimeout(1000);

    // Select RAM
    await page.waitForSelector(" #product_attribute_2", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#product_attribute_2").scrollIntoViewIfNeeded();

    await page.locator("#product_attribute_2").selectOption("2 GB");
    await page.waitForTimeout(1000);

    // Select OS
    await page.locator("label[for='product_attribute_4_9']").check();

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_1").fill("1");
    await page.locator("#add-to-cart-button-1").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Please select HDD");
    await page.waitForTimeout(2000);
});

// PRODUCT WITH VARIANTS (ENTER YOUR TEXT)
test('AddProduct-017 - Product with variants(Enter your text) successfully added to cart.', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/apparel']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Clothing']").click();
    
    // Open product detail
    await page.click("//a[normalize-space()='Custom T-Shirt']");
    await page.waitForTimeout(1000);

    // select text
    await page.locator("#product_attribute_12").fill("This is my custom text");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_31").fill("1");
    await page.locator("#add-to-cart-button-31").click();

    // Expected result
    await expect(page.locator(".bar-notification.success")).toContainText("The product has been added to your shopping cart");
    await page.waitForTimeout(2000);
});


test('AddProduct-018 - Enter your text is empty', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator(".menu__link[href='/apparel']").click();
    await page.waitForTimeout(1000);
    await page.locator("h2[class='title'] a[title='Show products in category Clothing']").click();
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Custom T-Shirt']");
    await page.waitForTimeout(1000);

    // select text
    await page.locator("#product_attribute_12").fill("");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_31").fill("1");
    await page.locator("#add-to-cart-button-31").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter your text:");
    await page.waitForTimeout(2000);
});


// RENTAL
test('AddProduct-019 - Rental product successfully added to cart.', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Jewelry']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Elegant Gemstone Necklace (rental)']");
    await page.waitForTimeout(1000);

    // Enter rental dates

     const today = new Date();

    // Start date = Today + 3 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 3);

    // End date = Start date + 5 days
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5);

    // Format MM/dd/yyyy
    const formatDate = (date: Date) =>
        `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

    // Enter rental dates
    await page.locator("#rental_start_date_39").fill(formatDate(startDate));
    await page.locator("#rental_end_date_39").fill(formatDate(endDate));

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_39").fill("1");
    await page.locator(" #add-to-cart-button-39").click();

    // Expected result
     await expect(page.locator(".bar-notification.success")).toContainText("The product has been added to your shopping cart");
});

test('AddProduct-020 - Rental product added to cart with start date is empty', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Jewelry']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Elegant Gemstone Necklace (rental)']");
    await page.waitForTimeout(1000);

    // Enter rental dates

     const today = new Date();

    // End date = Today + 5 days
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 5);

    // Format MM/dd/yyyy
    const formatDate = (date: Date) =>
        `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

    // Enter rental dates
    await page.locator("#rental_end_date_39").fill(formatDate(endDate));

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_39").fill("1");
    await page.locator(" #add-to-cart-button-39").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter rental start date");
    await page.waitForTimeout(2000);
});

test('AddProduct-021 - Start date is not in the mm/dd/yyyy format', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Jewelry']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Elegant Gemstone Necklace (rental)']");
    await page.waitForTimeout(1000);

    // Enter rental dates

     const today = new Date();

    // Start date = Today + 3 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 3);

    // End date = Start date + 5 days
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5);

    // Wrong format: dd/MM/yyyy
    const wrongFormatDate = (date: Date) =>
        `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

    // Correct format: MM/dd/yyyy
    const correctFormatDate = (date: Date) =>
        `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

    // Start date: WRONG format
    await page.locator("#rental_start_date_39").fill(wrongFormatDate(startDate));
    await page.waitForTimeout(5000);
    // End date: CORRECT format
    await page.locator("#rental_end_date_39").fill(correctFormatDate(endDate));

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_39").fill("1");
    await page.locator(" #add-to-cart-button-39").click();

    // Expected result
     await expect(page.locator(".content")).toContainText("Enter rental start date");
    await page.waitForTimeout(2000);
});

test('AddProduct-022 - Rental product added to cart with start date is earlier than current date', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Jewelry']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Elegant Gemstone Necklace (rental)']");
    await page.waitForTimeout(1000);

    // Enter rental dates

     const today = new Date();

    // Start date = Today - 3 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 3);

    // End date = Start date + 5 days
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5);

    // Format MM/dd/yyyy
    const formatDate = (date: Date) =>
        `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

    // Enter rental dates
    await page.locator("#rental_start_date_39").fill(formatDate(startDate));
    await page.locator("#rental_end_date_39").fill(formatDate(endDate));

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_39").fill("1");
    await page.locator(" #add-to-cart-button-39").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Rental start date should be the future date");
    await page.waitForTimeout(2000);
});

test('AddProduct-023 - Rental product added to cart with end date is empty', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Jewelry']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Elegant Gemstone Necklace (rental)']");
    await page.waitForTimeout(1000);

    // Enter rental dates

     const today = new Date();

    // Start date = Today + 3 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 3);

    // Format MM/dd/yyyy
    const formatDate = (date: Date) =>
        `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

    // Enter rental dates
    await page.locator("#rental_start_date_39").fill(formatDate(startDate));

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_39").fill("1");
    await page.locator(" #add-to-cart-button-39").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter rental end date");
    await page.waitForTimeout(2000);
});

test('AddProduct-024 - End date is not in the mm/dd/yyyy format', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Jewelry']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Elegant Gemstone Necklace (rental)']");
    await page.waitForTimeout(1000);

    // Enter rental dates

     const today = new Date();

    // Start date = Today + 3 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 3);

    // End date = Start date + 1 days
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Wrong format: dd/MM/yyyy
    const wrongFormatDate = (date: Date) =>
        `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

    // Correct format: MM/dd/yyyy
    const correctFormatDate = (date: Date) =>
        `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

    // Start date: WRONG format
    await page.locator("#rental_start_date_39").fill(correctFormatDate(startDate));
    await page.waitForTimeout(5000);
    // End date: CORRECT format
    await page.locator("#rental_end_date_39").fill(wrongFormatDate(endDate));

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_39").fill("1");
    await page.locator(" #add-to-cart-button-39").click();

    // Expected result
     await expect(page.locator(".content")).toContainText("Enter rental end date");
    await page.waitForTimeout(2000);
});

test('AddProduct-025 - Rental product added to cart with end date is earlier than Start date', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Jewelry']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='Elegant Gemstone Necklace (rental)']");
    await page.waitForTimeout(1000);

    // Enter rental dates

     const today = new Date();

    // Start date = Today + 3 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 3);

    // End date = Today + 2 days
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 2);

    // Format MM/dd/yyyy
    const formatDate = (date: Date) =>
        `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

    // Enter rental dates
    await page.locator("#rental_start_date_39").fill(formatDate(startDate));
    await page.locator("#rental_end_date_39").fill(formatDate(endDate));

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_39").fill("1");
    await page.locator(" #add-to-cart-button-39").click();

    // Expected result
     await expect(page.locator(".content")).toContainText("Rental start date should be less than end date");
});


//GIFT CART
test('AddProduct-026 - Gift card successfully added to cart', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("Nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi99@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".bar-notification.success")).toContainText("The product has been added to your shopping cart");
    await page.waitForTimeout(2000);
});

test('AddProduct-027 - Gift card unsuccessful added to cart by Recipients Name is empty', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi99@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid recipient name");
    await page.waitForTimeout(2000);
});

test('AddProduct-028 - Gift card unsuccessful added to cart by Recipients Name contains special characters', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi@#$%");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi99@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid recipient name");
    await page.waitForTimeout(2000);
});

test('AddProduct-029 - Gift card unsuccessful added to cart by Recipients Name contains numbers', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi12345");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi99@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid recipient name");
    await page.waitForTimeout(2000);
});

test('AddProduct-030 - Gift card unsuccessful added to cart by Recipients Email is empty', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid recipient email");
    await page.waitForTimeout(2000);
});

test('AddProduct-031 - Gift card unsuccessful added to cart by Recipients Email is not in corect format @', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghigmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid recipient email");
    await page.waitForTimeout(2000);
});

test('AddProduct-032 - Gift card unsuccessful added to cart by Recipients Email is not in corect format ".com"', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi@gmail");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid recipient email");
    await page.waitForTimeout(2000);
});

test('AddProduct-033 - Gift card unsuccessful added to cart by Recipients Email contains spaces', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi @gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid recipient email");
    await page.waitForTimeout(2000);
});

test('AddProduct-034 - Gift card unsuccessful added to cart by Recipients Email contains invalid characters', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("^&%phuongnghi@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid recipient email");
    await page.waitForTimeout(2000);
});

test('AddProduct-035 - Gift card unsuccessful added to cart by Your Name is empty', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid sender name");
    await page.waitForTimeout(2000);
});

test('AddProduct-036 - Gift card unsuccessful added to cart by Your Name contains special characters', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung#$^");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid sender name");
    await page.waitForTimeout(2000);
});

test('AddProduct-037 - Gift card unsuccessful added to cart by Your Name contains numbers', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung123");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid sender name");
    await page.waitForTimeout(2000);
});

test('AddProduct-038 - Gift card unsuccessful added to cart by Your Email is empty', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid sender email");
    await page.waitForTimeout(2000);
});

test('AddProduct-039 - Gift card unsuccessful added to cart by Your Email is not in corect format @', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoanggmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid sender email");
    await page.waitForTimeout(2000);
});

test('AddProduct-040 - Gift card unsuccessful added to cart by Your Email is not in corect format ".com"', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dunghoang@gmail");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid sender email");
    await page.waitForTimeout(2000);
});

test('AddProduct-041 - Gift card unsuccessful added to cart by Your Email contains spaces', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("dung hoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid sender email");
    await page.waitForTimeout(2000);
});

test('AddProduct-042 - Gift card unsuccessful added to cart by Your Email contains invalid characters', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Gift Cards']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[contains(text(),'$25 Virtual Gift Card')]");
    await page.waitForTimeout(1000);

    await page.locator("#giftcard_42_RecipientName").fill("nghi");
    await page.locator("#giftcard_42_RecipientEmail").fill("phuongnghi@gmail.com");

    await page.locator("#giftcard_42_SenderName").fill("dung");
    await page.locator("#giftcard_42_SenderEmail").fill("#$%dunghoang@gmail.com");

    // Enter quantity = 1
    await page.locator(" #product_enteredQuantity_42").fill("1");
    await page.locator(" #add-to-cart-button-42").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("Enter valid sender email");
    await page.waitForTimeout(2000);
});

test('AddProduct-043 - Add wishlist items to the cart successfully', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Books']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='First Prize Pies']");
    await page.waitForTimeout(1000);

    await page.locator("#add-to-wishlist-button-37").click();
    await page.locator(".wishlist-label").click();

    await page.locator("input[name='addtocart']").check();
    await page.waitForTimeout(2000);

    await page.locator("button[name='addtocartbutton']").click();

    // Expected result
    await expect(page).toHaveURL(/cart/);
    await expect(page.locator(" div[class='page-title'] h1")).toHaveText("Shopping cart");
    const row = page.locator("tr").filter({has: page.locator(".product-name", {hasText: "First Prize Pies"})
    });

});

test('AddProduct-044 - Add wishlist items to the cart unsuccessfully', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator("//a[normalize-space()='Books']").click();
    await page.waitForTimeout(1000);
    
    // Open product detail
    await page.click("//h2[@class='product-title']//a[normalize-space()='First Prize Pies']");
    await page.waitForTimeout(1000);

    await page.locator("#add-to-wishlist-button-37").click();
    await page.locator(".wishlist-label").click();

    await page.locator("button[name='addtocartbutton']").click();

    // Expected result
    await expect(page.locator(".content")).toContainText("No products selected to add to cart.");
});

//UPDATE QUANTITY
test('UpdateProduct-045 - Quantity product updated successfully', async ({ page }) => {
    await asusLaptop_5(page);

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("1");
    await page.locator(" #add-to-cart-button-5").click();

    await page.locator(".cart-label").click();

      const row = page.locator("tr").filter({
        has: page.locator("a", { hasText: "Asus Laptop" })
    });

    const quantity = row.locator("input.qty-input");

    await quantity.fill("3");
    await page.keyboard.press('Enter');
     // Expected result

    await expect(quantity).toHaveValue("3");
    await expect(row.locator(".subtotal")).toContainText("$4,500.00");
    await page.waitForTimeout(1000);
    
});

test('UpdateProduct-046 - Quantity product updated unsuccessfully with quantity less than 1', async ({ page }) => {
    await asusLaptop_5(page);

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("1");
    await page.locator(" #add-to-cart-button-5").click();

    await page.locator(".cart-label").click();

      const row = page.locator("tr").filter({
        has: page.locator("a", { hasText: "Asus Laptop" })
    });

    const quantity = row.locator("input.qty-input");

    await quantity.fill("-4");
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
     // Expected result

    await expect(row.locator("div[class='message-error'] ul li")).toContainText("This product is required in the quantity of 0");
    await page.waitForTimeout(1000);
});

test('UpdateProduct-047 - Quantity product updated unsuccessfully with quantity greater than 0 and less than or equal to 10000', async ({ page }) => {
    await asusLaptop_5(page);

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("1");
    await page.locator(" #add-to-cart-button-5").click();

    await page.locator(".cart-label").click();

      const row = page.locator("tr").filter({
        has: page.locator("a", { hasText: "Asus Laptop" })
    });

    const quantity = row.locator("input.qty-input");

    await quantity.fill("10001");
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
     // Expected result

    await expect(row.locator("div[class='message-error'] ul li")).toContainText("The maximum quantity allowed for purchase is 10000.");
    await page.waitForTimeout(1000);
});

test('UpdateProduct-048 - Verify thay the number of products updated is 0, product is removed from  the cart', async ({ page }) => {
    await asusLaptop_5(page);

    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("1");
    await page.locator(" #add-to-cart-button-5").click();

    await page.locator(".cart-label").click();

      const row = page.locator("tr").filter({
        has: page.locator("a", { hasText: "Asus Laptop" })
    });

    const quantity = row.locator("input.qty-input");

    await quantity.fill("0");
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
     // Expected result

     await expect(
        page.locator("td.product a", { hasText: "Asus Laptop" })
    ).toHaveCount(0);
});
// 

test('TotalProduct-049 - Verify Gift Wrapping fee calculation ', async ({ page }) => {
    await asusLaptop_5(page);
    // Enter quantity = 1
    await page.locator("#product_enteredQuantity_5").fill("1");
    await page.locator(" #add-to-cart-button-5").click();

    await page.locator(".cart-label").click();

    await page.waitForSelector("#checkout_attribute_1", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#checkout_attribute_1").scrollIntoViewIfNeeded();
    await page.locator("#checkout_attribute_1").selectOption("Yes [+$10.00]");
    await page.waitForTimeout(2000);

     // Expected result

     await expect( page.locator(".selected-checkout-attributes")).toContainText("Gift wrapping: Yes [+$10.00]");
});






// // APPLY PRICE BASED ON QUANTITY (CLOTHING)
// test('AddProduct-026 - Verify that apply the correct price based on quantity of 1', async ({ page }) => {
//     await womenTShirt_30(page);

//     // Enter quantity = 1
//     await page.locator(" #product_enteredQuantity_30").fill("1");
//     await page.locator(" #add-to-cart-button-30").click();

//     await page.locator(".cart-label").click();

//     // Expected result
//      await expect(page.locator("td[class='unit-price']")).toContainText("$24.00");
//      await page.waitForTimeout(1000);
// });

// test('AddProduct-027 - Verify that apply the correct price based on quantity of 2', async ({ page }) => {
//     await womenTShirt_30(page);

//     // Enter quantity = 1
//     await page.locator(" #product_enteredQuantity_30").fill("2");
//     await page.locator(" #add-to-cart-button-30").click();

//     await page.locator(".cart-label").click();

//     // Expected result
//      await expect(page.locator("td[class='unit-price']")).toContainText("$24.00");
//      await page.waitForTimeout(1000);
// });

// test('AddProduct-028 - Verify that apply the correct price based on quantity of 3', async ({ page }) => {
//     await womenTShirt_30(page);

//     // Enter quantity = 1
//     await page.locator(" #product_enteredQuantity_30").fill("3");
//     await page.locator(" #add-to-cart-button-30").click();

//     await page.locator(".cart-label").click();

//     // Expected result
//      await expect(page.locator("td[class='unit-price']")).toContainText("$21.00");
//      await page.waitForTimeout(1000);
// });

// test('AddProduct-029 - Verify that apply the correct price based on quantity of 6', async ({ page }) => {
//     await womenTShirt_30(page);

//     // Enter quantity = 1
//     await page.locator(" #product_enteredQuantity_30").fill("6");
//     await page.locator(" #add-to-cart-button-30").click();

//     await page.locator(".cart-label").click();

//     // Expected result
//      await expect(page.locator("td[class='unit-price']")).toContainText("$21.00");
//      await page.waitForTimeout(1000);
// });

// test('AddProduct-030 - Verify that apply the correct price based on quantity of 7', async ({ page }) => {
//     await womenTShirt_30(page);

//     // Enter quantity = 1
//     await page.locator(" #product_enteredQuantity_30").fill("7");
//     await page.locator(" #add-to-cart-button-30").click();

//     await page.locator(".cart-label").click();

//     // Expected result
//      await expect(page.locator("td[class='unit-price']")).toContainText("$19.00");
//      await page.waitForTimeout(1000);
// });

// test('AddProduct-031 - Verify that apply the correct price based on quantity of 9', async ({ page }) => {
//     await womenTShirt_30(page);

//     // Enter quantity = 1
//     await page.locator(" #product_enteredQuantity_30").fill("9");
//     await page.locator(" #add-to-cart-button-30").click();

//     await page.locator(".cart-label").click();

//     // Expected result
//      await expect(page.locator("td[class='unit-price']")).toContainText("$19.00");
//      await page.waitForTimeout(1000);
// });

// test('AddProduct-032 - Verify that apply the correct price based on quantity of 10', async ({ page }) => {
//     await womenTShirt_30(page);

//     // Enter quantity = 1
//     await page.locator(" #product_enteredQuantity_30").fill("10");
//     await page.locator(" #add-to-cart-button-30").click();

//     await page.locator(".cart-label").click();

//     // Expected result
//      await expect(page.locator("td[class='unit-price']")).toContainText("$16.00");
//      await page.waitForTimeout(1000);
// });

// test('AddProduct-033 - Verify that apply the correct price based on quantity of 15', async ({ page }) => {
//     await womenTShirt_30(page);

//     // Enter quantity = 1
//     await page.locator(" #product_enteredQuantity_30").fill("15");
//     await page.locator(" #add-to-cart-button-30").click();

//     await page.locator(".cart-label").click();

//     // Expected result
//      await expect(page.locator("td[class='unit-price']")).toContainText("$16.00");
//      await page.waitForTimeout(1000);
// });

// //DOWLOAD DIGITAL (PENDING)
// test('AddProduct-034 - Verify that digital content download successful', async ({ page }) => {
//     await page.goto('https://demo.nopcommerce.com/');

//     await page.locator("div[class='header-menu'] div:nth-child(4) a:nth-child(1)").click();
//     await page.waitForTimeout(1000);
    
//     await page.click("//h2[@class='product-title']//a[normalize-space()='If You Wait (donation)']");
//     await page.waitForTimeout(1000);
 
//     await page.locator(".button-2.download-sample-button").click();
//     // Verify file download

// });

// REMOVE
// test('RemoveProduct-049 - Product successfully removed ', async ({ page }) => {
//     await asusLaptop_5(page);
//     // Enter quantity = 1
//     await page.locator("#product_enteredQuantity_5").fill("1");
//     await page.locator(" #add-to-cart-button-5").click();

//     await page.locator(".cart-label").click();

//       const row = page.locator("tr").filter({
//         has: page.locator("a", { hasText: "Asus Laptop" })
//     });

//     await row.locator("td[class='remove-from-cart']").click();

//      // Expected result

//      await expect(
//         page.locator("td.product a", { hasText: "Asus Laptop" })
//     ).toHaveCount(0);
// });
