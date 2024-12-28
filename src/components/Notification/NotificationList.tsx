import ContentLayout from "../Layouts/ContentLayout.tsx";
import {FC, useEffect, useState} from "react";
import {BellOutlined} from "../../bundles/Icons.tsx";
import {List, Tag} from "../../bundles/AntD.tsx";
import {AppAPI, AppUrlConstants} from "../../AppUtil.ts";
import {useDataStateContext} from "../../core/contextLib.ts";
import {NotificationConstants} from "./NotificationUtil.ts";
import {ComponentInfo, DataStatus} from "../Status/Status.tsx";

const NotificationList: FC<any> = () => {

    const [notificationList, setNotificationList] = useState([]);
    const {state} = useDataStateContext();
    const [componentState, setComponentState] = useState<ComponentInfo>({
        status: DataStatus.Loaded,
        callback: () => fetchNotifications()
    });

    const fetchNotifications = async () => {
        setComponentState(prev => ({...prev, status: DataStatus.Loading}));
        try {
            await AppAPI.makeRequest(AppUrlConstants.UPDATE, {
                context: 'notification_users',
                condition: {user_id: state.current_user.id},
                data: {read: true}
            });
            const notification: any = await AppAPI.makeRequest(AppUrlConstants.FETCH, {
                context: 'notifications',
                fields: ['*']
            });
            let userNotifications: any = await AppAPI.makeRequest(AppUrlConstants.FETCH, {
                context: 'notification_users',
                fields: ['*'],
                condition: {user_id: state.current_user.id}
            });
            userNotifications = userNotifications.map(item => ({
                ...item,
                title: notification.find(i => i.id === item.notification_id).message,
                type: notification.find(i => i.id === item.notification_id).type,
            }));
            setNotificationList(userNotifications);
            setComponentState(prev => ({...prev, status: DataStatus.Loaded }));
        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        fetchNotifications();
    }, []);
    return <ContentLayout contentTitle={<h4><BellOutlined/> Notification List</h4>}>
        <List
            pagination={{ position: 'bottom', align: 'center' }}
            dataSource={notificationList}
            loading={componentState.status === DataStatus.Loading}
            renderItem={(item: any, index) => (
                <List.Item>
                    <List.Item.Meta
                        key={index}
                        title={<Tag style={{fontSize: '10px'}}
                                    color="#2db7f5">{NotificationConstants.type[item.type]}</Tag>}
                        description={item.title}
                    />
                </List.Item>
            )}
        />
    </ContentLayout>
}

export default NotificationList;