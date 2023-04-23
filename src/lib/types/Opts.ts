
export interface IMWOpts {
    collectionPath?: string;

    appName?: string;

    escapeStatusCodes?: Array<number>;

    collectDefaultMetrics?: boolean;
}

export const defaultMWOpts = {
    collectionPath: '/metrics',
    
    appName: '',

    escapeStatusCodes: []
};
