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
exports.WhoAmI = void 0;
var resource_1 = __importDefault(require("./resource"));
var WhoAmI = (function (_super) {
    __extends(WhoAmI, _super);
    function WhoAmI(client) {
        var _this = _super.call(this, client, {
            path: '/admin/{realm}/console',
            getUrlParams: function () { return ({
                realm: client.realmName
            }); },
            getBaseUrl: function () { return client.baseUrl; }
        }) || this;
        _this.find = _this.makeRequest({
            method: 'GET',
            path: '/whoami'
        });
        return _this;
    }
    return WhoAmI;
}(resource_1["default"]));
exports.WhoAmI = WhoAmI;
//# sourceMappingURL=whoAmI.js.map