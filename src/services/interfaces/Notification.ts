import type { VPromise } from "../../utils/types/customPromises/VPromise"

export namespace NotificationStrategy{
    export enum NotificationStrategy {
        Email = "email",
        Slack = "slack",
        PhoneNotification = "phoneNotification",
        Unknown = "unknwon" 
    }

    export function fromString(s: string): NotificationStrategy{
        switch (s){
            case "email":
                return NotificationStrategy.Email
            case "slack":
                return NotificationStrategy.Slack
            case "phoneNotification":
                return NotificationStrategy.PhoneNotification
            default: 
                return NotificationStrategy.Unknown
        }
    }

}



export interface INotificationService{
    notify(username: string, notificationData: {
        strategy: NotificationStrategy.NotificationStrategy,
        message: string
    }): VPromise
}

