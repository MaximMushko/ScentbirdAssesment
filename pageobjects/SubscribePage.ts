import {Page} from "@playwright/test";
import {Errors, Inputs, ItemType, SendWhen} from "../types/subscriptionData";

class SubscribePage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToPage(){
        await this.page.goto("https://www.scentbird.com/gift?months=6")
        await this.page.waitForLoadState();
    }

    getPageTitle(){
        return this.page.locator('text-sh3');
    }

    async selectItemType(itemType: ItemType){
        await this.page.getByTestId(itemType).click();
    }

    async specifyValueForInput(input: Inputs, value: string) {
        await this.page.getByTestId('recipientName').type(value);

    }

    async selectSendWhen(when: SendWhen) {
        await this.page.getByTestId(when).click();
    }

    async specifyDate(month: number, day: number, year: number){
        await this.page.getByTestId('dateMonth').click();
        await this.page.getByTestId('dateMonth').locator('option', { hasText: `${month}` }).click();

        await this.page.getByTestId('dateDay').click();
        await this.page.getByTestId('dateDay').locator('option', { hasText: `${day}` }).click();

        await this.page.getByTestId('dateYear').click();
        await this.page.getByTestId('dateYear').locator('option', { hasText: `${year}` }).click();
    }

    async getErrorMessage(error: Errors) {
        return this.page.getByTestId(error)
    }

    async clickOnPay() {
        await this.page.getByTestId('checkoutNowButton').click();
    }
 }

export default SubscribePage;