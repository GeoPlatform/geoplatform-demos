import { KeycloakAdminClient } from '../client';
import ClientRepresentation from '../defs/clientRepresentation';
import ClientScopeRepresentation from '../defs/clientScopeRepresentation';
import CredentialRepresentation from '../defs/credentialRepresentation';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import PolicyRepresentation from '../defs/policyRepresentation';
import ResourceRepresentation from '../defs/resourceRepresentation';
import ProtocolMapperRepresentation from '../defs/protocolMapperRepresentation';
import RoleRepresentation from '../defs/roleRepresentation';
import UserRepresentation from '../defs/userRepresentation';
import UserSessionRepresentation from '../defs/userSessionRepresentation';
import ResourceEvaluation from '../defs/resourceEvaluation';
import GlobalRequestResult from '../defs/globalRequestResult';
import Resource from './resource';
import CertificateRepresentation from '../defs/certificateRepresentation';
import KeyStoreConfig from '../defs/keystoreConfig';
export interface ClientQuery {
    first?: number;
    max?: number;
    clientId?: string;
    viewableOnly?: boolean;
}
export interface PolicyQuery {
    id?: string;
    name?: string;
    type?: string;
    resource?: string;
    scope?: string;
    permission?: string;
    owner?: string;
    fields?: string;
    first?: number;
    max?: number;
}
export declare class Clients extends Resource<{
    realm?: string;
}> {
    find: (payload?: ClientQuery & {
        realm?: string;
    }) => Promise<ClientRepresentation[]>;
    create: (payload?: ClientRepresentation & {
        realm?: string;
    }) => Promise<{
        id: string;
    }>;
    findOne: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ClientRepresentation>;
    update: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ClientRepresentation) => Promise<void>;
    del: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    createRole: (payload?: RoleRepresentation & {
        realm?: string;
    }) => Promise<{
        roleName: string;
    }>;
    listRoles: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    findRole: (payload?: {
        id: string;
        roleName: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation>;
    updateRole: (query: {
        id: string;
        roleName: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation) => Promise<void>;
    delRole: (payload?: {
        id: string;
        roleName: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    findUsersWithRole: (payload?: {
        id: string;
        roleName: string;
        first?: number;
        max?: number;
    } & {
        realm?: string;
    }) => Promise<UserRepresentation[]>;
    getServiceAccountUser: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<UserRepresentation>;
    generateNewClientSecret: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<CredentialRepresentation>;
    generateRegistrationAccessToken: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<{
        registrationAccessToken: string;
    }>;
    getClientSecret: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<CredentialRepresentation>;
    listDefaultClientScopes: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ClientScopeRepresentation[]>;
    addDefaultClientScope: (payload?: {
        id: string;
        clientScopeId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    delDefaultClientScope: (payload?: {
        id: string;
        clientScopeId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    listOptionalClientScopes: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ClientScopeRepresentation[]>;
    addOptionalClientScope: (payload?: {
        id: string;
        clientScopeId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    delOptionalClientScope: (payload?: {
        id: string;
        clientScopeId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    addMultipleProtocolMappers: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ProtocolMapperRepresentation[]) => Promise<void>;
    addProtocolMapper: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ProtocolMapperRepresentation) => Promise<void>;
    listProtocolMappers: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ProtocolMapperRepresentation[]>;
    findProtocolMapperById: (payload?: {
        id: string;
        mapperId: string;
    } & {
        realm?: string;
    }) => Promise<ProtocolMapperRepresentation>;
    findProtocolMappersByProtocol: (payload?: {
        id: string;
        protocol: string;
    } & {
        realm?: string;
    }) => Promise<ProtocolMapperRepresentation[]>;
    updateProtocolMapper: (query: {
        id: string;
        mapperId: string;
    } & {
        realm?: string;
    }, payload: ProtocolMapperRepresentation) => Promise<void>;
    delProtocolMapper: (payload?: {
        id: string;
        mapperId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    listScopeMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<MappingsRepresentation>;
    addClientScopeMappings: (query: {
        id: string;
        client: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation[]) => Promise<void>;
    listClientScopeMappings: (payload?: {
        id: string;
        client: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    listAvailableClientScopeMappings: (payload?: {
        id: string;
        client: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    listCompositeClientScopeMappings: (payload?: {
        id: string;
        client: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    delClientScopeMappings: (query: {
        id: string;
        client: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation[]) => Promise<void>;
    evaluatePermission: (payload?: {
        id: string;
        roleContainer: string;
        type: 'granted' | 'not-granted';
        scope: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    evaluateListProtocolMapper: (payload?: {
        id: string;
        scope: string;
    } & {
        realm?: string;
    }) => Promise<ProtocolMapperRepresentation[]>;
    evaluateGenerateAccessToken: (payload?: {
        id: string;
        scope: string;
        userId: string;
    } & {
        realm?: string;
    }) => Promise<object>;
    addRealmScopeMappings: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation[]) => Promise<void>;
    listRealmScopeMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    listAvailableRealmScopeMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    listCompositeRealmScopeMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    delRealmScopeMappings: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation[]) => Promise<void>;
    listSessions: (payload?: {
        id: string;
        first?: number;
        max?: number;
    } & {
        realm?: string;
    }) => Promise<UserSessionRepresentation[]>;
    listOfflineSessions: (payload?: {
        id: string;
        first?: number;
        max?: number;
    } & {
        realm?: string;
    }) => Promise<UserSessionRepresentation[]>;
    getSessionCount: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<{
        count: number;
    }>;
    listResources: (payload?: {
        id: string;
        name: string;
    } & {
        realm?: string;
    }) => Promise<ResourceRepresentation[]>;
    createResource: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ResourceRepresentation) => Promise<ResourceRepresentation>;
    updateResource: (query: {
        id: string;
        resourceId: string;
    } & {
        realm?: string;
    }, payload: ResourceRepresentation) => Promise<void>;
    delResource: (payload?: {
        id: string;
        resourceId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    evaluateResource: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ResourceEvaluation) => Promise<any>;
    listPolicies: (payload?: PolicyQuery & {
        realm?: string;
    }) => Promise<PolicyRepresentation[]>;
    findPolicyByName: (payload?: {
        id: string;
        name: string;
    } & {
        realm?: string;
    }) => Promise<PolicyRepresentation>;
    updatePolicy: (query: {
        id: string;
        type: string;
        policyId: string;
    } & {
        realm?: string;
    }, payload: PolicyRepresentation) => Promise<void>;
    createPolicy: (query: {
        id: string;
        type: string;
    } & {
        realm?: string;
    }, payload: PolicyRepresentation) => Promise<PolicyRepresentation>;
    findOnePolicy: (payload?: {
        id: string;
        type: string;
        policyId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    delPolicy: (payload?: {
        id: string;
        policyId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    createOrUpdatePolicy(payload: {
        id: string;
        policyName: string;
        policy: PolicyRepresentation;
    }): Promise<PolicyRepresentation>;
    listAllScopes: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<any>;
    listScopesByResource: (payload?: {
        id: string;
        resourceName: string;
    } & {
        realm?: string;
    }) => Promise<{
        id: string;
        name: string;
    }[]>;
    createAuthorizationScope: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: {
        name: string;
        displayName?: string;
        iconUri?: string;
    }) => Promise<any>;
    findPermissions: (payload?: {
        id: string;
        name: string;
    } & {
        realm?: string;
    }) => Promise<PolicyRepresentation[]>;
    createPermission: (query: {
        id: string;
        type: string;
    } & {
        realm?: string;
    }, payload: PolicyRepresentation) => Promise<PolicyRepresentation>;
    updatePermission: (query: {
        id: string;
        type: string;
        permissionId: string;
    } & {
        realm?: string;
    }, payload: PolicyRepresentation) => Promise<void>;
    delPermission: (payload?: {
        id: string;
        type: string;
        permissionId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    findOnePermission: (payload?: {
        id: string;
        type: string;
        permissionId: string;
    } & {
        realm?: string;
    }) => Promise<PolicyRepresentation>;
    getOfflineSessionCount: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<{
        count: number;
    }>;
    getInstallationProviders: (payload?: {
        id: string;
        providerId: string;
    } & {
        realm?: string;
    }) => Promise<string>;
    pushRevocation: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    addClusterNode: (payload?: {
        id: string;
        node: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    deleteClusterNode: (payload?: {
        id: string;
        node: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    testNodesAvailable: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<GlobalRequestResult>;
    getKeyInfo: (payload?: {
        id: string;
        attr: string;
    } & {
        realm?: string;
    }) => Promise<CertificateRepresentation>;
    generateKey: (payload?: {
        id: string;
        attr: string;
    } & {
        realm?: string;
    }) => Promise<CertificateRepresentation>;
    downloadKey: (query: {
        id: string;
        attr: string;
    } & {
        realm?: string;
    }, payload: KeyStoreConfig) => Promise<string>;
    generateAndDownloadKey: (query: {
        id: string;
        attr: string;
    } & {
        realm?: string;
    }, payload: KeyStoreConfig) => Promise<string>;
    uploadKey: (query: {
        id: string;
        attr: string;
    } & {
        realm?: string;
    }, payload: any) => Promise<any>;
    uploadCertificate: (query: {
        id: string;
        attr: string;
    } & {
        realm?: string;
    }, payload: any) => Promise<any>;
    constructor(client: KeycloakAdminClient);
    findProtocolMapperByName(payload: {
        realm?: string;
        id: string;
        name: string;
    }): Promise<ProtocolMapperRepresentation>;
}
