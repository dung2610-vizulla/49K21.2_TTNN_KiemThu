import { Page } from "@playwright/test";
import { BasePage } from "../pages/BasePages";
 
export class WishListPage extends BasePage {
    readonly addToCartCheckbox = this.page.locator("input[name='addtocart']");
    readonly addToCartButton = this.page.locator("button[name='addtocartbutton']");
    readonly pageTitle = this.page.locator("div[class='page-title'] h1");
    readonly contentMessage = this.page.locator('.content');
 
    constructor(page: Page) {
        super(page);
    }
 
    async checkAddToCart() {
        await this.checkElement(this.addToCartCheckbox, 'Add to cart checkbox (wishlist)');
    }
 
    async clickAddToCartButton() {
        await this.clickElement(this.addToCartButton, 'Add selected to cart button (wishlist)');
    }
}
 