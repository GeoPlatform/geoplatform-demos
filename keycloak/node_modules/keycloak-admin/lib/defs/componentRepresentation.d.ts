export default interface ComponentRepresentation {
    id?: string;
    name?: string;
    providerId?: string;
    providerType?: string;
    parentId?: string;
    subType?: string;
    config?: {
        [index: string]: string | string[];
    };
}
