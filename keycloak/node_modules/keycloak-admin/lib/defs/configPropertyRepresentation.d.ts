export interface ConfigPropertyRepresentation {
    name?: string;
    label?: string;
    helpText?: string;
    type?: string;
    defaultValue?: object;
    options?: string[];
    secret?: boolean;
}
