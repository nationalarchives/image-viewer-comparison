define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Metric = /** @class */ (function () {
        function Metric(type, minWidth, maxWidth, minHeight, maxHeight) {
            this.type = type;
            this.minWidth = minWidth;
            this.maxWidth = maxWidth;
            this.minHeight = minHeight;
            this.maxHeight = maxHeight;
        }
        return Metric;
    }());
    exports.Metric = Metric;
});
