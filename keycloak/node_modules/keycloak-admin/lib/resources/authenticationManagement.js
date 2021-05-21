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
exports.AuthenticationManagement = void 0;
var resource_1 = __importDefault(require("./resource"));
var AuthenticationManagement = (function (_super) {
    __extends(AuthenticationManagement, _super);
    function AuthenticationManagement(client) {
        var _this = _super.call(this, client, {
            path: '/admin/realms/{realm}/authentication',
            getUrlParams: function () { return ({
                realm: client.realmName
            }); },
            getBaseUrl: function () { return client.baseUrl; }
        }) || this;
        _this.registerRequiredAction = _this.makeRequest({
            method: 'POST',
            path: '/register-required-action'
        });
        _this.getRequiredActions = _this.makeRequest({
            method: 'GET',
            path: '/required-actions'
        });
        _this.getRequiredActionForAlias = _this.makeRequest({
            method: 'GET',
            path: '/required-actions/{alias}',
            urlParamKeys: ['alias'],
            catchNotFound: true
        });
        _this.getClientAuthenticatorProviders = _this.makeRequest({
            method: 'GET',
            path: '/client-authenticator-providers'
        });
        _this.updateRequiredAction = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/required-actions/{alias}',
            urlParamKeys: ['alias']
        });
        _this.deleteRequiredAction = _this.makeRequest({
            method: 'DELETE',
            path: '/required-actions/{alias}',
            urlParamKeys: ['alias']
        });
        _this.lowerRequiredActionPriority = _this.makeRequest({
            method: 'POST',
            path: '/required-actions/{alias}/lower-priority',
            urlParamKeys: ['alias']
        });
        _this.raiseRequiredActionPriority = _this.makeRequest({
            method: 'POST',
            path: '/required-actions/{alias}/raise-priority',
            urlParamKeys: ['alias']
        });
        _this.getUnregisteredRequiredActions = _this.makeRequest({
            method: 'GET',
            path: '/unregistered-required-actions'
        });
        _this.getFlows = _this.makeRequest({
            method: 'GET',
            path: '/flows'
        });
        _this.createFlow = _this.makeRequest({
            method: 'POST',
            path: '/flows',
            returnResourceIdInLocationHeader: { field: 'id' }
        });
        _this.copyFlow = _this.makeRequest({
            method: 'POST',
            path: '/flows/{flow}/copy',
            urlParamKeys: ['flow']
        });
        _this.deleteFlow = _this.makeRequest({
            method: 'DELETE',
            path: '/flows/{flowId}',
            urlParamKeys: ['flowId']
        });
        _this.updateFlow = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/flows/{flowId}',
            urlParamKeys: ['flowId']
        });
        _this.getExecutions = _this.makeRequest({
            method: 'GET',
            path: '/flows/{flow}/executions',
            urlParamKeys: ['flow']
        });
        _this.addExecution = _this.makeUpdateRequest({
            method: 'POST',
            path: '/flows/{flow}/executions',
            urlParamKeys: ['flow']
        });
        _this.addExecutionToFlow = _this.makeRequest({
            method: 'POST',
            path: '/flows/{flow}/executions/execution',
            urlParamKeys: ['flow'],
            returnResourceIdInLocationHeader: { field: 'id' }
        });
        _this.addFlowToFlow = _this.makeRequest({
            method: 'POST',
            path: '/flows/{flow}/executions/flow',
            urlParamKeys: ['flow'],
            returnResourceIdInLocationHeader: { field: 'id' }
        });
        _this.updateExecution = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/flows/{flow}/executions',
            urlParamKeys: ['flow']
        });
        _this.delExecution = _this.makeRequest({
            method: 'DELETE',
            path: '/executions/{id}',
            urlParamKeys: ['id']
        });
        _this.lowerPriorityExecution = _this.makeRequest({
            method: 'POST',
            path: '/executions/{id}/lower-priority',
            urlParamKeys: ['id']
        });
        _this.raisePriorityExecution = _this.makeRequest({
            method: 'POST',
            path: '/executions/{id}/raise-priority',
            urlParamKeys: ['id']
        });
        return _this;
    }
    return AuthenticationManagement;
}(resource_1["default"]));
exports.AuthenticationManagement = AuthenticationManagement;
//# sourceMappingURL=authenticationManagement.js.map