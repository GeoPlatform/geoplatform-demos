export interface RealmEventsConfigRepresentation {
    eventsEnabled?: boolean;
    eventsExpiration?: number;
    eventsListeners?: string[];
    enabledEventTypes?: string[];
    adminEventsEnabled?: boolean;
    adminEventsDetailsEnabled?: boolean;
}
