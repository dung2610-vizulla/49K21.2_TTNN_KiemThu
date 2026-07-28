import { Page } from "@playwright/test";
import { BasePage } from "../pages/BasePages";
 
export class ProductPage extends BasePage {
    // Shared notification / validation message areas
    readonly successNotification = this.page.locator(".bar-notification.success");
    readonly contentMessage = this.page.locator(".content");
 
    // Navigation shortcuts available from the product detail page (header)
    readonly cartLabel = this.page.locator(".cart-label");
    readonly wishlistLabel = this.page.locator(".wishlist-label");
 
    constructor(page: Page) {
        super(page);
    }
 
    // ---------- Quantity / Add to cart ----------
    quantityInput(productId: string | number) {
        return this.page.locator(`#product_enteredQuantity_${productId}`);
    }
 
    addToCartButton(productId: string | number) {
        return this.page.locator(`#add-to-cart-button-${productId}`);
    }
 
    async enterQuantity(productId: string | number, quantity: string) {
        await this.inputText(this.quantityInput(productId), quantity, `Quantity input for product ${productId}`);
    }
 
    async clickAddToCart(productId: string | number) {
        await this.clickElement(this.addToCartButton(productId), `Add to cart button for product ${productId}`);
    }
 
    async addProductToCart(productId: string | number, quantity: string) {
        await this.enterQuantity(productId, quantity);
        await this.clickAddToCart(productId);
    }
 
    // ---------- Attribute selects (dropdowns), e.g. Size, Color, Processor, RAM ----------
    attributeSelect(attributeId: string | number) {
        return this.page.locator(`#product_attribute_${attributeId}`);
    }
 
    async selectAttribute(attributeId: string | number, value: string) {
        const select = this.attributeSelect(attributeId);
        await this.waitFor(select);
        await this.page.waitForTimeout(1000);
        await select.scrollIntoViewIfNeeded();
        await this.selectOption(select, value, `Attribute select #${attributeId}`);
        await this.page.waitForTimeout(1000);
    }
 
    // ---------- Attribute options rendered as radio/checkbox labels (e.g. HDD, OS) ----------
    attributeLabel(productAttributeId: string | number, valueId: string | number) {
        return this.page.locator(`label[for='product_attribute_${productAttributeId}_${valueId}']`);
    }
 
    async clickAttributeLabel(productAttributeId: string | number, valueId: string | number) {
        await this.clickElement(
            this.attributeLabel(productAttributeId, valueId),
            `Attribute label ${productAttributeId}_${valueId}`
        );
    }
 
    async checkAttributeLabel(productAttributeId: string | number, valueId: string | number) {
        await this.checkElement(
            this.attributeLabel(productAttributeId, valueId),
            `Attribute label ${productAttributeId}_${valueId}`
        );
    }
 
    // ---------- Attribute options rendered as color/print squares ----------
    attributeSquare(productAttributeId: string | number, valueId: string | number) {
        return this.page.locator(
            `//label[@for='product_attribute_${productAttributeId}_${valueId}']//span[@class='attribute-square']`
        );
    }
 
    async checkAttributeSquare(productAttributeId: string | number, valueId: string | number) {
        await this.checkElement(this.attributeSquare(productAttributeId, valueId),
            `Attribute square ${productAttributeId}_${valueId}`
        );
    }
 
    // ---------- Free-text attribute (e.g. "Enter your text") ----------
    async enterCustomText(attributeId: string | number, text: string) {
        await this.inputText(this.attributeSelect(attributeId), text, `Custom text attribute #${attributeId}`);
    }
 
    // ---------- Rental products ----------
    rentalStartDateInput(productId: string | number) {
        return this.page.locator(`#rental_start_date_${productId}`);
    }
 
    rentalEndDateInput(productId: string | number) {
        return this.page.locator(`#rental_end_date_${productId}`);
    }
 
    async fillRentalStartDate(productId: string | number, date: string) {
        await this.inputText(this.rentalStartDateInput(productId), date, `Rental start date for product ${productId}`);
    }
 
    async fillRentalEndDate(productId: string | number, date: string) {
        await this.inputText(this.rentalEndDateInput(productId), date, `Rental end date for product ${productId}`);
    }
 
    // ---------- Gift card products ----------
    giftCardField(productId: string | number, field: 'RecipientName' | 'RecipientEmail' | 'SenderName' | 'SenderEmail') {
        return this.page.locator(`#giftcard_${productId}_${field}`);
    }
 
    async fillGiftCardInfo(
        productId: string | number,
        recipientName: string,
        recipientEmail: string,
        senderName: string,
        senderEmail: string
    ) {
        await this.inputText(this.giftCardField(productId, 'RecipientName'), recipientName, 'Recipient name');
        await this.inputText(this.giftCardField(productId, 'RecipientEmail'), recipientEmail, 'Recipient email');
        await this.inputText(this.giftCardField(productId, 'SenderName'), senderName, 'Sender name');
        await this.inputText(this.giftCardField(productId, 'SenderEmail'), senderEmail, 'Sender email');
    }
 
    // ---------- Wishlist ----------
    wishlistButton(productId: string | number) {
        return this.page.locator(`#add-to-wishlist-button-${productId}`);
    }
 
    async addToWishlist(productId: string | number) {
        await this.clickElement(this.wishlistButton(productId), `Add to wishlist button for product ${productId}`);
    }
 
    // ---------- Header navigation shortcuts ----------
    async goToCart() {
        await this.clickElement(this.cartLabel, 'Cart label');
    }
 
    async goToWishlist() {
        await this.clickElement(this.wishlistLabel, 'Wishlist label');
    }
}