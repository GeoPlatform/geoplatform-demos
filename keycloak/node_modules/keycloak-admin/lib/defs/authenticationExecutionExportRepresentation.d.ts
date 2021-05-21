export default interface AuthenticationExecutionExportRepresentation {
    flowAlias?: string;
    userSetupAllowed?: boolean;
    authenticatorConfig?: string;
    authenticator?: string;
    requirement?: string;
    priority?: number;
    autheticatorFlow?: boolean;
}
