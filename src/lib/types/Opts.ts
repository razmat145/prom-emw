
export interface IMWOpts {
    collectionPath?: string;

    appName?: string;

    escapeStatusCodes?: Array<number>;
}

export const defaultMWOpts = {
    collectionPath: '/metrics',
    
    appName: '',

    escapeStatusCodes: []
};
