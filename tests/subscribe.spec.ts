import {expect, test} from '@playwright/test';
import SubscribePage from "../pageobjects/SubscribePage";
import CheckoutPage from "../pageobjects/CheckoutPage"
import SubscriptionAction from "../actions/subscriptionAction";
import {Errors, Inputs, ItemType, SendWhen} from "../types/subscriptionData";

let page;
let subscribePage;
let checkoutPage;
let subscribePageActions;

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
    subscribePageActions = new SubscriptionAction(subscribePage);
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
    await subscribePageActions.fillSubscriptionForm({
        itemType: ItemType.COLOGNE,
        fullName: testData.name,
        email: testData.email,
        message: testData.message,
        sender: testData.sender,
        sendWhen: SendWhen.NOW
    });

    await expect(checkoutPage.getPageTitle()).toHaveText(expectedMessages.checkoutMessage);
});

test('Select Perfume', async() => {
    await subscribePageActions.fillSubscriptionForm({
        itemType: ItemType.PERFUME,
        fullName: testData.name,
        email: testData.email,
        message: testData.message,
        sender: testData.sender,
        sendWhen: SendWhen.NOW
    });

    await expect(checkoutPage.getPageTitle()).toHaveText(expectedMessages.checkoutMessage);
})

test('Select Cologne/Perfume for a later date', async () =>{
    await subscribePageActions.fillSubscriptionForm({
        itemType: ItemType.PERFUME,
        fullName: testData.name,
        email: testData.email,
        message: testData.message,
        sender: testData.sender,
        sendWhen: SendWhen.LATER,
        date: testData.futureDate
    });

    await expect(checkoutPage.getPageTitle()).toHaveText(expectedMessages.checkoutMessage);
})

test('Select Cologne/Perfume without a message', async () => {
    await subscribePageActions.fillSubscriptionForm({
        itemType: ItemType.PERFUME,
        fullName: testData.name,
        email: testData.email,
        message: "",
        sender: testData.sender,
        sendWhen: SendWhen.NOW,
    });

    await expect(checkoutPage.getPageTitle()).toHaveText(expectedMessages.checkoutMessage);
})

test('Select Cologne/Perfume without Who is it from?', async() => {
    await subscribePageActions.fillSubscriptionForm({
        itemType: ItemType.COLOGNE,
        fullName: testData.name,
        email: testData.email,
        message: testData.message,
        sender: "",
        sendWhen: SendWhen.NOW,
    });

    await expect(checkoutPage.getPageTitle()).toHaveText(expectedMessages.checkoutMessage);
})

test('Negative - no receipt name', async () => {
    await subscribePageActions.fillSubscriptionForm({
        itemType: ItemType.PERFUME,
        fullName: "",
        email: testData.email,
        message: testData.message,
        sender: testData.sender,
        sendWhen: SendWhen.NOW,
    });

    await subscribePage.getErrorMessage(Errors.NAME_ERROR).toBeVisible();
    await subscribePage.getErrorMessage(Errors.NAME_ERROR).toHaveText(expectedMessages.requiredFieldMessage);
})

test('Negative - no email', async () => {
    await subscribePageActions.fillSubscriptionForm({
        itemType: ItemType.COLOGNE,
        fullName: testData.name,
        email: "",
        message: testData.message,
        sender: testData.sender,
        sendWhen: SendWhen.NOW,
    });

    await subscribePage.getErrorMessage(Errors.EMAIL_ERROR).toBeVisible();
    await subscribePage.getErrorMessage(Errors.EMAIL_ERROR).toHaveText(expectedMessages.requiredFieldMessage);
});

test('Negative - wrong email format', async () => {
    await subscribePageActions.fillSubscriptionForm({
        itemType: ItemType.COLOGNE,
        fullName: testData.name,
        email: testData.wrongFormatEmail,
        message: testData.message,
        sender: testData.sender,
        sendWhen: SendWhen.NOW,
    });

    await subscribePage.getErrorMessage(Errors.EMAIL_ERROR).toBeVisible();
    await subscribePage.getErrorMessage(Errors.EMAIL_ERROR).toHaveText(expectedMessages.wrongEmailFormatMessage);
})

test('Negative - Send Later for a today\'s date', async () => {
    await subscribePageActions.fillSubscriptionForm({
        itemType: ItemType.COLOGNE,
        fullName: testData.name,
        email: testData.email,
        message: testData.message,
        sender: testData.sender,
        sendWhen: SendWhen.LATER,
        date: new Date()
    });

    await subscribePage.getErrorMessage(Errors.DATE_ERROR).toHaveText(expectedMessages.wrongDateMessage)
})

test('Negative - Send Later for a past date', async () => {
    await subscribePageActions.fillSubscriptionForm({
        itemType: ItemType.COLOGNE,
        fullName: testData.name,
        email: testData.email,
        message: testData.message,
        sender: testData.sender,
        sendWhen: SendWhen.LATER,
        date: testData.pastDate
    });

    await subscribePage.getErrorMessage(Errors.DATE_ERROR).toHaveText(expectedMessages.wrongDateMessage)
})