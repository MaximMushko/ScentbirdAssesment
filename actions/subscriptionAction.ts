import {Inputs, ItemType, SendWhen, SubscriptionData} from "../types/subscriptionData";
import SubscribePage from "../pageobjects/SubscribePage";
import {Page} from "@playwright/test";


export default class SubscriptionAction {
    private subscribePage: SubscribePage;

    constructor(page: SubscribePage) {
        this.subscribePage = page;
    }

    async fillSubscriptionForm(subscriptionData: SubscriptionData){
        await this.subscribePage.selectItemType(subscriptionData.itemType);

        await this.subscribePage.specifyValueForInput(Inputs.NAME, subscriptionData.fullName)
        await this.subscribePage.specifyValueForInput(Inputs.EMAIL, subscriptionData.email)
        await this.subscribePage.specifyValueForInput(Inputs.MESSAGE, subscriptionData.message)
        await this.subscribePage.specifyValueForInput(Inputs.SENDER, subscriptionData.sender)
        await this.subscribePage.selectSendWhen(subscriptionData.sendWhen);
        if(subscriptionData.date){
            const date = new Date(subscriptionData.date);
            await this.subscribePage.specifyDate(date.getMonth(), date.getDay(), date.getFullYear());
        }
        await this.subscribePage.clickOnPay();
    }
}