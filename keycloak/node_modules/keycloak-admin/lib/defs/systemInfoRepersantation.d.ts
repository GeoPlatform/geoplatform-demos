export default interface SystemInfoRepresentation {
    version?: string;
    serverTime?: string;
    uptime?: string;
    uptimeMillis?: number;
    javaVersion?: string;
    javaVendor?: string;
    javaVm?: string;
    javaVmVersion?: string;
    javaRuntime?: string;
    javaHome?: string;
    osName?: string;
    osArchitecture?: string;
    osVersion?: string;
    fileEncoding?: string;
    userName?: string;
    userDir?: string;
    userTimezone?: string;
    userLocale?: string;
}
