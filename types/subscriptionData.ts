export enum ItemType {
    COLOGNE = "recipientGenderOptionMale",
    PERFUME = "recipientGenderOptionFemale",
}

export enum SendWhen {
    NOW = "sendDateOptionNow",
    LATER = "sendDateOptionLater"
}

export enum Inputs {
    NAME= 'recipientName',
    EMAIL = 'recipientEmail',
    MESSAGE = 'recipientMessage',
    SENDER = 'senderName',
}

export type SubscriptionData = {
    itemType: ItemType,
    fullName: string,
    email: string,
    message: string,
    sender: string,
    sendWhen: SendWhen,
    date?: string| Date,
}

export enum Errors {
    NAME_ERROR = 'recipientNameError',
    EMAIL_ERROR = 'recipientEmailError',
    DATE_ERROR = 'dateError'
}