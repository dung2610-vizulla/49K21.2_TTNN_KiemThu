import { test, expect, type Page } from '@playwright/test';
//Pending
test('Search-001 - Search with empty keyword', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator('#small-searchterms').fill('');

    const submitsearchAlert = page.locator("button[type='submit']");
    await submitsearchAlert.scrollIntoViewIfNeeded();
    page.once('dialog', async dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    // expect(dialog.message()).toBe("Please enter some search keyword");
    await dialog.accept();
   
    });
    await submitsearchAlert.click();
    await page.waitForTimeout(2000);
});

test('Search-002 - Search with only spaces', async ({ page }) => {
   
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator('#small-searchterms').fill(' ');

    await page.locator("button[type='submit']").click();

    await expect(page.locator(".warning")).toHaveText('Search term minimum length is 3 characters');
    await page.waitForTimeout(2000);
});

test('Search-003 - Search with special keyword', async ({ page }) => {
   
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator('#small-searchterms').fill('@#$%');

    await page.locator("button[type='submit']").click();

    await expect(page.locator(".no-result")).toHaveText('No products were found that matched your criteria.');
    await page.waitForTimeout(2000);
});

test('Search-004 - Search with very long keyword', async ({ page }) => {
   
    await page.goto('https://demo.nopcommerce.com/');

    await page.locator('#small-searchterms').fill('a'.repeat(255));

    await page.locator("button[type='submit']").click();

    await expect(page.locator(".no-result")).toHaveText('No products were found that matched your criteria.');
    await page.waitForTimeout(2000);
});

test('Search-005 - Search with a keyword shorter than 3 characters', async ({ page }) => {
   
    await page.goto('https://demo.nopcommerce.com/');
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const randomKeyword =
    chars[Math.floor(Math.random() * chars.length)] +
    chars[Math.floor(Math.random() * chars.length)];

    await page.locator('#small-searchterms').fill(randomKeyword);

    await page.locator("button[type='submit']").click();

    await expect(page.locator(".warning")).toHaveText('Search term minimum length is 3 characters');
    await page.waitForTimeout(2000);
});

test('Search-006 - Search with keyword exactly 3 character', async ({ page }) => {

    await page.goto('https://demo.nopcommerce.com/');
    await page.locator('#small-searchterms').fill("app");

    await page.locator("button[type='submit']").click();

    const products = page.locator('.product-item');
    expect(await products.count()).toBeGreaterThan(0);

    // check the product title contains the keyword

    const title = await page.locator('.product-title').allTextContents();
    expect(title.some(title => title.toLowerCase().includes('apple'))).toBeTruthy();
    await page.waitForTimeout(2000);
});

test('Search-007 - Search with valid keyword', async ({ page }) => {

    await page.goto('https://demo.nopcommerce.com/');
    await page.locator('#small-searchterms').fill("Camera");

    await page.locator("button[type='submit']").click();

    const products = page.locator('.product-item');
    expect(await products.count()).toBeGreaterThan(0);

    // check the product title contains the keyword
    const title = await page.locator('.product-title').allTextContents();
    expect(title.some(title => title.toLowerCase().includes('camera'))).toBeTruthy();
    await page.waitForTimeout(2000);
});

test('Search-008 - Search with uppercase keyword', async ({ page }) => {

    await page.goto('https://demo.nopcommerce.com/');
    await page.locator('#small-searchterms').fill("CAMERA");

    await page.locator("button[type='submit']").click();

    const products = page.locator('.product-item');
    expect(await products.count()).toBeGreaterThan(0);

    // check the product title contains the keyword
    const title = await page.locator('.product-title').allTextContents();
    expect(title.some(title => title.toLowerCase().includes('camera'))).toBeTruthy();
    await page.waitForTimeout(2000);
});

test('Search-009 - Search with lowercase keyword', async ({ page }) => {

    await page.goto('https://demo.nopcommerce.com/');
    await page.locator('#small-searchterms').fill("camera");

    await page.locator("button[type='submit']").click();

    const products = page.locator('.product-item');
    expect(await products.count()).toBeGreaterThan(0);

    // check the product title contains the keyword
    const title = await page.locator('.product-title').allTextContents();
    expect(title.some(title => title.toLowerCase().includes('camera'))).toBeTruthy();
    await page.waitForTimeout(2000);
});

test('Search-010 - Search with leading and trailling spaces in keyword', async ({ page }) => {

    await page.goto('https://demo.nopcommerce.com/');
    await page.locator('#small-searchterms').fill(" camera ");

    await page.locator("button[type='submit']").click();

    const products = page.locator('.product-item');
    expect(await products.count()).toBeGreaterThan(0);

    // check the product title contains the keyword
    const title = await page.locator('.product-title').allTextContents();
    expect(title.some(title => title.toLowerCase().includes('camera'))).toBeTruthy();
    await page.waitForTimeout(2000);
});

test('Search-011 - Search with non-existent product', async ({ page }) => {

    await page.goto('https://demo.nopcommerce.com/');
    await page.locator('#small-searchterms').fill("asdfg");

    await page.locator("button[type='submit']").click();

    await expect(page.locator(".no-result")).toHaveText('No products were found that matched your criteria.');
    await page.waitForTimeout(2000);
});

test('Search-012 - Search with empty keyword', async ({ page }) => {

    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator('#q').fill("");

    await page.locator("button[class='button-1 search-button']").click();

    await expect(page.locator(".warning")).toHaveText('Search term minimum length is 3 characters');
    await page.waitForTimeout(2000);
});

test('Search-013 - Search with valid keyword', async ({ page }) => {

    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator('#q').fill("Camera");

    await page.locator("button[class='button-1 search-button']").click();

    const products = page.locator('.product-item');
    expect(await products.count()).toBeGreaterThan(0);

    // check the product title contains the keyword
    const title = await page.locator('.product-title').allTextContents();
    expect(title.some(title => title.toLowerCase().includes('camera'))).toBeTruthy();
    await page.waitForTimeout(2000);
});

test('Search-014 - Select the "Advanced search" checkbox', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator("label[for='advs']").check();
    await page.waitForTimeout(1000);

    await expect(page.locator("label[for='advs']")).toBeChecked();
    await page.waitForTimeout(1000);

    //await page.locator("label[for='advs']").uncheck();

    await expect(page.locator("#advanced-search-block")).toBeVisible();
    await page.waitForTimeout(1000);
});

test('Search-015 - Uncheck the "Advanced search" checkbox', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator("label[for='advs']").uncheck();
    await page.waitForTimeout(1000);

    await expect(page.locator("label[for='advs']")).not.toBeChecked();
    await page.waitForTimeout(1000);

    await expect(page.locator("#advanced-search-block")).not.toBeVisible();
    await page.waitForTimeout(1000);
});

test('Search-016 - Search by Category with a valid keyword including Automatically search sub categories', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator('#q').fill("Nike");

    await page.locator("label[for='advs']").check();
    

    await page.waitForSelector("#cid", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#cid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.selectOption("#cid", { label: "Apparel" });

    await page.locator("label[for='isc']").check();
    await page.waitForTimeout(1000);

    await page.locator("button[class='button-1 search-button']").click();
    //except
    const products = page.locator('.product-item');
    expect(await products.count()).toBeGreaterThan(0);

    // check the product title contains the keyword
    const title = await page.locator('.product-title').allTextContents();
    expect(title.some(title => title.toLowerCase().includes('nike'))).toBeTruthy();
});

test('Search-017 - Search by Category with a valid keyword', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator('#q').fill("Nike");

    await page.locator("label[for='advs']").check();
    

    await page.waitForSelector("#cid", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#cid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.selectOption("#cid", { label: "Apparel" });

    await page.locator("button[class='button-1 search-button']").click();
    await page.waitForTimeout(2000);
    //except

    const products = page.locator('.product-item');
    expect(await products.count()).toBeGreaterThan(0);

    // check the product title contains the keyword
    const title = await page.locator('.product-title').allTextContents();
    expect(title.some(title => title.toLowerCase().includes('nike'))).toBeTruthy();
    await page.waitForTimeout(2000);
});

test('Search-018 - Search by Category without a keyword', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator('#q').fill("");

    await page.locator("label[for='advs']").check();
    
    await page.waitForSelector("#cid", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#cid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.selectOption("#cid", { label: "Apparel" });

    await page.locator("button[class='button-1 search-button']").click();
    //except

    await expect(page.locator(".warning")).toHaveText('Search term minimum length is 3 characters');
    await page.waitForTimeout(2000);
});


test('Search-019 - Search by Manufacturer with a valid keyword', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator('#q').fill("Book");

    await page.locator("label[for='advs']").check();
    
    await page.waitForSelector("#mid", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#mid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.selectOption("#mid", { label: "HP" });

    await page.locator("button[class='button-1 search-button']").click();
    //except

    const products = page.locator('.product-item');
    expect(await products.count()).toBeGreaterThan(0);  

    // check the product title contains the keyword
    const title_manufacturer = await page.locator('.product-title').allTextContents();
    expect(title_manufacturer.some(title => title.toLowerCase().includes('hp'))).toBeTruthy();

    const title_key = await page.locator('.product-title').allTextContents();
    expect(title_key.some(title => title.toLowerCase().includes('book'))).toBeTruthy();
    await page.waitForTimeout(2000);
});

test('Search-020 - Search by Manufacturer without a keyword', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator('#q').fill("");

    await page.locator("label[for='advs']").check();
    
    await page.waitForSelector("#mid", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#mid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.selectOption("#mid", { label: "HP" });

    await page.locator("button[class='button-1 search-button']").click();
    //except

    await expect(page.locator(".warning")).toHaveText('Search term minimum length is 3 characters');
    await page.waitForTimeout(2000);
});

test('Search-021 - Search by Category and Manufacturer without a keyword', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator('#q').fill("Book");

    await page.locator("label[for='advs']").check();
    
    await page.waitForSelector("#cid", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#cid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.selectOption("#cid", { label: "Computers >> Notebooks" });

    await page.waitForSelector("#mid", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#mid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.selectOption("#mid", { label: "HP" });

    await page.locator("button[class='button-1 search-button']").click();
    //except

    const products = page.locator('.product-item');
    expect(await products.count()).toBeGreaterThan(0);  

    // check the product title contains the keyword
    const title_manufacturer = await page.locator('.product-title').allTextContents();
    expect(title_manufacturer.some(title => title.toLowerCase().includes('hp'))).toBeTruthy();

    const title_key = await page.locator('.product-title').allTextContents();
    expect(title_key.some(title => title.toLowerCase().includes('book'))).toBeTruthy();
    await page.waitForTimeout(2000);
});

test('Search-022 - Search by Category and Manufacturer without a keyword', async ({ page }) => {
    await page.goto('https://demo.nopcommerce.com/search');
    await page.locator('#q').fill("");

    await page.locator("label[for='advs']").check();
    
    await page.waitForSelector("#cid", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#cid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.selectOption("#cid", { label: "Computers >> Notebooks" });

    await page.waitForSelector("#mid", { state: 'visible', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.locator("#mid").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.selectOption("#mid", { label: "HP" });

    await page.locator("button[class='button-1 search-button']").click();
    //except

    await expect(page.locator(".warning")).toHaveText('Search term minimum length is 3 characters');
    await page.waitForTimeout(2000);
});
