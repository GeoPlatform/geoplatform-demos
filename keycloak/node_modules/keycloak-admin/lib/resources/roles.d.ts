import Resource from './resource';
import RoleRepresentation from '../defs/roleRepresentation';
import UserRepresentation from '../defs/userRepresentation';
import { KeycloakAdminClient } from '../client';
export declare class Roles extends Resource<{
    realm?: string;
}> {
    find: (payload?: {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    create: (payload?: RoleRepresentation & {
        realm?: string;
    }) => Promise<{
        roleName: string;
    }>;
    findOneByName: (payload?: {
        name: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation>;
    updateByName: (query: {
        name: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation) => Promise<void>;
    delByName: (payload?: {
        name: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    findUsersWithRole: (payload?: {
        name: string;
        first?: number;
        max?: number;
    } & {
        realm?: string;
    }) => Promise<UserRepresentation[]>;
    findOneById: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation>;
    createComposite: (query: {
        roleId: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation[]) => Promise<void>;
    getCompositeRoles: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    getCompositeRolesForRealm: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    getCompositeRolesForClient: (payload?: {
        id: string;
        clientId: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    delCompositeRoles: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation[]) => Promise<void>;
    updateById: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation) => Promise<void>;
    delById: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    constructor(client: KeycloakAdminClient);
}
