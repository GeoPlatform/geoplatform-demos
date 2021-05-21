import Resource from './resource';
import { KeycloakAdminClient } from '../client';
export declare class Cache extends Resource<{
    realm?: string;
}> {
    clearUserCache: (payload?: {
        realm?: string;
    }) => Promise<void>;
    constructor(client: KeycloakAdminClient);
}
