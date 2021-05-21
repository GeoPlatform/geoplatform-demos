import { ConfigPropertyRepresentation } from './configPropertyRepresentation';
export default interface ComponentTypeRepresentation {
    id: string;
    helpText: string;
    properties: ConfigPropertyRepresentation[];
    metadata: {
        [index: string]: any;
    };
}
