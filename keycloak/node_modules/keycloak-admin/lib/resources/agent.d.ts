import { Method } from 'axios';
import { KeycloakAdminClient } from '../client';
export interface RequestArgs {
    method: Method;
    path?: string;
    urlParamKeys?: string[];
    queryParamKeys?: string[];
    keyTransform?: Record<string, string>;
    catchNotFound?: boolean;
    payloadKey?: string;
    returnResourceIdInLocationHeader?: {
        field: string;
    };
}
export declare class Agent {
    private client;
    private basePath;
    private getBaseParams?;
    private getBaseUrl?;
    constructor({ client, path, getUrlParams, getBaseUrl, }: {
        client: KeycloakAdminClient;
        path?: string;
        getUrlParams?: () => Record<string, any>;
        getBaseUrl?: () => string;
    });
    request({ method, path, urlParamKeys, queryParamKeys, catchNotFound, keyTransform, payloadKey, returnResourceIdInLocationHeader, }: RequestArgs): (payload?: any) => Promise<any>;
    updateRequest({ method, path, urlParamKeys, queryParamKeys, catchNotFound, keyTransform, payloadKey, returnResourceIdInLocationHeader, }: RequestArgs): (query?: any, payload?: any) => Promise<any>;
    private requestWithParams;
    private transformKey;
}
