define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Bounds = /** @class */ (function () {
        function Bounds(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        Bounds.prototype.toString = function () {
            return this.x + "," + this.y + "," + this.w + "," + this.h;
        };
        Bounds.fromString = function (bounds) {
            var boundsArr = bounds.split(',');
            return new Bounds(Number(boundsArr[0]), Number(boundsArr[1]), Number(boundsArr[2]), Number(boundsArr[3]));
        };
        return Bounds;
    }());
    exports.Bounds = Bounds;
});
