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
exports.Roles = void 0;
var resource_1 = __importDefault(require("./resource"));
var Roles = (function (_super) {
    __extends(Roles, _super);
    function Roles(client) {
        var _this = _super.call(this, client, {
            path: '/admin/realms/{realm}',
            getUrlParams: function () { return ({
                realm: client.realmName
            }); },
            getBaseUrl: function () { return client.baseUrl; }
        }) || this;
        _this.find = _this.makeRequest({
            method: 'GET',
            path: '/roles'
        });
        _this.create = _this.makeRequest({
            method: 'POST',
            path: '/roles',
            returnResourceIdInLocationHeader: { field: 'roleName' }
        });
        _this.findOneByName = _this.makeRequest({
            method: 'GET',
            path: '/roles/{name}',
            urlParamKeys: ['name'],
            catchNotFound: true
        });
        _this.updateByName = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/roles/{name}',
            urlParamKeys: ['name']
        });
        _this.delByName = _this.makeRequest({
            method: 'DELETE',
            path: '/roles/{name}',
            urlParamKeys: ['name']
        });
        _this.findUsersWithRole = _this.makeRequest({
            method: 'GET',
            path: '/roles/{name}/users',
            urlParamKeys: ['name'],
            catchNotFound: true
        });
        _this.findOneById = _this.makeRequest({
            method: 'GET',
            path: '/roles-by-id/{id}',
            urlParamKeys: ['id'],
            catchNotFound: true
        });
        _this.createComposite = _this.makeUpdateRequest({
            method: 'POST',
            path: '/roles-by-id/{roleId}/composites',
            urlParamKeys: ['roleId']
        });
        _this.getCompositeRoles = _this.makeRequest({
            method: 'GET',
            path: '/roles-by-id/{id}/composites',
            urlParamKeys: ['id']
        });
        _this.getCompositeRolesForRealm = _this.makeRequest({
            method: 'GET',
            path: '/roles-by-id/{id}/composites/realm',
            urlParamKeys: ['id']
        });
        _this.getCompositeRolesForClient = _this.makeRequest({
            method: 'GET',
            path: '/roles-by-id/{id}/composites/clients/{clientId}',
            urlParamKeys: ['id', 'clientId']
        });
        _this.delCompositeRoles = _this.makeUpdateRequest({
            method: 'DELETE',
            path: '/roles-by-id/{id}/composites',
            urlParamKeys: ['id']
        });
        _this.updateById = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/roles-by-id/{id}',
            urlParamKeys: ['id']
        });
        _this.delById = _this.makeRequest({
            method: 'DELETE',
            path: '/roles-by-id/{id}',
            urlParamKeys: ['id']
        });
        return _this;
    }
    return Roles;
}(resource_1["default"]));
exports.Roles = Roles;
//# sourceMappingURL=roles.js.map