define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UVUtils = /** @class */ (function () {
        function UVUtils() {
        }
        UVUtils.sanitize = function (html) {
            return filterXSS(html, {
                whiteList: {
                    a: ["href", "title", "target", "class"],
                    b: [],
                    br: [],
                    i: [],
                    img: ["src"],
                    p: [],
                    small: [],
                    span: [],
                    sub: [],
                    sup: []
                }
            });
        };
        UVUtils.isValidUrl = function (value) {
            var a = document.createElement('a');
            a.href = value;
            return (!!a.host && a.host !== window.location.host);
        };
        UVUtils.propertiesChanged = function (newData, currentData, properties) {
            var propChanged = false;
            for (var i = 0; i < properties.length; i++) {
                propChanged = UVUtils.propertyChanged(newData, currentData, properties[i]);
                if (propChanged) {
                    break;
                }
            }
            return propChanged;
        };
        UVUtils.propertyChanged = function (newData, currentData, propertyName) {
            return newData[propertyName] !== undefined && currentData[propertyName] !== newData[propertyName];
        };
        return UVUtils;
    }());
    exports.UVUtils = UVUtils;
});
