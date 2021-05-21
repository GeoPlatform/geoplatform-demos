import Resource from './resource';
import KeycloakAdminClient from '..';
export declare class AttackDetection extends Resource<{
    realm?: string;
}> {
    findOne: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<Record<string, any>>;
    del: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    delAll: (payload?: {
        realm?: string;
    }) => Promise<void>;
    constructor(client: KeycloakAdminClient);
}
