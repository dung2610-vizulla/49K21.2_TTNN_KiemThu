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
    // select option
    async selectOption(selector: Locator, value: string, elementName: string) {
        console.log(`Selecting "${value}" on element: ${elementName}`);
        await selector.selectOption(value);
    }
 
    // check checkbox / radio
    async checkElement(selector: Locator, elementName: string) {
        console.log(`Checking element: ${elementName}`);
        await selector.check();
    }
 
    // wait helper (kept only where the app genuinely needs it, e.g. dynamic attribute lists)
    async waitFor(selector: Locator, timeout = 60000) {
        await selector.waitFor({ state: 'visible', timeout });
    }
}