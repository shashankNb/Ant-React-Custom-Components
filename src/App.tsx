import React, {Suspense, useEffect, useState} from 'react'
import {Route, Routes, useNavigate} from "react-router-dom";
import AuthenticatedRoute from "./routes/AuthenticatedRoute.tsx";
import UnauthenticatedRoute from "./routes/UnAuthenticatedRoute.tsx";
import {indexRoutes, Routes as Routers} from './routes/routes.tsx'
import {AppDefaults} from "./AppUtil.ts";
import { databaseSelection } from './core/client-app.ts';
import {
    AuthContext,
    AuthContextType,
    dataStateContext,
    dataStateContextType,
    LoaderContext,
    LoaderContextType,
    uiStateContext,
    uiStateContextType
} from "./core/contextLib.ts";
import Loading from "./components/Loaders/Loading.tsx";
import MainLayout from "./components/Layouts/MainLayout.tsx";
import './App.css'

function App({theme}) {

    const [appLoaded, setAppLoaded] = useState<boolean>(false);
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [state, setState] = useState({});
    const [ui, setUI] = useState({});
    const [preLoader, setPreLoader] = useState<boolean>(true);
    const navigate = useNavigate();

    const buildRoutes = (pageRoutes: Routers[]) => {
        return pageRoutes.map(route => {
            return (
                <Route key={route.path} path={route.path} element={
                    route.authenticatedRoute
                        ? <AuthenticatedRoute>
                            <MainLayout state={state}
                                        setState={setState}
                                        ui={ui}
                                        setUI={setUI}
                                        appLoaded={appLoaded}
                                        theme={theme}
                                        userHasAuthenticated={userHasAuthenticated}
                                        setPreLoader={setPreLoader}>
                                <Suspense fallback={'Loading...'}>
                                    <route.component/>
                                </Suspense>
                            </MainLayout>
                        </AuthenticatedRoute>
                        : <UnauthenticatedRoute>
                            <Suspense fallback={'Loading...'}>
                                <route.component/>
                            </Suspense>
                        </UnauthenticatedRoute>
                }></Route>
            );
        });
    }

    async function onAppLoad() {
        setAppLoaded(true);
        setPreLoader(false);
    }

    const setClientApplicationId = () => {
        const app = databaseSelection.find(item => item.host === window.location.hostname);
        if (app) {
            localStorage.setItem("appId", app.appId);
        } else {
            navigate('/page-not-found');
        }
    }

    useEffect(() => {
        setClientApplicationId();
        onAppLoad();
    }, [0])

    return (
        <>
            {appLoaded && <AuthContext.Provider value={{isAuthenticated, userHasAuthenticated} as AuthContextType}>
                <dataStateContext.Provider value={{state, setState} as dataStateContextType}>
                    <uiStateContext.Provider value={{ui, setUI} as uiStateContextType}>
                        <LoaderContext.Provider value={{preLoader, setPreLoader} as LoaderContextType}>
                            <Routes>
                                {buildRoutes(indexRoutes.flatMap((route: any) => [route, ...(route.views || [])]))}
                            </Routes>
                        </LoaderContext.Provider>
                    </uiStateContext.Provider>
                </dataStateContext.Provider>
            </AuthContext.Provider>}
            {(preLoader || !appLoaded) && <Loading></Loading>}
        </>
    )
}

export default App;
