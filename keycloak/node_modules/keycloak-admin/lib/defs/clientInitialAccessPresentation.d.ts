export default interface ClientInitialAccessPresentation {
    id?: string;
    token?: string;
    timestamp?: number;
    expiration?: number;
    count?: number;
    remainingCount?: number;
}
