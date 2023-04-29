import {Page} from "@playwright/test";

class CheckoutPage {
    private readonly page: Page;
    constructor(page: Page) {
        this.page = page
    }

    getPageTitle() {
        this.page.getByTestId("title");
    }
}

export default CheckoutPage;