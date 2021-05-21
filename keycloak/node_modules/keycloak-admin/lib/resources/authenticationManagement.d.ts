import Resource from './resource';
import RequiredActionProviderRepresentation from '../defs/requiredActionProviderRepresentation';
import { KeycloakAdminClient } from '../client';
import AuthenticationExecutionInfoRepresentation from '../defs/authenticationExecutionInfoRepresentation';
import AuthenticationFlowRepresentation from '../defs/authenticationFlowRepresentation';
export declare class AuthenticationManagement extends Resource {
    registerRequiredAction: (payload?: Record<string, any>) => Promise<any>;
    getRequiredActions: (payload?: void & {}) => Promise<any>;
    getRequiredActionForAlias: (payload?: {
        alias: string;
    }) => Promise<any>;
    getClientAuthenticatorProviders: (payload?: {
        id: string;
    }) => Promise<{
        id: string;
        displayName: string;
    }[]>;
    updateRequiredAction: (query: {
        alias: string;
    }, payload: RequiredActionProviderRepresentation) => Promise<void>;
    deleteRequiredAction: (payload?: {
        alias: string;
    }) => Promise<void>;
    lowerRequiredActionPriority: (payload?: {
        alias: string;
    }) => Promise<any>;
    raiseRequiredActionPriority: (payload?: {
        alias: string;
    }) => Promise<any>;
    getUnregisteredRequiredActions: (payload?: void & {}) => Promise<any>;
    getFlows: (payload?: void & {}) => Promise<AuthenticationFlowRepresentation[]>;
    createFlow: (payload?: AuthenticationFlowRepresentation) => Promise<void>;
    copyFlow: (payload?: {
        flow: string;
        newName: string;
    }) => Promise<any>;
    deleteFlow: (payload?: {
        flowId: string;
    }) => Promise<any>;
    updateFlow: (query: {
        flowId: string;
    }, payload: AuthenticationFlowRepresentation) => Promise<any>;
    getExecutions: (payload?: {
        flow: string;
    }) => Promise<AuthenticationExecutionInfoRepresentation[]>;
    addExecution: (query: {
        flow: string;
    }, payload: AuthenticationExecutionInfoRepresentation) => Promise<any>;
    addExecutionToFlow: (payload?: {
        flow: string;
        provider: string;
    }) => Promise<AuthenticationExecutionInfoRepresentation>;
    addFlowToFlow: (payload?: {
        flow: string;
        alias: string;
        type: string;
        provider: string;
        description: string;
    }) => Promise<AuthenticationFlowRepresentation>;
    updateExecution: (query: {
        flow: string;
    }, payload: AuthenticationExecutionInfoRepresentation) => Promise<any>;
    delExecution: (payload?: {
        id: string;
    }) => Promise<any>;
    lowerPriorityExecution: (payload?: {
        id: string;
    }) => Promise<any>;
    raisePriorityExecution: (payload?: {
        id: string;
    }) => Promise<any>;
    constructor(client: KeycloakAdminClient);
}
