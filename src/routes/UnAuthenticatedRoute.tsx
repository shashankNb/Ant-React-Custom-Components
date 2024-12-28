import {cloneElement, ReactElement} from "react";
import {Navigate} from "react-router-dom";
import {useAuthContext} from "../core/contextLib.ts";

const querystring = (name: string, url = window.location.href) => {
    const parsedName = name.replace(/[[]]/g, "\\$&");
    const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, "i");
    const results = regex.exec(url);

    if (!results || !results[2]) {
        return false;
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
export default function UnauthenticatedRoute(props: { children: ReactElement }) {
    const { isAuthenticated } = useAuthContext();
    const { children } = props;
    const redirect = querystring("redirect");

    if (isAuthenticated) {
        return <Navigate to={redirect || "/"} state={null} />;
    }

    return cloneElement(children, props);
}