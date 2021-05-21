export default interface SynchronizationResultRepresentation {
    ignored?: boolean;
    added?: number;
    updated?: number;
    removed?: number;
    failed?: number;
    status?: string;
}
