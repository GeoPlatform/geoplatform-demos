export default interface ComponentExportRepresentation {
    id?: string;
    name?: string;
    providerId?: string;
    subType?: string;
    subComponents?: {
        [index: string]: ComponentExportRepresentation;
    };
    config?: {
        [index: string]: string;
    };
}
