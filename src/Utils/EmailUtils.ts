import {message} from "../bundles/AntD.tsx";
import {AppAPI} from "../AppUtil.ts";

export interface IEmailSend {
    subject: string;
    message: string;
    attachments?: string[];
    client_id?: number
}
export const sendEmailNotification = (attributes: IEmailSend) => {
    const loading = message.loading("Sending Email. Please wait.." ,0);
    AppAPI.apiRequest('/mail/send-user', {
        subject: attributes.subject,
        message: attributes.message,
        attachments: attributes.attachments || []
    }).then(() => {
        message.success("Email sent.");
    }).finally(() => loading());
}

export const sendClientEmailNotification = (attributes: IEmailSend) => {
    const loading = message.loading("Sending Email. Please wait.." ,0);
    AppAPI.apiRequest('/mail/send-client', {
        client_id: attributes.client_id,
        subject: attributes.subject,
        message: attributes.message,
        attachments: attributes.attachments || []
    }).then(() => {
        message.success("Email sent.");
    }).finally(() => loading());
}

