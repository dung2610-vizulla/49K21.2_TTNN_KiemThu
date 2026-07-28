import { Page } from "@playwright/test";
import { BasePage } from "../pages/BasePages";
export class HomePage extends BasePage {
    readonly url = 'https://demo.nopcommerce.com/';
 
    readonly computersMenu = this.page.locator(".menu__link[href='/computers']");
    readonly apparelMenu = this.page.locator(".menu__link[href='/apparel']");
 
    constructor(page: Page) {
        super(page);
    }
 
    async gotoHome() {
        await this.goto(this.url);
    }
 
    async clickComputersMenu() {
        await this.clickElement(this.computersMenu, 'Computers menu');
        await this.page.waitForTimeout(1000);
    }
 
    async clickApparelMenu() {
        await this.clickElement(this.apparelMenu, 'Apparel menu');
        await this.page.waitForTimeout(1000);
    }
 
    // e.g. "Notebooks", "Clothing", "Shoes", "Desktops"
    subCategoryLink(categoryTitle: string) {
        return this.page.locator(`h2[class='title'] a[title='Show products in category ${categoryTitle}']`);
    }
 
    async clickSubCategory(categoryTitle: string) {
        await this.clickElement(this.subCategoryLink(categoryTitle), `${categoryTitle} sub-category`);
        await this.page.waitForTimeout(1000);
    }
 
    // e.g. "Jewelry", "Gift Cards", "Books"
    topMenuLink(name: string) {
        return this.page.locator(`//a[normalize-space()='${name}']`);
    }
 
    async clickTopMenuLink(name: string) {
        await this.clickElement(this.topMenuLink(name), `${name} top menu link`);
        await this.page.waitForTimeout(1000);
    }
 
    // Product listing -> product detail, matched by exact name
    productLinkByExactName(productName: string) {
        return this.page.locator(`//h2[@class='product-title']//a[normalize-space()='${productName}']`);
    }
 
    // Product listing -> product detail, matched by partial name
    productLinkByPartialName(productName: string) {
        return this.page.locator(`//h2[@class='product-title']//a[contains(text(),'${productName}')]`);
    }
 
    async openProductByExactName(productName: string) {
        await this.clickElement(this.productLinkByExactName(productName), `Product link: ${productName}`);
        await this.page.waitForTimeout(1000);
    }
 
    async openProductByPartialName(productName: string) {
        await this.clickElement(this.productLinkByPartialName(productName), `Product link: ${productName}`);
        await this.page.waitForTimeout(1000);
    }
}
 