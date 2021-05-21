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
exports.Groups = void 0;
var resource_1 = __importDefault(require("./resource"));
var Groups = (function (_super) {
    __extends(Groups, _super);
    function Groups(client) {
        var _this = _super.call(this, client, {
            path: '/admin/realms/{realm}/groups',
            getUrlParams: function () { return ({
                realm: client.realmName
            }); },
            getBaseUrl: function () { return client.baseUrl; }
        }) || this;
        _this.find = _this.makeRequest({
            method: 'GET'
        });
        _this.create = _this.makeRequest({
            method: 'POST',
            returnResourceIdInLocationHeader: { field: 'id' }
        });
        _this.findOne = _this.makeRequest({
            method: 'GET',
            path: '/{id}',
            urlParamKeys: ['id'],
            catchNotFound: true
        });
        _this.update = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/{id}',
            urlParamKeys: ['id']
        });
        _this.del = _this.makeRequest({
            method: 'DELETE',
            path: '/{id}',
            urlParamKeys: ['id']
        });
        _this.count = _this.makeRequest({
            method: 'GET',
            path: '/count'
        });
        _this.setOrCreateChild = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/children',
            urlParamKeys: ['id'],
            returnResourceIdInLocationHeader: { field: 'id' }
        });
        _this.listMembers = _this.makeRequest({
            method: 'GET',
            path: '/{id}/members',
            urlParamKeys: ['id'],
            catchNotFound: true
        });
        _this.listRoleMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/role-mappings',
            urlParamKeys: ['id']
        });
        _this.addRealmRoleMappings = _this.makeRequest({
            method: 'POST',
            path: '/{id}/role-mappings/realm',
            urlParamKeys: ['id'],
            payloadKey: 'roles'
        });
        _this.listRealmRoleMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/role-mappings/realm',
            urlParamKeys: ['id']
        });
        _this.delRealmRoleMappings = _this.makeRequest({
            method: 'DELETE',
            path: '/{id}/role-mappings/realm',
            urlParamKeys: ['id'],
            payloadKey: 'roles'
        });
        _this.listAvailableRealmRoleMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/role-mappings/realm/available',
            urlParamKeys: ['id']
        });
        _this.listClientRoleMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/role-mappings/clients/{clientUniqueId}',
            urlParamKeys: ['id', 'clientUniqueId']
        });
        _this.addClientRoleMappings = _this.makeRequest({
            method: 'POST',
            path: '/{id}/role-mappings/clients/{clientUniqueId}',
            urlParamKeys: ['id', 'clientUniqueId'],
            payloadKey: 'roles'
        });
        _this.delClientRoleMappings = _this.makeRequest({
            method: 'DELETE',
            path: '/{id}/role-mappings/clients/{clientUniqueId}',
            urlParamKeys: ['id', 'clientUniqueId'],
            payloadKey: 'roles'
        });
        _this.listAvailableClientRoleMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/role-mappings/clients/{clientUniqueId}/available',
            urlParamKeys: ['id', 'clientUniqueId']
        });
        _this.updatePermission = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/{id}/management/permissions',
            urlParamKeys: ['id']
        });
        _this.listPermissions = _this.makeRequest({
            method: 'GET',
            path: '/{id}/management/permissions',
            urlParamKeys: ['id']
        });
        return _this;
    }
    return Groups;
}(resource_1["default"]));
exports.Groups = Groups;
//# sourceMappingURL=groups.js.map