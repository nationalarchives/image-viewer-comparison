define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UVDataProvider = /** @class */ (function () {
        function UVDataProvider(readonly) {
            this.readonly = false;
            this.readonly = readonly;
        }
        UVDataProvider.prototype.get = function (key, defaultValue) {
            return null;
        };
        UVDataProvider.prototype.set = function (key, value) {
        };
        return UVDataProvider;
    }());
    exports.UVDataProvider = UVDataProvider;
});
