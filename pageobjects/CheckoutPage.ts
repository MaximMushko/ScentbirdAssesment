import {Page} from "@playwright/test";

class CheckoutPage {
    private readonly page: Page;
    constructor(page: Page) {
        this.page = page
    }

    getPageTitle() {
        return this.page.getByTestId("title");
    }

    getCheckoutButton() {
        return this.page.getByTestId("modalPrimaryButton");
    }
}

export default CheckoutPage;