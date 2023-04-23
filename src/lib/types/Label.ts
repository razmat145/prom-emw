
export type TDefaultLabel = 'path'
    | 'method'
    | 'statusCode';

export const defaultLabels: TDefaultLabel[] = ['path', 'method', 'statusCode'];

export interface IDefaultLabels extends Record<TDefaultLabel | string, string> {
    path: string;

    method: string;

    statusCode: string;
}