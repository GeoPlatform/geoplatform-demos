import WhoAmIRepresentation from '../defs/whoAmIRepresentation';
import KeycloakAdminClient from '..';
import Resource from './resource';
export declare class WhoAmI extends Resource<{
    realm?: string;
}> {
    constructor(client: KeycloakAdminClient);
    find: (payload?: {
        realm?: string;
    }) => Promise<WhoAmIRepresentation>;
}
