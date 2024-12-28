import {FireFilled} from "../../bundles/Icons.tsx";
import Logo from "../Logo/Logo.tsx";
import {Flex, Image, Menu} from "../../bundles/AntD.tsx";
import {indexRoutes, Routes} from "../../routes/routes.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useUIStateContext} from "../../core/contextLib.ts";
import {useEffect, useState} from "react";
import {Storage} from "../../core/storage.ts";
import useStyles from "../../Styles.tsx";
import {TenantUtil} from "../../core/client-app.ts";

const NavigationMenu = ({state, screens}) => {

    const classes = useStyles();

    const location = useLocation();
    const navigate = useNavigate();
    const {ui} = useUIStateContext();
    const [brandLogoUrl, setBrandLogoUrl] = useState<string>(null);
    const isOnlyTablet = () => screens.md && (!(screens.lg || screens.xl || screens.xxl || screens.xs));
    const isMobileDevice = () => (screens.sm || screens.xs) && !screens.md;
    const isRegularScreen = () => (screens.lg || screens.xl || screens.xxl);

    const getSelectedMenuKey = () => {
        const route = indexRoutes.flatMap((route: any) => [route, ...(route.views || [])]).filter(i => i.sidebar).find(item => item.path.includes(location.pathname));
        return route ? [route.key] : [];
    }

    const navigateToPage = (key: string) => {
        const data = indexRoutes.flatMap((route: any) => [route, ...(route.views || [])]).find(i => i.key === key);
        navigate(data.path);
        if (isMobileDevice()) {
            ui.sidebar_collapse = false;
        }
    }

    const makeSidebarMenu = (items: Routes[]): any[] => {
        return items
            .filter(item => item.sidebar && (state.current_user.super_admin || !item.superAdmin)) // Filter based on sidebar and superAdmin
            .map(item => {
                const menu: any = {
                    key: item.key,
                    label: item.name,
                    icon: item.icon
                };
                if (item.views && item.views.filter(view => view.sidebar && (state.current_user.super_admin || !view.superAdmin)).length > 0) {
                    menu.children = makeSidebarMenu(item.views.filter(view => view.sidebar && (state.current_user.super_admin || !view.superAdmin)));
                }
                return menu;
            });
    }

    const fetchBrandLogo = async () => {
        const branch = state.office_branches.find(i => i.id === state.current_user.branch_id);
        const defaultUrl  = `https://prod-crm-bucket.s3.ap-southeast-2.amazonaws.com/${state.app.id}/public/${state.settings.company_logo}`;
        const url = `https://prod-crm-bucket.s3.ap-southeast-2.amazonaws.com/${TenantUtil.DIR_NAME(state, `/branch/${branch.id}`)}/${branch.branch_logo}`
        setBrandLogoUrl(url || defaultUrl);
    }

    useEffect(() => {
        fetchBrandLogo().then(() => console.log('Loaded Brand Logo'));
    }, [state.current_user]);

    return (
        <>
            {
                isOnlyTablet() || (isRegularScreen() && ui.sidebar_collapse)
                    ? <div className={'layout-logo'}>
                        <div className="layout--logo-icon">
                            <FireFilled/>
                        </div>
                    </div> : <div className="demo-logo-vertical">
                        <div style={{marginTop: '10px'}}>
                            <Logo width={'200px'} alt={'company_logo'}></Logo>
                        </div>
                    </div>
            }
            <Flex justify={'center'}>
                <Image src={brandLogoUrl} className={classes.p1}></Image>
                {/*<span style={{color: ui.darkTheme ? '#fff' : '#000'}}>*/}
                {/*    {*/}
                {/*        ((isRegularScreen() && !ui.sidebar_collapse) || isMobileDevice()) && !ui.sidebar_collapse && state.current_user['name'].split(" ").map((word: string) => word.charAt(0).toUpperCase()).join("")*/}
                {/*    }*/}
                {/*</span>*/}
            </Flex>
            <Menu onClick={(e) => navigateToPage(e.key)} inlineIndent={10}
                  items={makeSidebarMenu(indexRoutes.filter(i => i.sidebar))} defaultSelectedKeys={getSelectedMenuKey()}
                  mode={'inline'} className={'layout--menu-bar'}
                  theme={ui.darkTheme ? 'dark' : 'light'}>
            </Menu>
        </>
    )
}

export default NavigationMenu;