import React, {FC} from "react";
import './Layouts.css';
import withStyles from "react-jss";
import {Button, Drawer, Dropdown, Flex, Layout, message, Select, Space} from "../../bundles/AntD.tsx";
import {
    LogoutOutlined,
    MenuOutlined,
    MenuUnfoldOutlined,
    MoonOutlined,
    SunOutlined,
    UserOutlined
} from "../../bundles/Icons.tsx";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import NavigationMenu from "./NavigationMenu.tsx";
import Notification from "../Notification/Notification.tsx";
import {useNavigate} from "react-router-dom";

const styles = {
    headerContainer: {
        display: 'flex', alignItems: 'center',
        padding: 0,
        justifyContent: 'space-between',
        paddingRight: '1rem'
    },
    drawerStyles: {
        mask: {
            backdropFilter: 'blur(10px)',
        },
        content: {
            boxShadow: '-10px 0 10px #666',
        }
    },
}

const MainLayout: FC<any> = ({
                                 classes,
                                 children,
                                 state,
                                 setState,
                                 ui,
                                 setUI,
                                 appLoaded,
                                 userHasAuthenticated,
                                 setPreLoader,
                                 theme
                             }) => {

    const breakPoint = useBreakpoint();
    const navigate = useNavigate();

    const {Header, Sider, Content} = Layout;
    const {token: {colorBgContainer, borderRadiusLG}} = theme;
    const authUser: { [key: string]: any } = state.users.find((item: any) => item.id === state.authId);

    const toggleTheme = (theme: boolean) => setUI({...ui, darkTheme: theme});

    const switchLoggedInUser = async (userId: any) => {
        const toast = message.loading("Switching user. Please wait..", 0);
        const id = (userId || state.authId);
        setPreLoader(true);
        try {
            const user: any = {};
            const newState = {...state};
            const {password, ...obj} = user;
            newState.current_user = obj;
            setState(newState);
        } catch (err: any) {
            message.error(err.response.data.message);
        } finally {
            toast();
            setPreLoader(false);
        }
    }

    const handleMenuClick = async (val: any) => {
        if (val.key === 'logout') {
            const toast = message.loading("Logging out..", 0);
            try {
                setPreLoader(true);
                localStorage.removeItem("token");
                const newState = {...state};
                newState.current_user = null;
                setState(newState);
                userHasAuthenticated(false);
                message.success("Logged out successfully");
            } catch (e) {
                message.error("Failed to logout. Please try again...");
            } finally {
                toast();
                setPreLoader(false);
            }
        } else if (val.key === 'profile') {
            navigate('/user-profilvm use 14' +
                'e');
        }
    }

    return <Layout hasSider={true} className={'app-layout--height'}>
        {
            (breakPoint.md || breakPoint.lg || breakPoint.xl || breakPoint.xxl) ?
                <Sider breakpoint={'lg'}
                       style={{overflow: 'auto', height: '100%', position: 'fixed'}}
                       width={breakPoint.lg ? '250px' : '250px'}
                       theme={ui.darkTheme ? 'dark' : 'light'} collapsible={true} trigger={null}
                       collapsed={
                           (breakPoint.md && (!(breakPoint.lg || breakPoint.xl || breakPoint.xxl)))
                               ? true
                               : ui.sidebar_collapse
                       }
                       className={'layout-sidebar'}>
                    <NavigationMenu state={state} screens={breakPoint}></NavigationMenu>
                </Sider> :
                <Drawer
                    styles={{
                        body: {
                            padding: 0,
                            margin: 0,
                            height: '100vh',
                            backgroundColor: ui.darkTheme ? '#001529' : '#fff',
                        },
                        header: {
                            padding: 0,
                            margin: 0,
                            visibility: 'hidden',
                            backgroundColor: ui.darkTheme ? '#001529' : '#fff',
                        },
                        footer: {
                            padding: 0,
                            margin: 0,
                            visibility: 'hidden',
                            backgroundColor: ui.darkTheme ? '#001529' : '#fff',
                        },
                        content: {
                            backgroundColor: ui.darkTheme ? '#001529' : '#fff',
                        }
                    }}
                    width={breakPoint.lg ? '250px' : '250px'}
                    title="Navigation Menu"
                    placement={'left'}
                    closable={true}
                    onClose={() => setUI({
                        ...ui,
                        sidebar_collapse: !ui.sidebar_collapse
                    })}
                    open={ui.sidebar_collapse}
                    key={'left'}
                >
                    <NavigationMenu state={state} screens={breakPoint}></NavigationMenu>
                </Drawer>}
        <Layout style={{
            marginLeft: (breakPoint.md && !breakPoint.lg
                ? 80
                : ((breakPoint.xs || breakPoint.sm && !breakPoint.lg)
                    ? 0
                    : (ui.sidebar_collapse ? 80 : 250)))
        }}>
            <Header className={classes.headerContainer} style={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                backgroundColor: colorBgContainer
            }}>
                {/*{JSON.stringify(breakPoint)}*/}
                {<Space>
                    <Button style={{display: (breakPoint.md && !breakPoint.lg) ? 'none' : 'block'}}
                            className={'layout--toggle'}
                            onClick={() => setUI({
                                ...ui,
                                sidebar_collapse: !ui.sidebar_collapse
                            })}
                            type={'text'}
                            icon={ui.sidebar_collapse ? <MenuUnfoldOutlined/> : <MenuOutlined/>}/>
                    {!breakPoint.xs && authUser && authUser.super_admin ? <>
                        <Select key={'user-list'}
                                defaultValue={state.current_user.id === state.authId ? null : state.current_user.id}
                                style={{minWidth: '250px', maxWidth: 'auto'}}
                                placeholder={'-- STAFF LIST --'}
                                allowClear={true}
                                showSearch={true}
                                onChange={val => switchLoggedInUser(val)}
                                optionFilterProp={'alt'}
                                options={
                                    state.users
                                        .sort((a: any, b: any) => a.name.localeCompare(b.name))
                                        .map((item: any, index: number) => ({
                                            key: index,
                                            alt: `${item.name}`,
                                            value: item.id,
                                            label: <>
                                                <UserOutlined/> {`[${item.id}] ${item.name}`}
                                            </>
                                        }))
                                }></Select>
                    </> : <></>}
                </Space>}
                <Flex justify={'flex-end'}>
                    <Space>
                        <Notification></Notification>
                        <Dropdown.Button
                            menu={{
                                items: [
                                    {key: 'profile', label: 'Profile', icon: <UserOutlined/>},
                                    {key: 'logout', label: 'Logout', icon: <LogoutOutlined/>},
                                ],
                                onClick: handleMenuClick
                            }}
                            placement="bottom"
                            icon={<UserOutlined/>}>
                            {state.current_user.name}
                        </Dropdown.Button>
                        <Button size={'small'} onClick={() => toggleTheme(!ui.darkTheme)}>
                            {ui.darkTheme ? <SunOutlined/> : <MoonOutlined/>}
                        </Button>
                    </Space>
                </Flex>
            </Header>
            <Content style={{
                width: '100%',
                padding: 24,
                minHeight: 280,
                borderRadius: borderRadiusLG,
            }}>{appLoaded && children}
            </Content>
            {/*<Footer style={{paddingTop: 0}}>*/}
            {/*    <Flex justify={'center'} align={'end'} vertical={true}>*/}
            {/*        <Typography.Text>Brilliant International ©{new Date().getFullYear()}</Typography.Text>*/}
            {/*        <Typography.Text>Created by Shashank Bhattarai</Typography.Text>*/}
            {/*    </Flex>*/}
            {/*</Footer>*/}
        </Layout>
    </Layout>
}

export default withStyles(styles)(MainLayout);