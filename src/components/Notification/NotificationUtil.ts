import axios from "../../core/api.ts";

export interface NotificationMessage {
    status: string;
    message: string;
    description: string;
    duration?: number;
    type: string;

}
export const NotificationConstants = {
    type: {
        NEW_USER: 'USER',
        NEW_CLIENT: 'CLIENT',
        APPLICATION: 'NEW_APPLICATION',
        NEW_APPLICATION: 'NEW_APPLICATION',
        CLIENT: 'CLIENT',
        DOCUMENT: 'DOCUMENT',
    }
}

export const saveNotification = (props: NotificationMessage) => {

    axios.post("/notifications/send-notification", props).then(() => console.log('Notification Sent'));
}

export const notification = {
    send: (props: NotificationMessage) => saveNotification(props)
};