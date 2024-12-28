import {createContext, Dispatch, SetStateAction, useContext} from "react";


export interface AuthContextType {
    isAuthenticated: boolean;
    userHasAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    userHasAuthenticated: useAuthContext,
});

export function useAuthContext() {
    return useContext(AuthContext);
}

export interface dataStateContextType {
    state: any;
    setState: Dispatch<SetStateAction<boolean>>;
}

export const dataStateContext = createContext<dataStateContextType>({
    state: null,
    setState: useDataStateContext,
});

export function useDataStateContext() {
    return useContext(dataStateContext);
}

export interface LoaderContextType {
    preLoader: any;
    setPreLoader: Dispatch<SetStateAction<boolean>>;
}

export const LoaderContext = createContext<LoaderContextType>({
    preLoader: null,
    setPreLoader: useLoaderContext,
});

export function useLoaderContext() {
    return useContext(LoaderContext);
}

export interface uiStateContextType {
    ui: any;
    setUI: Dispatch<SetStateAction<boolean>>;
}

export const uiStateContext = createContext<uiStateContextType>({
    ui: null,
    setUI: useUIStateContext,
});

export function useUIStateContext() {
    return useContext(uiStateContext);
}