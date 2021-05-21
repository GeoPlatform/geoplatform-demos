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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Clients = void 0;
var resource_1 = __importDefault(require("./resource"));
var Clients = (function (_super) {
    __extends(Clients, _super);
    function Clients(client) {
        var _this = _super.call(this, client, {
            path: '/admin/realms/{realm}/clients',
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
        _this.createRole = _this.makeRequest({
            method: 'POST',
            path: '/{id}/roles',
            urlParamKeys: ['id'],
            returnResourceIdInLocationHeader: { field: 'roleName' }
        });
        _this.listRoles = _this.makeRequest({
            method: 'GET',
            path: '/{id}/roles',
            urlParamKeys: ['id']
        });
        _this.findRole = _this.makeRequest({
            method: 'GET',
            path: '/{id}/roles/{roleName}',
            urlParamKeys: ['id', 'roleName'],
            catchNotFound: true
        });
        _this.updateRole = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/{id}/roles/{roleName}',
            urlParamKeys: ['id', 'roleName']
        });
        _this.delRole = _this.makeRequest({
            method: 'DELETE',
            path: '/{id}/roles/{roleName}',
            urlParamKeys: ['id', 'roleName']
        });
        _this.findUsersWithRole = _this.makeRequest({
            method: 'GET',
            path: '/{id}/roles/{roleName}/users',
            urlParamKeys: ['id', 'roleName']
        });
        _this.getServiceAccountUser = _this.makeRequest({
            method: 'GET',
            path: '/{id}/service-account-user',
            urlParamKeys: ['id']
        });
        _this.generateNewClientSecret = _this.makeRequest({
            method: 'POST',
            path: '/{id}/client-secret',
            urlParamKeys: ['id']
        });
        _this.generateRegistrationAccessToken = _this.makeRequest({
            method: 'POST',
            path: '/{id}/registration-access-token',
            urlParamKeys: ['id']
        });
        _this.getClientSecret = _this.makeRequest({
            method: 'GET',
            path: '/{id}/client-secret',
            urlParamKeys: ['id']
        });
        _this.listDefaultClientScopes = _this.makeRequest({
            method: 'GET',
            path: '/{id}/default-client-scopes',
            urlParamKeys: ['id']
        });
        _this.addDefaultClientScope = _this.makeRequest({
            method: 'PUT',
            path: '/{id}/default-client-scopes/{clientScopeId}',
            urlParamKeys: ['id', 'clientScopeId']
        });
        _this.delDefaultClientScope = _this.makeRequest({
            method: 'DELETE',
            path: '/{id}/default-client-scopes/{clientScopeId}',
            urlParamKeys: ['id', 'clientScopeId']
        });
        _this.listOptionalClientScopes = _this.makeRequest({
            method: 'GET',
            path: '/{id}/optional-client-scopes',
            urlParamKeys: ['id']
        });
        _this.addOptionalClientScope = _this.makeRequest({
            method: 'PUT',
            path: '/{id}/optional-client-scopes/{clientScopeId}',
            urlParamKeys: ['id', 'clientScopeId']
        });
        _this.delOptionalClientScope = _this.makeRequest({
            method: 'DELETE',
            path: '/{id}/optional-client-scopes/{clientScopeId}',
            urlParamKeys: ['id', 'clientScopeId']
        });
        _this.addMultipleProtocolMappers = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/protocol-mappers/add-models',
            urlParamKeys: ['id']
        });
        _this.addProtocolMapper = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/protocol-mappers/models',
            urlParamKeys: ['id']
        });
        _this.listProtocolMappers = _this.makeRequest({
            method: 'GET',
            path: '/{id}/protocol-mappers/models',
            urlParamKeys: ['id']
        });
        _this.findProtocolMapperById = _this.makeRequest({
            method: 'GET',
            path: '/{id}/protocol-mappers/models/{mapperId}',
            urlParamKeys: ['id', 'mapperId'],
            catchNotFound: true
        });
        _this.findProtocolMappersByProtocol = _this.makeRequest({
            method: 'GET',
            path: '/{id}/protocol-mappers/protocol/{protocol}',
            urlParamKeys: ['id', 'protocol'],
            catchNotFound: true
        });
        _this.updateProtocolMapper = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/{id}/protocol-mappers/models/{mapperId}',
            urlParamKeys: ['id', 'mapperId']
        });
        _this.delProtocolMapper = _this.makeRequest({
            method: 'DELETE',
            path: '/{id}/protocol-mappers/models/{mapperId}',
            urlParamKeys: ['id', 'mapperId']
        });
        _this.listScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/scope-mappings',
            urlParamKeys: ['id']
        });
        _this.addClientScopeMappings = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/scope-mappings/clients/{client}',
            urlParamKeys: ['id', 'client']
        });
        _this.listClientScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/scope-mappings/clients/{client}',
            urlParamKeys: ['id', 'client']
        });
        _this.listAvailableClientScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/scope-mappings/clients/{client}/available',
            urlParamKeys: ['id', 'client']
        });
        _this.listCompositeClientScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/scope-mappings/clients/{client}/available',
            urlParamKeys: ['id', 'client']
        });
        _this.delClientScopeMappings = _this.makeUpdateRequest({
            method: 'DELETE',
            path: '/{id}/scope-mappings/clients/{client}',
            urlParamKeys: ['id', 'client']
        });
        _this.evaluatePermission = _this.makeRequest({
            method: 'GET',
            path: '/{id}/evaluate-scopes/scope-mappings/{roleContainer}/{type}',
            urlParamKeys: ['id', 'roleContainer', 'type'],
            queryParamKeys: ['scope']
        });
        _this.evaluateListProtocolMapper = _this.makeRequest({
            method: 'GET',
            path: '/{id}/evaluate-scopes/protocol-mappers',
            urlParamKeys: ['id'],
            queryParamKeys: ['scope']
        });
        _this.evaluateGenerateAccessToken = _this.makeRequest({
            method: 'GET',
            path: '/{id}/evaluate-scopes/generate-example-access-token',
            urlParamKeys: ['id'],
            queryParamKeys: ['scope', 'userId']
        });
        _this.addRealmScopeMappings = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/scope-mappings/realm',
            urlParamKeys: ['id', 'client']
        });
        _this.listRealmScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/scope-mappings/realm',
            urlParamKeys: ['id']
        });
        _this.listAvailableRealmScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/scope-mappings/realm/available',
            urlParamKeys: ['id']
        });
        _this.listCompositeRealmScopeMappings = _this.makeRequest({
            method: 'GET',
            path: '/{id}/scope-mappings/realm/available',
            urlParamKeys: ['id']
        });
        _this.delRealmScopeMappings = _this.makeUpdateRequest({
            method: 'DELETE',
            path: '/{id}/scope-mappings/realm',
            urlParamKeys: ['id']
        });
        _this.listSessions = _this.makeRequest({
            method: 'GET',
            path: '/{id}/user-sessions',
            urlParamKeys: ['id']
        });
        _this.listOfflineSessions = _this.makeRequest({
            method: 'GET',
            path: '/{id}/offline-sessions',
            urlParamKeys: ['id']
        });
        _this.getSessionCount = _this.makeRequest({
            method: 'GET',
            path: '/{id}/session-count',
            urlParamKeys: ['id']
        });
        _this.listResources = _this.makeRequest({
            method: 'GET',
            path: '{id}/authz/resource-server/resource',
            urlParamKeys: ['id']
        });
        _this.createResource = _this.makeUpdateRequest({
            method: 'POST',
            path: '{id}/authz/resource-server/resource',
            urlParamKeys: ['id']
        });
        _this.updateResource = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/{id}/authz/resource-server/resource/{resourceId}',
            urlParamKeys: ['id', 'resourceId']
        });
        _this.delResource = _this.makeRequest({
            method: 'DELETE',
            path: '/{id}/authz/resource-server/resource/{resourceId}',
            urlParamKeys: ['id', 'resourceId']
        });
        _this.evaluateResource = _this.makeUpdateRequest({
            method: 'POST',
            path: '{id}/authz/resource-server/policy/evaluate',
            urlParamKeys: ['id']
        });
        _this.listPolicies = _this.makeRequest({
            method: 'GET',
            path: '{id}/authz/resource-server/policy',
            urlParamKeys: ['id']
        });
        _this.findPolicyByName = _this.makeRequest({
            method: 'GET',
            path: '{id}/authz/resource-server/policy/search',
            urlParamKeys: ['id']
        });
        _this.updatePolicy = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/{id}/authz/resource-server/policy/{type}/{policyId}',
            urlParamKeys: ['id', 'type', 'policyId']
        });
        _this.createPolicy = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/authz/resource-server/policy/{type}',
            urlParamKeys: ['id', 'type']
        });
        _this.findOnePolicy = _this.makeRequest({
            method: 'GET',
            path: '/{id}/authz/resource-server/policy/{type}/{policyId}',
            urlParamKeys: ['id', 'type', 'policyId'],
            catchNotFound: true
        });
        _this.delPolicy = _this.makeRequest({
            method: 'DELETE',
            path: '{id}/authz/resource-server/policy/{policyId}',
            urlParamKeys: ['id', 'policyId']
        });
        _this.listAllScopes = _this.makeRequest({
            method: 'GET',
            path: '/{id}/authz/resource-server/scope',
            urlParamKeys: ['id']
        });
        _this.listScopesByResource = _this.makeRequest({
            method: 'GET',
            path: '/{id}/authz/resource-server/resource/{resourceName}/scopes',
            urlParamKeys: ['id', 'resourceName']
        });
        _this.createAuthorizationScope = _this.makeUpdateRequest({
            method: 'POST',
            path: '{id}/authz/resource-server/scope',
            urlParamKeys: ['id']
        });
        _this.findPermissions = _this.makeRequest({
            method: 'GET',
            path: '{id}/authz/resource-server/permission',
            urlParamKeys: ['id']
        });
        _this.createPermission = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/authz/resource-server/permission/{type}',
            urlParamKeys: ['id', 'type']
        });
        _this.updatePermission = _this.makeUpdateRequest({
            method: 'PUT',
            path: '/{id}/authz/resource-server/permission/{type}/{permissionId}',
            urlParamKeys: ['id', 'type', 'permissionId']
        });
        _this.delPermission = _this.makeRequest({
            method: 'DELETE',
            path: '/{id}/authz/resource-server/permission/{type}/{permissionId}',
            urlParamKeys: ['id', 'type', 'permissionId']
        });
        _this.findOnePermission = _this.makeRequest({
            method: 'GET',
            path: '/{id}/authz/resource-server/permission/{type}/{permissionId}',
            urlParamKeys: ['id', 'type', 'permissionId']
        });
        _this.getOfflineSessionCount = _this.makeRequest({
            method: 'GET',
            path: '/{id}/offline-session-count',
            urlParamKeys: ['id']
        });
        _this.getInstallationProviders = _this.makeRequest({
            method: 'GET',
            path: '/{id}/installation/providers/{providerId}',
            urlParamKeys: ['id', 'providerId']
        });
        _this.pushRevocation = _this.makeRequest({
            method: 'POST',
            path: '/{id}/push-revocation',
            urlParamKeys: ['id']
        });
        _this.addClusterNode = _this.makeRequest({
            method: 'POST',
            path: '/{id}/nodes',
            urlParamKeys: ['id']
        });
        _this.deleteClusterNode = _this.makeRequest({
            method: 'DELETE',
            path: '/{id}/nodes/{node}',
            urlParamKeys: ['id', 'node']
        });
        _this.testNodesAvailable = _this.makeRequest({
            method: 'GET',
            path: '/{id}/test-nodes-available',
            urlParamKeys: ['id']
        });
        _this.getKeyInfo = _this.makeRequest({
            method: 'GET',
            path: '/{id}/certificates/{attr}',
            urlParamKeys: ['id', 'attr']
        });
        _this.generateKey = _this.makeRequest({
            method: 'POST',
            path: '/{id}/certificates/{attr}/generate',
            urlParamKeys: ['id', 'attr']
        });
        _this.downloadKey = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/certificates/{attr}/download',
            urlParamKeys: ['id', 'attr']
        });
        _this.generateAndDownloadKey = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/certificates/{attr}/generate-and-download',
            urlParamKeys: ['id', 'attr']
        });
        _this.uploadKey = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/certificates/{attr}/upload',
            urlParamKeys: ['id', 'attr']
        });
        _this.uploadCertificate = _this.makeUpdateRequest({
            method: 'POST',
            path: '/{id}/certificates/{attr}/upload-certificate',
            urlParamKeys: ['id', 'attr']
        });
        return _this;
    }
    Clients.prototype.createOrUpdatePolicy = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var policyFound;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.findPolicyByName({
                            id: payload.id,
                            name: payload.policyName
                        })];
                    case 1:
                        policyFound = _a.sent();
                        if (!policyFound) return [3, 3];
                        return [4, this.updatePolicy({ id: payload.id, policyId: policyFound.id, type: payload.policy.type }, payload.policy)];
                    case 2:
                        _a.sent();
                        return [2, this.findPolicyByName({ id: payload.id, name: payload.policyName })];
                    case 3: return [2, this.createPolicy({ id: payload.id, type: payload.policy.type }, payload.policy)];
                }
            });
        });
    };
    Clients.prototype.findProtocolMapperByName = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var allProtocolMappers, protocolMapper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.listProtocolMappers(__assign({ id: payload.id }, (payload.realm ? { realm: payload.realm } : {})))];
                    case 1:
                        allProtocolMappers = _a.sent();
                        protocolMapper = allProtocolMappers.find(function (mapper) { return mapper.name === payload.name; });
                        return [2, protocolMapper ? protocolMapper : null];
                }
            });
        });
    };
    return Clients;
}(resource_1["default"]));
exports.Clients = Clients;
//# sourceMappingURL=clients.js.map