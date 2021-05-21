import RoleRepresentation from './roleRepresentation';
export default interface RolesRepresentation {
    realm?: RoleRepresentation[];
    client?: {
        [index: string]: RoleRepresentation[];
    };
    application?: {
        [index: string]: RoleRepresentation[];
    };
}
