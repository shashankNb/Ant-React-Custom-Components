import {ReactElement} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useAuthContext} from "../core/contextLib.ts";

export default function AuthenticatedRoute(props: { children: ReactElement }) {

    const {pathname, search} = useLocation();
    const {isAuthenticated} = useAuthContext();

    if (!isAuthenticated) {
        return <Navigate to={`/auth/login?redirect=${pathname}${search}`} state={null}/>;
    }
    return props.children;
}