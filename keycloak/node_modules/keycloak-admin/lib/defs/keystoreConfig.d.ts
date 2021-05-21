export default interface KeyStoreConfig {
    realmCertificate?: boolean;
    storePassword?: string;
    keyPassword?: string;
    keyAlias?: string;
    realmAlias?: string;
    format?: string;
}
