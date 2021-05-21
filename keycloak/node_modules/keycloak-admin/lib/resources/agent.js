"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Agent = void 0;
var url_join_1 = __importDefault(require("url-join"));
var url_template_1 = __importDefault(require("url-template"));
var axios_1 = __importDefault(require("axios"));
var lodash_1 = require("lodash");
var SLASH = '/';
var Agent = (function () {
    function Agent(_a) {
        var client = _a.client, _b = _a.path, path = _b === void 0 ? '/' : _b, _c = _a.getUrlParams, getUrlParams = _c === void 0 ? function () { return ({}); } : _c, _d = _a.getBaseUrl, getBaseUrl = _d === void 0 ? function () { return client.baseUrl; } : _d;
        this.client = client;
        this.getBaseParams = getUrlParams;
        this.getBaseUrl = getBaseUrl;
        this.basePath = path;
    }
    Agent.prototype.request = function (_a) {
        var _this = this;
        var method = _a.method, _b = _a.path, path = _b === void 0 ? '' : _b, _c = _a.urlParamKeys, urlParamKeys = _c === void 0 ? [] : _c, _d = _a.queryParamKeys, queryParamKeys = _d === void 0 ? [] : _d, _e = _a.catchNotFound, catchNotFound = _e === void 0 ? false : _e, keyTransform = _a.keyTransform, payloadKey = _a.payloadKey, returnResourceIdInLocationHeader = _a.returnResourceIdInLocationHeader;
        return function (payload) {
            if (payload === void 0) { payload = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var baseParams, queryParams, allUrlParamKeys, urlParams;
                return __generator(this, function (_a) {
                    baseParams = this.getBaseParams();
                    queryParams = queryParamKeys ? lodash_1.pick(payload, queryParamKeys) : null;
                    allUrlParamKeys = __spreadArrays(Object.keys(baseParams), urlParamKeys);
                    urlParams = __assign(__assign({}, baseParams), lodash_1.pick(payload, allUrlParamKeys));
                    payload = lodash_1.omit(payload, __spreadArrays(allUrlParamKeys, queryParamKeys));
                    if (keyTransform) {
                        this.transformKey(payload, keyTransform);
                        this.transformKey(queryParams, keyTransform);
                    }
                    return [2, this.requestWithParams({
                            method: method,
                            path: path,
                            payload: payload,
                            urlParams: urlParams,
                            queryParams: queryParams,
                            catchNotFound: catchNotFound,
                            payloadKey: payloadKey,
                            returnResourceIdInLocationHeader: returnResourceIdInLocationHeader
                        })];
                });
            });
        };
    };
    Agent.prototype.updateRequest = function (_a) {
        var _this = this;
        var method = _a.method, _b = _a.path, path = _b === void 0 ? '' : _b, _c = _a.urlParamKeys, urlParamKeys = _c === void 0 ? [] : _c, _d = _a.queryParamKeys, queryParamKeys = _d === void 0 ? [] : _d, _e = _a.catchNotFound, catchNotFound = _e === void 0 ? false : _e, keyTransform = _a.keyTransform, payloadKey = _a.payloadKey, returnResourceIdInLocationHeader = _a.returnResourceIdInLocationHeader;
        return function (query, payload) {
            if (query === void 0) { query = {}; }
            if (payload === void 0) { payload = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var baseParams, queryParams, allUrlParamKeys, urlParams;
                return __generator(this, function (_a) {
                    baseParams = this.getBaseParams();
                    queryParams = queryParamKeys ? lodash_1.pick(query, queryParamKeys) : null;
                    allUrlParamKeys = __spreadArrays(Object.keys(baseParams), urlParamKeys);
                    urlParams = __assign(__assign({}, baseParams), lodash_1.pick(query, allUrlParamKeys));
                    if (keyTransform) {
                        this.transformKey(queryParams, keyTransform);
                    }
                    return [2, this.requestWithParams({
                            method: method,
                            path: path,
                            payload: payload,
                            urlParams: urlParams,
                            queryParams: queryParams,
                            catchNotFound: catchNotFound,
                            payloadKey: payloadKey,
                            returnResourceIdInLocationHeader: returnResourceIdInLocationHeader
                        })];
                });
            });
        };
    };
    Agent.prototype.requestWithParams = function (_a) {
        var method = _a.method, path = _a.path, payload = _a.payload, urlParams = _a.urlParams, queryParams = _a.queryParams, catchNotFound = _a.catchNotFound, payloadKey = _a.payloadKey, returnResourceIdInLocationHeader = _a.returnResourceIdInLocationHeader;
        return __awaiter(this, void 0, void 0, function () {
            var newPath, pathTemplate, parsedPath, url, requestConfig, _b, _c, _d, res, locationHeader, resourceId, field, err_1;
            var _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        newPath = url_join_1["default"](this.basePath, path);
                        pathTemplate = url_template_1["default"].parse(newPath);
                        parsedPath = pathTemplate.expand(urlParams);
                        url = "" + this.getBaseUrl() + parsedPath;
                        requestConfig = __assign(__assign({}, this.client.getRequestConfig() || {}), { method: method,
                            url: url });
                        _b = requestConfig;
                        _c = [__assign({}, requestConfig.headers)];
                        _e = {};
                        _d = "bearer ";
                        return [4, this.client.getAccessToken()];
                    case 1:
                        _b.headers = __assign.apply(void 0, _c.concat([(_e.Authorization = _d + (_g.sent()), _e)]));
                        if (method === 'GET') {
                            requestConfig.params = payload;
                        }
                        else {
                            requestConfig.data = payloadKey ? payload[payloadKey] : payload;
                        }
                        if (queryParams) {
                            requestConfig.params = requestConfig.params
                                ? __assign(__assign({}, requestConfig.params), queryParams) : queryParams;
                        }
                        _g.label = 2;
                    case 2:
                        _g.trys.push([2, 4, , 5]);
                        return [4, axios_1["default"](requestConfig)];
                    case 3:
                        res = _g.sent();
                        if (returnResourceIdInLocationHeader) {
                            locationHeader = res.headers.location;
                            if (!locationHeader) {
                                throw new Error("location header is not found in request: " + res.config.url);
                            }
                            resourceId = lodash_1.last(locationHeader.split(SLASH));
                            if (!resourceId) {
                                throw new Error("resourceId is not found in Location header from request: " + res.config.url);
                            }
                            field = returnResourceIdInLocationHeader.field;
                            return [2, (_f = {}, _f[field] = resourceId, _f)];
                        }
                        return [2, res.data];
                    case 4:
                        err_1 = _g.sent();
                        if (err_1.response && err_1.response.status === 404 && catchNotFound) {
                            return [2, null];
                        }
                        throw err_1;
                    case 5: return [2];
                }
            });
        });
    };
    Agent.prototype.transformKey = function (payload, keyMapping) {
        if (!payload) {
            return;
        }
        Object.keys(keyMapping).some(function (key) {
            if (lodash_1.isUndefined(payload[key])) {
                return false;
            }
            var newKey = keyMapping[key];
            payload[newKey] = payload[key];
            delete payload[key];
        });
    };
    return Agent;
}());
exports.Agent = Agent;
//# sourceMappingURL=agent.js.map