import type { VPromise } from "../../utils/types/customPromises/VPromise";
import type { INotificationService, NotificationStrategy } from "../interfaces/Notification";

export class NotificationService implements INotificationService {
    async notify(username: string, notificationData: { strategy: NotificationStrategy.NotificationStrategy; message: string; }): VPromise {
        return await (() => {
            console.log(`Sending notification to ${username} with message: ${notificationData.message} using strategy ${notificationData.strategy}`)
        })()
    }
}
