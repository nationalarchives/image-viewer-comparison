define(["require", "exports", "../../modules/uv-shared-module/Point"], function (require, exports, Point_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Size = Utils.Size;
    var CroppedImageDimensions = /** @class */ (function () {
        function CroppedImageDimensions() {
            this.region = new Size(0, 0);
            this.regionPos = new Point_1.Point(0, 0);
            this.size = new Size(0, 0);
        }
        return CroppedImageDimensions;
    }());
    exports.CroppedImageDimensions = CroppedImageDimensions;
});
