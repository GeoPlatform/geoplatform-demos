"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Realms = void 0;
var resource_1 = __importDefault(require("./resource"));
var Realms = (function (_super) {
    __extends(Realms, _super);
    function Realms(client) {
        var _this = _super.call(this, client, {
            path: '/admin/realms',
            getBaseUrl: function () { return client.baseUrl; }
        }) || this;
        _this.find = _this.makeRequest({
            method: 'GET'
        });
        _this.create = _this.makeRequest({
            method: 'POST',
            returnResourceIdInLocationHeader: { field: 'realmName' }
        });
        _this.findOne = _this.makeRequest({
            method: 'GET',
            path: '/{realm}',
            urlParamKeys: ['realm'],
            catchNotFound: true
        });
        _this.update = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/{realm}',
            urlParamKeys: ['realm']
        });
        _this.del = _this.makeRequest({
            method: 'DELETE',
            path: '/{realm}',
            urlParamKeys: ['realm']
        });
        _this["export"] = _this.makeRequest({
            method: 'POST',
            path: '/{realm}/partial-export',
            urlParamKeys: ['realm'],
            queryParamKeys: [
                'exportClients',
                'exportGroupsAndRoles',
            ]
        });
        _this.findEvents = _this.makeRequest({
            method: 'GET',
            path: '/{realm}/events',
            urlParamKeys: ['realm'],
            queryParamKeys: [
                'client',
                'dateFrom',
                'dateTo',
                'first',
                'ipAddress',
                'max',
                'type',
                'user',
            ]
        });
        _this.getConfigEvents = _this.makeRequest({
            method: 'GET',
            path: '/{realm}/events/config',
            urlParamKeys: ['realm']
        });
        _this.updateConfigEvents = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/{realm}/events/config',
            urlParamKeys: ['realm']
        });
        _this.clearEvents = _this.makeRequest({
            method: 'DELETE',
            path: '/{realm}/events',
            urlParamKeys: ['realm']
        });
        _this.clearAdminEvents = _this.makeRequest({
            method: 'DELETE',
            path: '/{realm}/admin-events',
            urlParamKeys: ['realm']
        });
        _this.getClientsInitialAccess = _this.makeRequest({
            method: 'GET',
            path: '/{realm}/clients-initial-access',
            urlParamKeys: ['realm']
        });
        _this.createClientsInitialAccess = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{realm}/clients-initial-access',
            urlParamKeys: ['realm']
        });
        _this.delClientsInitialAccess = _this.makeRequest({
            method: 'DELETE',
            path: '/{realm}/clients-initial-access/{id}',
            urlParamKeys: ['realm', 'id']
        });
        _this.removeSession = _this.makeRequest({
            method: 'DELETE',
            path: '/{realm}/sessions/{session}',
            urlParamKeys: ['realm', 'session'],
            catchNotFound: true
        });
        _this.findAdminEvents = _this.makeRequest({
            method: 'GET',
            path: '/{realm}/admin-events',
            urlParamKeys: ['realm'],
            queryParamKeys: [
                'authClient',
                'authIpAddress',
                'authRealm',
                'authUser',
                'dateFrom',
                'dateTo',
                'max',
                'first',
                'operationTypes',
                'resourcePath',
                'resourceTypes',
            ]
        });
        _this.getUsersManagementPermissions = _this.makeRequest({
            method: 'GET',
            path: '/{realm}/users-management-permissions',
            urlParamKeys: ['realm']
        });
        _this.updateUsersManagementPermissions = _this.makeRequest({
            method: 'PUT',
            path: '/{realm}/users-management-permissions',
            urlParamKeys: ['realm']
        });
        _this.logoutAll = _this.makeRequest({
            method: 'POST',
            path: '/{realm}/logout-all',
            urlParamKeys: ['realm']
        });
        _this.deleteSession = _this.makeRequest({
            method: 'DELETE',
            path: '/{realm}/sessions/{session}',
            urlParamKeys: ['realm', 'session']
        });
        _this.getKeys = _this.makeRequest({
            method: 'GET',
            path: '/{realm}/keys',
            urlParamKeys: ['realm']
        });
        _this.testLDAPConnection = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{realm}/testLDAPConnection',
            urlParamKeys: ['realm']
        });
        return _this;
    }
    return Realms;
}(resource_1["default"]));
exports.Realms = Realms;
//# sourceMappingURL=realms.js.map