import { Page } from "@playwright/test";
import { BasePage } from "../pages/BasePages";
 
export class ShoppingCartPage extends BasePage {
    readonly checkoutAttributeGiftWrapping = this.page.locator('#checkout_attribute_1');
    readonly selectedCheckoutAttributes = this.page.locator('.selected-checkout-attributes');
 
    constructor(page: Page) {
        super(page);
    }
 
    // Row in the cart table that contains a given product name
    productRow(productName: string) {
        return this.page.locator('tr').filter({
            has: this.page.locator('a', { hasText: productName }),
        });
    }
 
    quantityInputInRow(productName: string) {
        return this.productRow(productName).locator('input.qty-input');
    }
 
    subtotalInRow(productName: string) {
        return this.productRow(productName).locator('.subtotal');
    }
 
    rowErrorMessage(productName: string) {
        return this.productRow(productName).locator("div[class='message-error'] ul li");
    }
 
    // Used to assert a product no longer appears in the cart
    productLinkCount(productName: string) {
        return this.page.locator('td.product a', { hasText: productName });
    }
 
    async updateQuantity(productName: string, quantity: string) {
        const quantityInput = this.quantityInputInRow(productName);
        await this.inputText(quantityInput, quantity, `Quantity input for ${productName}`);
        await this.page.keyboard.press('Enter');
    }
 
    async selectGiftWrapping(option: string) {
        await this.waitFor(this.checkoutAttributeGiftWrapping);
        await this.page.waitForTimeout(1000);
        await this.checkoutAttributeGiftWrapping.scrollIntoViewIfNeeded();
        await this.selectOption(this.checkoutAttributeGiftWrapping, option, 'Gift wrapping checkout attribute');
        await this.page.waitForTimeout(2000);
    }
}