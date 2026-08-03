import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';
 
//Pending
test.describe("Search Tests", () => {
 
    let searchPage: SearchPage;
 
    test.beforeEach(async ({ page }) => {
        searchPage = new SearchPage(page);
         await page.goto('https://demo.nopcommerce.com/search');
    });
 
    test('Search-001 - Search with empty keyword', async () => {
        await searchPage.fillQuickSearchTerm('');
        await searchPage.acceptNextDialog();
        await searchPage.page.waitForTimeout(2000);
        await searchPage.clickQuickSearchSubmit();
        
    });
 
    // test('Search-002 - Search with only spaces', async () => {
    //     await searchPage.searchQuick(' ');
 
    //     await expect(searchPage.warningMessage).toHaveText('Search term minimum length is 3 characters');
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    // test('Search-003 - Search with special keyword', async () => {
    //     await searchPage.searchQuick('@#$%');
 
    //     await expect(searchPage.noResultMessage).toHaveText('No products were found that matched your criteria.');
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    // test('Search-004 - Search with very long keyword', async () => {
    //     await searchPage.searchQuick('a'.repeat(255));
 
    //     await expect(searchPage.noResultMessage).toHaveText('No products were found that matched your criteria.');
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    test('Search-005 - Search with a keyword shorter than 3 characters', async () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        const randomKeyword =
            chars[Math.floor(Math.random() * chars.length)] +
            chars[Math.floor(Math.random() * chars.length)];
 
        await searchPage.searchQuick(randomKeyword);
 
        await expect(searchPage.warningMessage).toHaveText('Search term minimum length is 3 characters');
        await searchPage.page.waitForTimeout(2000);
    });
 
    test('Search-006 - Search with keyword exactly 3 character', async () => {
        await searchPage.searchQuick("app");
 
        expect(await searchPage.getProductCount()).toBeGreaterThan(0);
 
        // check the product title contains the keyword
        const titles = await searchPage.getProductTitles();
        expect(titles.some(title => title.toLowerCase().includes('apple'))).toBeTruthy();
        await searchPage.page.waitForTimeout(2000);
    });
 
    test('Search-007 - Search with valid keyword', async () => {
        await searchPage.searchQuick("Camera");
 
        expect(await searchPage.getProductCount()).toBeGreaterThan(0);
 
        // check the product title contains the keyword
        const titles = await searchPage.getProductTitles();
        expect(titles.some(title => title.toLowerCase().includes('camera'))).toBeTruthy();
        await searchPage.page.waitForTimeout(2000);
    });
 
    // test('Search-008 - Search with uppercase keyword', async () => {
    //     await searchPage.searchQuick("CAMERA");
 
    //     expect(await searchPage.getProductCount()).toBeGreaterThan(0);
 
    //     // check the product title contains the keyword
    //     const titles = await searchPage.getProductTitles();
    //     expect(titles.some(title => title.toLowerCase().includes('camera'))).toBeTruthy();
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    // test('Search-009 - Search with lowercase keyword', async () => {
    //     await searchPage.searchQuick("camera");
 
    //     expect(await searchPage.getProductCount()).toBeGreaterThan(0);
 
    //     // check the product title contains the keyword
    //     const titles = await searchPage.getProductTitles();
    //     expect(titles.some(title => title.toLowerCase().includes('camera'))).toBeTruthy();
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    // test('Search-010 - Search with leading and trailling spaces in keyword', async () => {
    //     await searchPage.searchQuick(" camera ");
 
    //     expect(await searchPage.getProductCount()).toBeGreaterThan(0);
 
    //     // check the product title contains the keyword
    //     const titles = await searchPage.getProductTitles();
    //     expect(titles.some(title => title.toLowerCase().includes('camera'))).toBeTruthy();
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    test('Search-011 - Search with non-existent product', async () => {
        await searchPage.searchQuick("asdfg");
 
        await expect(searchPage.noResultMessage).toHaveText('No products were found that matched your criteria.');
        await searchPage.page.waitForTimeout(2000);
    });
 
    // test('Search-012 - Search with empty keyword', async () => {
    //     await searchPage.searchAdvanced("");
 
    //     await expect(searchPage.warningMessage).toHaveText('Search term minimum length is 3 characters');
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    // test('Search-013 - Search with valid keyword', async () => {
    //     await searchPage.searchAdvanced("Camera");
 
    //     expect(await searchPage.getProductCount()).toBeGreaterThan(0);
 
    //     // check the product title contains the keyword
    //     const titles = await searchPage.getProductTitles();
    //     expect(titles.some(title => title.toLowerCase().includes('camera'))).toBeTruthy();
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    test('Search-014 - Select the "Advanced search" checkbox', async () => {
        await searchPage.checkAdvancedSearchCheckbox();
        await searchPage.page.waitForTimeout(1000);
 
        await expect(searchPage.advancedSearchCheckboxLabel).toBeChecked();
        await searchPage.page.waitForTimeout(1000);
 
        await expect(searchPage.advancedSearchBlock).toBeVisible();
        await searchPage.page.waitForTimeout(1000);
    });
 
    // test('Search-015 - Uncheck the "Advanced search" checkbox', async () => {
    //     await searchPage.uncheckAdvancedSearchCheckbox();
    //     await searchPage.page.waitForTimeout(1000);
 
    //     await expect(searchPage.advancedSearchCheckboxLabel).not.toBeChecked();
    //     await searchPage.page.waitForTimeout(1000);
 
    //     await expect(searchPage.advancedSearchBlock).not.toBeVisible();
    //     await searchPage.page.waitForTimeout(1000);
    // });
 
    test('Search-016 - Search by Category with a valid keyword including Automatically search sub categories', async () => {
        await searchPage.fillAdvancedSearchTerm("Nike");
 
        await searchPage.checkAdvancedSearchCheckbox();
 
        await searchPage.selectCategory("Apparel");
 
        await searchPage.checkSearchSubCategories();
        await searchPage.page.waitForTimeout(1000);
 
        await searchPage.clickAdvancedSearchSubmit();
        //except
        expect(await searchPage.getProductCount()).toBeGreaterThan(0);
 
        // check the product title contains the keyword
        const titles = await searchPage.getProductTitles();
        expect(titles.some(title => title.toLowerCase().includes('nike'))).toBeTruthy();
    });
 
    // test('Search-017 - Search by Category with a valid keyword', async () => {
    //     await searchPage.fillAdvancedSearchTerm("Nike");
 
    //     await searchPage.checkAdvancedSearchCheckbox();
 
    //     await searchPage.selectCategory("Apparel");
 
    //     await searchPage.clickAdvancedSearchSubmit();
    //     await searchPage.page.waitForTimeout(2000);
    //     //except
 
    //     expect(await searchPage.getProductCount()).toBeGreaterThan(0);
 
    //     // check the product title contains the keyword
    //     const titles = await searchPage.getProductTitles();
    //     expect(titles.some(title => title.toLowerCase().includes('nike'))).toBeTruthy();
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    // test('Search-018 - Search by Category without a keyword', async () => {
    //     await searchPage.fillAdvancedSearchTerm("");
 
    //     await searchPage.checkAdvancedSearchCheckbox();
 
    //     await searchPage.selectCategory("Apparel");
 
    //     await searchPage.clickAdvancedSearchSubmit();
    //     //except
 
    //     await expect(searchPage.warningMessage).toHaveText('Search term minimum length is 3 characters');
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    test('Search-019 - Search by Manufacturer with a valid keyword', async () => {
        await searchPage.fillAdvancedSearchTerm("Book");
 
        await searchPage.checkAdvancedSearchCheckbox();
 
        await searchPage.selectManufacturer("HP");
 
        await searchPage.clickAdvancedSearchSubmit();
        //except
 
        expect(await searchPage.getProductCount()).toBeGreaterThan(0);
 
        // check the product title contains the keyword
        const titles = await searchPage.getProductTitles();
        expect(titles.some(title => title.toLowerCase().includes('hp'))).toBeTruthy();
        expect(titles.some(title => title.toLowerCase().includes('book'))).toBeTruthy();
        await searchPage.page.waitForTimeout(2000);
    });
 
    // test('Search-020 - Search by Manufacturer without a keyword', async () => {
    //     await searchPage.fillAdvancedSearchTerm("");
 
    //     await searchPage.checkAdvancedSearchCheckbox();
 
    //     await searchPage.selectManufacturer("HP");
 
    //     await searchPage.clickAdvancedSearchSubmit();
    //     //except
 
    //     await expect(searchPage.warningMessage).toHaveText('Search term minimum length is 3 characters');
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    // test('Search-021 - Search by Category and Manufacturer with a valid keyword', async () => {
    //     await searchPage.fillAdvancedSearchTerm("Book");
 
    //     await searchPage.checkAdvancedSearchCheckbox();
 
    //     await searchPage.selectCategory("Computers >> Notebooks");
    //     await searchPage.selectManufacturer("HP");
 
    //     await searchPage.clickAdvancedSearchSubmit();
    //     //except
 
    //     expect(await searchPage.getProductCount()).toBeGreaterThan(0);
 
    //     // check the product title contains the keyword
    //     const titles = await searchPage.getProductTitles();
    //     expect(titles.some(title => title.toLowerCase().includes('hp'))).toBeTruthy();
    //     expect(titles.some(title => title.toLowerCase().includes('book'))).toBeTruthy();
    //     await searchPage.page.waitForTimeout(2000);
    // });
 
    test('Search-022 - Search by Category and Manufacturer without a keyword', async () => {
        await searchPage.fillAdvancedSearchTerm("");
 
        await searchPage.checkAdvancedSearchCheckbox();
 
        await searchPage.selectCategory("Computers >> Notebooks");
        await searchPage.selectManufacturer("HP");
 
        await searchPage.clickAdvancedSearchSubmit();
        //except
 
        await expect(searchPage.warningMessage).toHaveText('Search term minimum length is 3 characters');
        await searchPage.page.waitForTimeout(2000);
    });
});