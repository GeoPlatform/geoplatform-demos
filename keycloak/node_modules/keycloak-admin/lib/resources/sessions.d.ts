import Resource from './resource';
import KeycloakAdminClient from '..';
export declare class Sessions extends Resource<{
    realm?: string;
}> {
    find: (payload?: {
        realm?: string;
    }) => Promise<Record<string, any>[]>;
    constructor(client: KeycloakAdminClient);
}
