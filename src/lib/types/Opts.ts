
export interface IMWOpts {
    collectionPath?: string;

    appName?: string;
}

export const defaultMWOpts = {
    collectionPath: '/metrics',
    
    appName: ''
};
