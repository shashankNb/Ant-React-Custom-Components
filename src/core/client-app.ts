export const ClientApp = {
    DEV: {label: 'CRM [DEV]', appId: '000-001', host: 'localhost'},
    QA: {label: 'CRM (QA)', appId: '000-002', host: 'qa.yourdomain.com'},
    PROD: {label: 'CRM (QA)', appId: '000-003', host: 'prod.yourdomain.com'},
    BEC: {label: 'Your Company Name', appId: '000-004', host: 'crm.yourdomain.com'},
}

export const TenantUtil = {
    DIR_NAME: (state: { [key: string]: any }, path: string) => `${state.app.id}${path}`
}

export const databaseSelection = [
    {host: ClientApp.DEV.host, appId: ClientApp.DEV.appId, label: ClientApp.DEV.label},
    {host: ClientApp.QA.host, appId: ClientApp.QA.appId, label: ClientApp.QA.label},
    {host: ClientApp.PROD.host, appId: ClientApp.PROD.appId, label: ClientApp.PROD.label},
    {host: ClientApp.BEC.host, appId: ClientApp.BEC.appId, label: ClientApp.BEC.label},
]