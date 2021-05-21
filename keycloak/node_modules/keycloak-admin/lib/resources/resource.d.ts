import { KeycloakAdminClient } from '../client';
import { RequestArgs } from './agent';
export default class Resource<ParamType = {}> {
    private agent;
    constructor(client: KeycloakAdminClient, settings?: {
        path?: string;
        getUrlParams?: () => Record<string, any>;
        getBaseUrl?: () => string;
    });
    makeRequest: <PayloadType = any, ResponseType_1 = any>(args: RequestArgs) => (payload?: PayloadType & ParamType) => Promise<ResponseType_1>;
    makeUpdateRequest: <QueryType = any, PayloadType = any, ResponseType_1 = any>(args: RequestArgs) => (query: QueryType & ParamType, payload: PayloadType) => Promise<ResponseType_1>;
}
