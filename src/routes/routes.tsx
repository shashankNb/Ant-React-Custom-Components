import React, { FunctionComponent } from "react";
import {
    DashboardOutlined,
    UserOutlined
} from "../bundles/Icons.tsx";

export interface Routes {
    key: string;
    path: string;
    name: string;
    icon: any;
    component?: FunctionComponent,
    views?: Routes[],
    sidebar: boolean,
    authenticatedRoute: boolean,
    superAdmin?: boolean
}

export const indexRoutes: Routes[] = [
    {
        key: 'dashboard',
        path: '/',
        name: 'Dashboard',
        icon: <DashboardOutlined />,
        component: React.lazy(() => import('../pages/Dashboard/HomeDashboard.tsx')),
        sidebar: true,
        authenticatedRoute: false
    }
];
