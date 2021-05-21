export default interface KeysMetadataRepresentation {
    active?: {
        [index: string]: string;
    };
    keys?: KeyMetadataRepresentation[];
}
export interface KeyMetadataRepresentation {
    providerId?: string;
    providerPriority?: number;
    kid?: string;
    status?: string;
    type?: string;
    algorithm?: string;
    publicKey?: string;
    certificate?: string;
}
