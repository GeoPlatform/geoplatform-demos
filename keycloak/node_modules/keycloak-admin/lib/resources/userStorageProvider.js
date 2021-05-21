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
exports.UserStorageProvider = void 0;
var resource_1 = __importDefault(require("./resource"));
var UserStorageProvider = (function (_super) {
    __extends(UserStorageProvider, _super);
    function UserStorageProvider(client) {
        var _this = _super.call(this, client, {
            path: '/admin/realms/{realm}/user-storage',
            getUrlParams: function () { return ({
                realm: client.realmName
            }); },
            getBaseUrl: function () { return client.baseUrl; }
        }) || this;
        _this.name = _this.makeRequest({
            method: 'GET',
            path: '/{id}/name',
            urlParamKeys: ['id']
        });
        _this.removeImportedUsers = _this.makeRequest({
            method: 'POST',
            path: '/{id}/remove-imported-users',
            urlParamKeys: ['id']
        });
        _this.sync = _this.makeRequest({
            method: 'POST',
            path: '/{id}/sync',
            urlParamKeys: ['id'],
            queryParamKeys: ['action']
        });
        _this.unlinkUsers = _this.makeRequest({
            method: 'POST',
            path: '/{id}/unlink-users',
            urlParamKeys: ['id']
        });
        _this.mappersSync = _this.makeRequest({
            method: 'POST',
            path: '/{parentId}/mappers/{id}/sync',
            urlParamKeys: ['id', 'parentId'],
            queryParamKeys: ['direction']
        });
        return _this;
    }
    return UserStorageProvider;
}(resource_1["default"]));
exports.UserStorageProvider = UserStorageProvider;
//# sourceMappingURL=userStorageProvider.js.map