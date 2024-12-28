import axios from "./core/api";
import dayjs from "dayjs";
import {IRequestBody} from "./core/request.util.ts";

export const AppUrlConstants = {
    FETCH: '/common/fetch',
    ADVANCE_FETCH: '/common/advance-fetch',
    TABLE_FETCH: '/common/table/fetch',
    INSERT: '/common/insert',
    UPDATE: '/common/update',
    DELETE: '/common/delete'
}

export interface AppPayload {
    context: string;
    data?: any;
    condition?: any;
    fields?: string[];
}

export const AppAPI = {
    makeRequest: (url: any, payload: AppPayload) => axios.post(url, payload),
    apiRequest: (url: any, payload: any) => axios.post(url, payload),
    fetchRequest: (url: string, payload: IRequestBody) => axios.post(url, payload)
}

export const AppUtil = {
    dateTimestamp: (date: Date) => dayjs(date).startOf('day').format('YYYY-MM-DD'),
    fetchFromGooglePlacesAPI: (text: string, apiKey) => new Promise((resolve, reject) => {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&apiKey=${apiKey}`;
        fetch(url)
            .then(response => {
                // check if the call was successful
                if (response.ok) {
                    response.json().then(data => resolve(data));
                } else {
                    response.json().then(data => reject(data));
                }
            });
    }),
    fetchPlacesFromGoogleAPI: async (text: string, apiKey) => {
        let address = [];
        if (text != null && text != '' && text.length > 3) {
            const options: { [key: string]: any } = await AppUtil.fetchFromGooglePlacesAPI(text, apiKey);
            address = options.features.map(((item: { [key: string]: any }, index: any) => ({
                key: index,
                label: `${item.properties.address_line1}, ${item.properties.address_line2}`,
                value: `${item.properties.address_line1}, ${item.properties.address_line2}`,
                data: item.properties
            })));
        }
        return address;
    },
    toTitleCase: (str) => str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}
export const AppDefaults = {
    initializeData: async () => {
        const [users, countries, office_branches, settings, app]: any[] = await Promise.all([
            await AppAPI.makeRequest('/common/fetch', {context: 'users', fields: ['*']}),
            await axios.get('/common/countries'),
            await AppAPI.makeRequest("/common/fetch", {fields: ['branch_name', 'id', 'branch_logo'], context: 'office_branches'}),
            await AppAPI.makeRequest("/common/fetch", {fields: ['*'], context: 'settings'}),
            await axios.get("/app-info")
        ])
        return {
            users,
            countries: countries.map((item: any) => ({
                ...item,
                country: item.countryName,
                iso_alpha_3: item.countryCode
            })),
            office_branches,
            settings: settings.reduce((acc: any, {name, value}) => ({...acc, [name]: value}), {}),
            app: app
        };
    },
    initializeUI: async () => {
        return {
            sidebar_collapse: false,
            darkTheme: true
        }
    }
}

export const Echo = (data: any, key: string, symbol: string = '-') => {
    if (data === null || data === undefined || key === null || key === undefined) {
        return '-';
    }
    const keys = key.split('.');
    let value = data;

    for (const k of keys) {
        if (value && value.hasOwnProperty(k)) {
            value = value[k];
        } else {
            return symbol;
        }
    }
    return value !== null ? value : symbol;
}