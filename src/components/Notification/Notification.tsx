import {Badge, Button, Dropdown, Flex, Space, Tag, Tooltip, Typography} from "../../bundles/AntD.tsx";
import {BellOutlined} from "../../bundles/Icons.tsx";
import React, {useEffect, useState} from "react";
import Pusher from "pusher-js";
import notification from "antd/lib/notification/index";
import {useDataStateContext} from "../../core/contextLib.ts";
import axios from "../../core/api.ts";
import {NotificationConstants} from "./NotificationUtil.ts";
import {AppAPI, AppUrlConstants} from "../../AppUtil.ts";
import {useNavigate} from "react-router-dom";

const Notification = () => {

    const [api, contextHolder] = notification.useNotification();
    const [items, setItems] = useState([]);
    const {state} = useDataStateContext();
    const navigate = useNavigate();

    const setNotificationToRead = (notificationId: number) => {
        AppAPI.makeRequest(AppUrlConstants.UPDATE, {
            context: 'notification_users',
            data: {read: 1},
            condition: {id: notificationId}
        }).then(() => {
            setItems(prev => {
                return prev.filter(i => i.id !== notificationId);
            });
        });
    }
    const fetchNotifications = () => {

        axios.get("/notifications").then((res: any) => {
            const items = res.map((item: any, index: number) => ({
                key: index,
                id: item.id,
                label: <>
                    <Flex justify={'space-between'} gap={5}>
                        <Flex>
                            <span><Tag style={{fontSize: '10px'}}
                                       color="#2db7f5">{NotificationConstants.type[item.type]}</Tag></span>
                            <span dangerouslySetInnerHTML={{ __html: item.message }} />
                        </Flex>
                        <Typography.Link strong onClick={() => setNotificationToRead(item.id)}>Mark as Read</Typography.Link>
                    </Flex>
                </>
            }));
            items.push({key: '-', label: <Flex justify={'center'}><Typography.Text strong onClick={() => navigate('/notifications')}>See All Notifications</Typography.Text></Flex>});
            setItems(items);
        })
    }

    useEffect(() => {
        fetchNotifications();
    }, [state.current_user]);

    useEffect(() => {
        // Pusher.logToConsole = true;
        const pusher = new Pusher(state.settings.app_key, {
            cluster: 'ap4'
        });
        const channel = pusher.subscribe('notifications');
        channel.bind('App\\Events\\NotificationEvent', function (notification: any) {
            api[notification.message.status]({
                message: notification.message.message,
                description: notification.message.description,
                closable: true
            });
            fetchNotifications();
        });
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);
    return (

        <>
            {contextHolder}
            <Tooltip title={'Notifications'}>
                <Button type={'default'} shape={'circle'}>
                    <Dropdown placement={'bottom'} trigger={["click"]}
                              menu={{items: items, theme: 'dark', style: {minWidth: '382px', maxWidth:'auto'}}}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Badge count={items.length > 0 ? items.length - 1 : 0} size={'small'}><BellOutlined/></Badge>
                            </Space>
                        </a>
                    </Dropdown>
                </Button>
            </Tooltip>
        </>
    )
}

export default Notification