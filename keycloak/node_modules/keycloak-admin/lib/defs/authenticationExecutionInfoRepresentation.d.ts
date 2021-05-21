export default interface AuthenticationExecutionInfoRepresentation {
    id?: string;
    requirement?: string;
    displayName?: string;
    alias?: string;
    description?: string;
    requirementChoices?: string[];
    configurable?: boolean;
    authenticationFlow?: boolean;
    providerId?: string;
    authenticationConfig?: string;
    flowId?: string;
    level?: number;
    index?: number;
}
