import {expect, test} from '@playwright/test';
import SubscribePage, {Errors, Inputs, ItemType, SendWhen} from "../pageobjects/SubscribePage";
import CheckoutPage from "../pageobjects/CheckoutPage"

let page;
let subscribePage;
let checkoutPage;

const expectedTitle = '6 months gift subscription ($89)\n + 1 fragrance for you';

const testData = {
    name: "Test Test",
    email: "test@gmail.com",
    message: "Hello, this is the test message",
    sender: "Maxim Mushko",
    wrongFormatEmail: "wrongemailformat",
    futureDate: "2023-12-01",
    pastDate: "2023-01-01"
}

const expectedMessages = {
    checkoutMessage:  "Your cart total - $89.00",
    requiredFieldMessage: "Required",
    wrongEmailFormatMessage: "Valid email address required",
    wrongDateMessage: "Date must be in the future"
}

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    subscribePage = new SubscribePage(page);
    checkoutPage = new CheckoutPage(page)
});

test.afterAll(async () => {
    await page.close();
});

test.beforeEach(async () => {
    await subscribePage.goToPage();
});

test('Should have title', async ( {page}) => {
    await expect(subscribePage.getPageTitle()).toHaveText(expectedTitle)
});

test('Select Cologne', async () => {
    await subscribePage.selectItemType(ItemType.COLOGNE);

    await subscribePage.specifyValueForInput(Inputs.NAME, testData.name)
    await subscribePage.specifyValueForInput(Inputs.EMAIL, testData.email)
    await subscribePage.specifyValueForInput(Inputs.MESSAGE, testData.message)
    await subscribePage.specifyValueForInput(Inputs.SENDER, testData.sender)
    await subscribePage.selectSendWhen(SendWhen.NOW);
    await subscribePage.clickOnPay();

    await expect(checkoutPage.getPageTitle()).toHaveText(expectedMessages.checkoutMessage);
});

test('Select Perfume', async() => {
    await subscribePage.selectItemType(ItemType.PERFUME);

    await subscribePage.specifyValueForInput(Inputs.NAME, testData.name)
    await subscribePage.specifyValueForInput(Inputs.EMAIL, testData.email)
    await subscribePage.specifyValueForInput(Inputs.MESSAGE, testData.message)
    await subscribePage.specifyValueForInput(Inputs.SENDER, testData.sender)
    await subscribePage.selectSendWhen(SendWhen.NOW);
    await subscribePage.clickOnPay();

    await expect(checkoutPage.getPageTitle()).toHaveText(expectedMessages.checkoutMessage);
})

test('Select Cologne/Perfume for a later date', async () =>{
    const date = new Date(testData.futureDate);
    await subscribePage.selectItemType(ItemType.PERFUME);

    await subscribePage.specifyValueForInput(Inputs.NAME, testData.name);
    await subscribePage.specifyValueForInput(Inputs.EMAIL, testData.email);
    await subscribePage.specifyValueForInput(Inputs.MESSAGE, testData.message);
    await subscribePage.specifyValueForInput(Inputs.SENDER, testData.sender);
    await subscribePage.selectSendWhen(SendWhen.LATER);

    await subscribePage.specifyDate(date.getMonth(), date.getDay(), date.getFullYear());
    await subscribePage.clickOnPay();

    await expect(checkoutPage.getPageTitle()).toHaveText(expectedMessages.checkoutMessage);
})

test('Select Cologne/Perfume without a message', async () => {
    await subscribePage.selectItemType(ItemType.PERFUME);

    await subscribePage.specifyValueForInput(Inputs.NAME, testData.name);
    await subscribePage.specifyValueForInput(Inputs.EMAIL, testData.email);
    await subscribePage.specifyValueForInput(Inputs.SENDER, testData.sender);
    await subscribePage.selectSendWhen(SendWhen.NOW);
    await subscribePage.clickOnPay();

    await expect(checkoutPage.getPageTitle()).toHaveText(expectedMessages.checkoutMessage);
})

test('Select Cologne/Perfume without Who is it from?', async() => {
    await subscribePage.selectItemType(ItemType.COLOGNE);

    await subscribePage.specifyValueForInput(Inputs.NAME, testData.name);
    await subscribePage.specifyValueForInput(Inputs.EMAIL, testData.email);
    await subscribePage.specifyValueForInput(Inputs.MESSAGE, testData.message);
    await subscribePage.selectSendWhen(SendWhen.NOW);
    await subscribePage.clickOnPay();

    await expect(checkoutPage.getPageTitle()).toHaveText(expectedMessages.checkoutMessage);
})

test('Negative - no receipt name', async () => {
    await subscribePage.selectItemType(ItemType.PERFUME);

    await subscribePage.specifyValueForInput(Inputs.EMAIL, testData.email);
    await subscribePage.specifyValueForInput(Inputs.MESSAGE, testData.message);
    await subscribePage.specifyValueForInput(Inputs.SENDER, testData.sender);
    await subscribePage.selectSendWhen(SendWhen.NOW);
    await subscribePage.clickOnPay();

    await subscribePage.getErrorMessage(Errors.NAME_ERROR).toBeVisible();
    await subscribePage.getErrorMessage(Errors.NAME_ERROR).toHaveText(expectedMessages.requiredFieldMessage);
})

test('Negative - no email', async () => {
    await subscribePage.selectItemType(ItemType.COLOGNE);

    await subscribePage.specifyValueForInput(Inputs.NAME, testData.name);
    await subscribePage.specifyValueForInput(Inputs.MESSAGE, testData.message);
    await subscribePage.specifyValueForInput(Inputs.SENDER, testData.sender);
    await subscribePage.selectSendWhen(SendWhen.NOW);
    await subscribePage.clickOnPay();

    await subscribePage.getErrorMessage(Errors.EMAIL_ERROR).toBeVisible();
    await subscribePage.getErrorMessage(Errors.EMAIL_ERROR).toHaveText(expectedMessages.requiredFieldMessage);
});

test('Negative - wrong email format', async () => {
    await subscribePage.selectItemType(ItemType.PERFUME);

    await subscribePage.specifyValueForInput(Inputs.NAME, testData.name);
    await subscribePage.specifyValueForInput(Inputs.EMAIL, testData.wrongFormatEmail);
    await subscribePage.specifyValueForInput(Inputs.MESSAGE, testData.message);
    await subscribePage.specifyValueForInput(Inputs.SENDER, testData.sender);
    await subscribePage.selectSendWhen(SendWhen.NOW);
    await subscribePage.clickOnPay();

    await subscribePage.getErrorMessage(Errors.EMAIL_ERROR).toBeVisible();
    await subscribePage.getErrorMessage(Errors.EMAIL_ERROR).toHaveText(expectedMessages.wrongEmailFormatMessage);
})

test('Negative - Send Later for a today\'s date', async () => {
    const today = new Date();
    await subscribePage.selectItemType(ItemType.COLOGNE);

    await subscribePage.specifyValueForInput(Inputs.NAME, testData.name);
    await subscribePage.specifyValueForInput(Inputs.EMAIL, testData.email);
    await subscribePage.specifyValueForInput(Inputs.MESSAGE, testData.message);
    await subscribePage.specifyValueForInput(Inputs.SENDER, testData.sender);
    await subscribePage.selectSendWhen(SendWhen.LATER);

    await subscribePage.specifyDate(today.getMonth(), today.getDay(), today.getFullYear());
    await subscribePage.clickOnPay();

    await subscribePage.getErrorMessage(Errors.DATE_ERROR).toHaveText(expectedMessages.wrongDateMessage)
})

test('Negative - Send Later for a past date', async () => {
    const pastDate = new Date(testData.pastDate);
    await subscribePage.selectItemType(ItemType.PERFUME);

    await subscribePage.specifyValueForInput(Inputs.NAME, testData.name);
    await subscribePage.specifyValueForInput(Inputs.EMAIL, testData.email);
    await subscribePage.specifyValueForInput(Inputs.MESSAGE, testData.message);
    await subscribePage.specifyValueForInput(Inputs.SENDER, testData.sender);
    await subscribePage.selectSendWhen(SendWhen.LATER);

    await subscribePage.specifyDate(pastDate.getMonth(), pastDate.getDay(), pastDate.getFullYear());
    await subscribePage.clickOnPay();

    await subscribePage.getErrorMessage(Errors.DATE_ERROR).toHaveText(expectedMessages.wrongDateMessage)
})