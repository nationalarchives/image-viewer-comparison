var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./UVDataProvider"], function (require, exports, UVDataProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var URLDataProvider = /** @class */ (function (_super) {
        __extends(URLDataProvider, _super);
        function URLDataProvider(readonly) {
            return _super.call(this, readonly) || this;
        }
        URLDataProvider.prototype.get = function (key, defaultValue) {
            return Utils.Urls.getHashParameter(key, document) || defaultValue;
        };
        URLDataProvider.prototype.set = function (key, value) {
            if (!this.readonly) {
                if (value) {
                    Utils.Urls.setHashParameter(key, value.toString(), document);
                }
                else {
                    Utils.Urls.setHashParameter(key, '', document);
                }
            }
        };
        return URLDataProvider;
    }(UVDataProvider_1.UVDataProvider));
    exports.default = URLDataProvider;
});
