import { KeycloakAdminClient } from '../client';
import GroupRepresentation from '../defs/groupRepresentation';
import { ManagementPermissionReference } from '../defs/managementPermissionReference';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import RoleRepresentation, { RoleMappingPayload } from '../defs/roleRepresentation';
import UserRepresentation from '../defs/userRepresentation';
import Resource from './resource';
export interface GroupQuery {
    first?: number;
    max?: number;
    search?: string;
}
export interface GroupCountQuery {
    search?: string;
    top?: boolean;
}
export declare class Groups extends Resource<{
    realm?: string;
}> {
    find: (payload?: GroupQuery & {
        realm?: string;
    }) => Promise<GroupRepresentation[]>;
    create: (payload?: GroupRepresentation & {
        realm?: string;
    }) => Promise<{
        id: string;
    }>;
    findOne: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<GroupRepresentation>;
    update: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: GroupRepresentation) => Promise<void>;
    del: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    count: (payload?: GroupCountQuery & {
        realm?: string;
    }) => Promise<{
        count: number;
    }>;
    setOrCreateChild: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: GroupRepresentation) => Promise<{
        id: string;
    }>;
    listMembers: (payload?: {
        id: string;
        first?: number;
        max?: number;
    } & {
        realm?: string;
    }) => Promise<UserRepresentation[]>;
    listRoleMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<MappingsRepresentation>;
    addRealmRoleMappings: (payload?: {
        id: string;
        roles: RoleMappingPayload[];
    } & {
        realm?: string;
    }) => Promise<void>;
    listRealmRoleMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    delRealmRoleMappings: (payload?: {
        id: string;
        roles: RoleMappingPayload[];
    } & {
        realm?: string;
    }) => Promise<void>;
    listAvailableRealmRoleMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    listClientRoleMappings: (payload?: {
        id: string;
        clientUniqueId: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    addClientRoleMappings: (payload?: {
        id: string;
        clientUniqueId: string;
        roles: RoleMappingPayload[];
    } & {
        realm?: string;
    }) => Promise<void>;
    delClientRoleMappings: (payload?: {
        id: string;
        clientUniqueId: string;
        roles: RoleMappingPayload[];
    } & {
        realm?: string;
    }) => Promise<void>;
    listAvailableClientRoleMappings: (payload?: {
        id: string;
        clientUniqueId: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    updatePermission: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ManagementPermissionReference) => Promise<ManagementPermissionReference>;
    listPermissions: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ManagementPermissionReference>;
    constructor(client: KeycloakAdminClient);
}
