import { Locator, Page } from "@playwright/test";

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // goto
    async goto(url: string) {
        console.log(`Navigating to ${url}`);
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    }

    // getTitle
    async getTitle() {
        console.log('Getting title');
        return this.page.title();
    }

    // click element
    async clickElement(selector: Locator, elementName: string) {
        console.log(`Clicking element: ${elementName}`);
        await selector.click();
    }

    // input text
    async inputText(selector: Locator, text: string, elementName: string) {
        console.log(`Inputting ${text} into element: ${elementName}`);
        await selector.fill(text);
    }
}