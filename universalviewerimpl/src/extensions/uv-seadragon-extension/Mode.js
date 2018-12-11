define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Mode = /** @class */ (function () {
        function Mode(value) {
            this.value = value;
        }
        Mode.prototype.toString = function () {
            return this.value;
        };
        Mode.image = new Mode("image");
        Mode.page = new Mode("page");
        return Mode;
    }());
    exports.Mode = Mode;
});
