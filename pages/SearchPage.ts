import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePages";
 
export class SearchPage extends BasePage {
 
    // Locators
    readonly quickSearchInput: Locator;
    readonly quickSearchSubmitButton: Locator;
 
    readonly advancedSearchInput: Locator;      // #q
    readonly advancedSearchSubmitButton: Locator; // button[class='button-1 search-button']
 
    readonly advancedSearchCheckboxLabel: Locator; // label[for='advs']
    readonly advancedSearchBlock: Locator;          // #advanced-search-block
 
    readonly categorySelect: Locator;   // #cid
    readonly manufacturerSelect: Locator; // #mid
    readonly searchSubCategoriesCheckboxLabel: Locator; // label[for='isc']
 
    readonly warningMessage: Locator;   // .warning
    readonly noResultMessage: Locator;  // .no-result
    readonly productItems: Locator;     // .product-item
    readonly productTitles: Locator;    // .product-title
 
    constructor(page: Page) {
        super(page);
 
        this.quickSearchInput = this.page.locator('#small-searchterms');
        this.quickSearchSubmitButton = this.page.locator("//button[@class='button-1 search-box-button']");
 
        this.advancedSearchInput = this.page.locator('#q');
        this.advancedSearchSubmitButton = this.page.locator(" //button[@class='button-1 search-button']");
 
        this.advancedSearchCheckboxLabel = this.page.locator("//input[@id='advs']");
        this.advancedSearchBlock = this.page.locator("#advanced-search-block");
 
        this.categorySelect = this.page.locator("select#cid");
        this.manufacturerSelect = this.page.locator("select#mid");
        this.searchSubCategoriesCheckboxLabel = this.page.locator("label[for='isc']");
 
        this.warningMessage = this.page.locator(".warning");
        this.noResultMessage = this.page.locator(".no-result");
        this.productItems = this.page.locator(".product-item");
        this.productTitles = this.page.locator(".product-title");
    }
 
    // ---- Quick search (header search box) ----
    async fillQuickSearchTerm(keyword: string) {
        await this.inputText(this.quickSearchInput, keyword, "Quick search term");
    }
 
    async clickQuickSearchSubmit() {
        await this.quickSearchSubmitButton.scrollIntoViewIfNeeded();
        await this.clickElement(this.quickSearchSubmitButton, "Quick search submit button");
    }
 
    async searchQuick(keyword: string) {
        await this.fillQuickSearchTerm(keyword);
        await this.clickQuickSearchSubmit();
    }
 
    // helper for the empty-keyword quick search case which can trigger a native dialog
    async acceptNextDialog() {
        this.page.once('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });
    }
 
    // ---- Advanced search page (/search) ----
    async fillAdvancedSearchTerm(keyword: string) {
        await this.inputText(this.advancedSearchInput, keyword, "Advanced search term");
    }
 
    async clickAdvancedSearchSubmit() {
        await this.clickElement(this.advancedSearchSubmitButton, "Advanced search submit button");
    }
 
    async searchAdvanced(keyword: string) {
        await this.fillAdvancedSearchTerm(keyword);
        await this.clickAdvancedSearchSubmit();
    }
 
    async checkAdvancedSearchCheckbox() {
        await this.checkElement(this.advancedSearchCheckboxLabel, "Advanced search checkbox");
    }
 
    async uncheckAdvancedSearchCheckbox() {
        console.log("Unchecking element: Advanced search checkbox");
        await this.advancedSearchCheckboxLabel.uncheck();
    }
 
    async checkSearchSubCategories() {
        await this.checkElement(this.searchSubCategoriesCheckboxLabel, "Automatically search sub categories checkbox");
    }
 
    // async selectCategory(label: string) {
    //     console.log(`Selecting category: ${label}`);
    //     await this.waitFor(this.categorySelect);
    //     await this.categorySelect.scrollIntoViewIfNeeded();
    //     await this.page.selectOption(this.categorySelect, { label });
    // }
 
    // async selectManufacturer(label: string) {
    //     console.log(`Selecting manufacturer: ${label}`);
    //     await this.waitFor(this.manufacturerSelect);
    //     await this.manufacturerSelect.scrollIntoViewIfNeeded();
    //     await this.page.selectOption(this.manufacturerSelect, { label });
    // }
    async selectCategory(label: string) {
    console.log(`Selecting category: ${label}`);
    await this.waitFor(this.categorySelect);
    await this.categorySelect.scrollIntoViewIfNeeded();
    await this.categorySelect.selectOption({ label });
}

async selectManufacturer(label: string) {
    console.log(`Selecting manufacturer: ${label}`);
    await this.waitFor(this.manufacturerSelect);
    await this.manufacturerSelect.scrollIntoViewIfNeeded();
    await this.manufacturerSelect.selectOption({ label });
}
 
    // ---- Assertions helpers (return data, spec files keep the `expect`) ----
    async getWarningText() {
        return this.warningMessage;
    }
 
    async getNoResultLocator() {
        return this.noResultMessage;
    }
 
    async getProductCount() {
        return this.productItems.count();
    }
 
    async getProductTitles() {
        return this.productTitles.allTextContents();
    }
}